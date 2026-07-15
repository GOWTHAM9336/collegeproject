// Simple HTTP Basic Auth gate for the admin dashboard and admin API.
// Credentials come from .env (ADMIN_USER / ADMIN_PASS) — never hardcode them here.

function adminAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1] || "";
  const decoded = Buffer.from(token, "base64").toString();
  const [login, password] = decoded.split(":");

  if (login === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Gowtham Mess Admin"');
  return res.status(401).send("Authentication required.");
}

module.exports = adminAuth;
