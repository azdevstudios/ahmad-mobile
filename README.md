# Ahmed Mobile

Ahmed Mobile is a mobile store website and management dashboard built with Next.js, React, MongoDB, and Cloudinary.

## Run locally

1. Install dependencies with **npm install**.
2. Add the database, authentication, Cloudinary, and email values to **.env.local**.
3. Start the development server with **npm run dev**.
4. Open [http://localhost:3000](http://localhost:3000).

Use **npm run lint** to check code quality and **npm run build** to create a production build.

## First admin account

Admin pages require a signed-in session. When the database has no admin account, open **/admin/setup**, enter the client’s name/email and agreed temporary password, and provide **ADMIN_SETUP_KEY** from **.env.local**. Setup is one time; public registration is disabled after the first account is created.

The initial password must be at least 12 characters. The client can change it from **Admin → Account** after signing in. Password changes and resets close other active sessions.

## Gmail password recovery

Password reset emails use Gmail SMTP. Configure these server-only environment values:

- **SMTP_HOST=smtp.gmail.com**
- **SMTP_PORT=465**
- **SMTP_USER** — the sender’s Gmail or Google Workspace address
- **SMTP_PASS** — a Google App Password (keep it private)
- **SMTP_FROM** — optional display sender address
- **APP_URL** — the site’s full origin; use the HTTPS production domain after deployment

The forgot-password page is available at **/admin/forgot-password**. Reset links expire after 20 minutes and can be used once. Recovery stays unavailable until the Gmail and **APP_URL** values are configured.

Never put MongoDB, Cloudinary, Gmail, setup, or auth secrets in client-side variables or commit them to source control. **.env.local** is ignored by Git.

## Main areas

- Storefront: home, phones, used phones, installment phones, services, and about pages.
- Admin dashboard: inventory, services, store settings, and dashboard summaries.
- Catalog data: products and services are stored in MongoDB and shared between admin and public pages.
- Product photography: images are uploaded through Cloudinary.

## Project structure

- **src/app**: pages, layouts, and API routes.
- **src/components**: storefront and admin interface components.
- **src/lib**: database, authentication, and catalog helpers.
- **src/models**: MongoDB models.
- **public**: static assets.
