# Cinebook Frontend

Customer-facing Cinebook UI built with React, Vite, React Router, Axios, and plain CSS.

## Run locally

```sh
npm install
npm run dev
```

## Hosted backend

The shared Axios client defaults to `/api`. During local development, the Vite server proxies `/api/*` to `http://34.58.239.191:8080/*`, avoiding the hosted server's current missing CORS headers for browser requests.

The Vite development proxy does not run in a production build. Production must use a same-origin reverse proxy or configure the backend for the deployed UI's CORS origin. Use HTTPS before sending passwords or personal booking data; the hosted URL is currently HTTP.

The customer UI currently reads listed shows, theatres, hall mappings, hall details, and hall seats. Show and theatre data comes from the hosted backend; seat layout is read-only because the API does not expose show-specific seat availability. Login, registration, booking, and booking history are not wired until the backend provides secure authentication and booking guarantees.
