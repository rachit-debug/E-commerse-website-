# TODO - Email (OTP) not sending

- [ ] Locate and verify backend email env configuration (GMAIL_USER, GMAIL_PASS) in server runtime.
- [ ] Trigger resend OTP and capture backend log line: `[sendEmailForOtp] ...`.
- [ ] Fix root cause based on error (auth/app-password, TLS/connectivity, Gmail blocking).
- [ ] (Optional hardening) Update `registerUser` to fail/notify if `sendEmailForOtp` returns false.
- [ ] Test: register + resend OTP + verify OTP flow.
