# Human Input Needed

The core timer experience builds and runs without third-party credentials, but these production features require configuration before launch:

1. `DATABASE_URL`
   Use a persistent production database. The app is currently configured for Prisma with SQLite in `prisma/schema.prisma`, so either:
   - provide a writable persistent SQLite volume and keep `DATABASE_URL` like `file:./prisma/prod.db`, or
   - switch Prisma to PostgreSQL and provide the corresponding connection string.

2. `AUTH_SECRET`
   Generate a secure value for Auth.js:
   ```bash
   openssl rand -base64 32
   ```

3. `NEXT_PUBLIC_APP_URL`
   Set this to the public HTTPS origin for the deployed app, for example:
   ```bash
   NEXT_PUBLIC_APP_URL="https://sessiontimer.example.com"
   ```

4. Stripe billing values, if paid plans are being enabled
   Required env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
   - `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`

5. `RESEND_API_KEY`, if transactional email is being enabled
   Needed for welcome/pro confirmation emails.
