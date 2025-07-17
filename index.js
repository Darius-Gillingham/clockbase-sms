// File: index.js
// Commit: Express server entry point for clockbase-sms Twilio + Supabase API

require('dotenv').config()
const express = require('express')
const cors = require('cors')

const sendCode = require('./sendCode')
const verifyCode = require('./verifyCode')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post('/send-code', sendCode)
app.post('/verify-code', verifyCode)

app.get('/', (req, res) => {
  res.send('clockbase-sms server is running')
})

app.listen(PORT, () => {
  console.log(`clockbase-sms server listening on port ${PORT}`)
})
