// File: sendCode.js
// Commit: Generate 6-digit code, store in Supabase, and send via Twilio

const supabase = require('./supabase')
const twilio = require('./twilio')

module.exports = async (req, res) => {
  const { phone } = req.body

  if (!phone || !/^\+\d{10,15}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now

  const { error: dbError } = await supabase
    .from('verifications')
    .upsert({ phone, code, expires_at, used: false })

  if (dbError) {
    return res.status(500).json({ error: 'Failed to store verification code' })
  }

  try {
    await twilio.messages.create({
      body: `Your Clockbase verification code is: ${code}`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: phone,
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to send SMS' })
  }
}
