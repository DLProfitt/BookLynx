const AWS = require('aws-sdk');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

AWS.config.update({ region: process.env.AWS_REGION });

const secretsManager = new AWS.SecretsManager();
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

exports.handler = async (event) => {
  const { email, userId } = event;
  
  try {
    const pool = await getRDSConnection();
    const result = await pool.query('SELECT * FROM reading_data WHERE user_id = $1', [userId]);

    let readingSummary = 'Reading Summary:\n\n';
    result.rows.forEach(row => {
      readingSummary += `Book ID: ${row.book_id}, Pages Read: ${row.pages_read}, Date: ${row.timestamp}\n`;
    });

    const mailOptions = {
      from: process.env.SES_EMAIL,
      subject: 'Your Reading Summary',
      text: readingSummary,
      to: email,
    };

    const transporter = nodemailer.createTransport({
      SES: ses
    });

    await transporter.sendMail(mailOptions);
    
    return { statusCode: 200, body: 'Email sent successfully' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error sending email' };
  }
};
