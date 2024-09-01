const express = require('express');
const AWS = require('aws-sdk');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3();
const secretsManager = new AWS.SecretsManager();
const cloudwatchevents = new AWS.CloudWatchEvents();
const ses = new AWS.SES();

async function getSecret(secretName) {
  const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  if ('SecretString' in data) {
    return JSON.parse(data.SecretString);
  }
  let buff = Buffer.from(data.SecretBinary, 'base64');
  return JSON.parse(buff.toString('ascii'));
}

const getRDSConnection = async () => {
  const secret = await getSecret(process.env.AWS_SECRET_NAME);
  return new Pool({
    user: secret.username,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DB_NAME,
    password: secret.password,
    port: process.env.RDS_PORT,
  });
};

app.get('/api/books', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'books.json',
    };
    const data = await s3.getObject(params).promise();
    const books = JSON.parse(data.Body.toString('utf-8'));
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books from S3' });
  }
});

app.get('/api/goals', async (req, res) => {
  try {
    const pool = await getRDSConnection();
    const result = await pool.query('SELECT * FROM goals');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching goals from RDS' });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const { user_id, book_id, goal } = req.body;
    const pool = await getRDSConnection();
    await pool.query('INSERT INTO goals (user_id, book_id, goal) VALUES ($1, $2, $3)', [user_id, book_id, goal]);
    res.status(201).json({ message: 'Goal added' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding goal to RDS' });
  }
});

app.get('/api/reading', async (req, res) => {
  try {
    const pool = await getRDSConnection();
    const result = await pool.query('SELECT * FROM reading_data');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reading data from RDS' });
  }
});

app.post('/api/reading', async (req, res) => {
  try {
    const { user_id, book_id, pages_read, timestamp } = req.body;
    const pool = await getRDSConnection();
    await pool.query('INSERT INTO reading_data (user_id, book_id, pages_read, timestamp) VALUES ($1, $2, $3, $4)', [user_id, book_id, pages_read, timestamp]);
    res.status(201).json({ message: 'Reading data added' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding reading data to RDS' });
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const pool = await getRDSConnection();
    const result = await pool.query('SELECT * FROM notes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes from RDS' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { user_id, book_id, note } = req.body;
    const pool = await getRDSConnection();
    await pool.query('INSERT INTO notes (user_id, book_id, note) VALUES ($1, $2, $3)', [user_id, book_id, note]);
    res.status(201).json({ message: 'Note added' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding note to RDS' });
  }
});

app.post('/api/schedule', async (req, res) => {
  const { email, userId, scheduleExpression } = req.body;

  const ruleParams = {
    Name: `BookLynxEmailSchedule_${userId}`,
    ScheduleExpression: scheduleExpression,
    State: 'ENABLED',
  };

  const targetParams = {
    Rule: `BookLynxEmailSchedule_${userId}`,
    Targets: [
      {
        Id: '1',
        Arn: process.env.LAMBDA_ARN,
        Input: JSON.stringify({ email, userId })
      }
    ]
  };

  try {
    await cloudwatchevents.putRule(ruleParams).promise();
    await cloudwatchevents.putTargets(targetParams).promise();
    res.status(201).json({ message: 'Email schedule set' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error setting email schedule' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
