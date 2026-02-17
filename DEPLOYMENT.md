# WIP

## Before deployment
- Add environment variables:
  - PORT: Port number for the server (default: 3000)
  - MONGO_URI: MongoDB connection string
  - JWT_SECRET: Secret key for JWT token generation
  - JWT_EXPIRES_IN: JWT token expiration time
  - JWT_ISSUER: JWT token issuer
  - PAYPAL_CLIENT_ID: PayPal Client ID (from PayPal Developer Dashboard)
  - PAYPAL_CLIENT_SECRET: PayPal Client Secret (from PayPal Developer Dashboard)
  - PAYPAL_ENVIRONMENT: PayPal environment ('sandbox' or 'live', default: 'sandbox')
  - FRONTEND_URL: Frontend URL for PayPal return/cancel URLs (default: 'http://localhost:3000')

## After deployment