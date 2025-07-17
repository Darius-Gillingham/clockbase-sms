// File: sendCode.js
// Commit: Hardcode SMS target to +12364587488 for private admin login

const supabase = require('./supabase')
const twilio = require('./twilio')

module.exports = async (_req, res) => {
  const phone = '+12364587488'

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
