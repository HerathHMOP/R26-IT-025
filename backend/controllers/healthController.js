function healthCheck(_req, res) {
  res.json({ ok: true, service: "backend-api" });
}

module.exports = { healthCheck };
