// File: verifyCode.js
// Commit: Validate submitted code from user and mark it as used in Supabase

const supabase = require('./supabase')

module.exports = async (req, res) => {
  const { phone, code } = req.body

  if (!phone || !code || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid input' })
  }

  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('phone', phone)
    .eq('code', code)
    .eq('used', false)
    .maybeSingle()

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid or expired code' })
  }

  const now = new Date()
  if (new Date(data.expires_at) < now) {
    return res.status(400).json({ error: 'Code expired' })
  }

  const { error: updateError } = await supabase
    .from('verifications')
    .update({ used: true })
    .eq('phone', phone)
    .eq('code', code)

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update verification status' })
  }

  res.json({ success: true })
}
