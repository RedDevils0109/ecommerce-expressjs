const env = require('dotenv');

env.config();

const SECRET_KEY = process.env.capcha_key; // Use a descriptive constant

exports.validateCaptcha = async (token) => {
  if (!SECRET_KEY) {
    throw new Error('Missing reCAPTCHA secret key (capcha_key) in .env file');
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`;
  try {
    const response = await fetch(verificationUrl);
    if (!response.ok) {
      throw new Error(`CAPTCHA verification failed with status code: ${response.status}`);
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error validating CAPTCHA:', error);
    return false; 
  }
};
