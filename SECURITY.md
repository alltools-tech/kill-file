# Security Policy

## Supported Versions

We support the latest major version of Kill File. Older versions may not receive security updates.

---

## Reporting a Vulnerability

If you discover a security vulnerability in Kill File:

- **Do NOT create a public issue.**
- Email us at: [security@killfile.io](mailto:security@killfile.io)
- Or contact via [Telegram @killfile_support](https://t.me/killfile_support)
- Or use GitHub's [private security advisories](https://github.com/alltools-tech/killfile/security/advisories)

Please include:
- Steps to reproduce the vulnerability
- Impact and severity
- Your contact details

---

## Responsible Disclosure

We appreciate responsible disclosure. We'll investigate and respond as quickly as possible.  
If the vulnerability is confirmed, you'll be credited (unless you wish to remain anonymous).

---

## Security Best Practices

- Validate all uploads (file type, size)
- Keep dependencies updated (`pip install -r requirements.txt`)
- Deploy behind HTTPS, reverse proxy (Nginx/Caddy)
- Use environment variables for secrets (never commit secrets)
- Regularly review code for security risks

---

## Contact

- Email: [security@killfile.io](mailto:security@killfile.io)
- Telegram: [@killfile_support](https://t.me/killfile_support)