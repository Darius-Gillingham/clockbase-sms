// File: twilio.js
// Commit: Twilio client instance using environment credentials

const { Twilio } = require('twilio')

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

module.exports = twilio
