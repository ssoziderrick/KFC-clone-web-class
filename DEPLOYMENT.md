# KFC Clone — repair and deployment guide

This is a cleaned working copy of the uploaded project. `Backend/` is the Express/Mongoose API; `frontend/kfc-app/` is the React application. `node_modules` and the original `.env` are intentionally excluded; install dependencies locally and configure secrets yourself.

## What was wrong / incomplete

- Frontend API calls pointed at the retired `kfcapi.herokuapp.com` host instead of the local API, so login, menu/cart requests and checkout could fail even while React rendered. API requests now use `src/utils/api.js` and `REACT_APP_API_URL`.
- Login JWT claims incorrectly read `userDetails.firstname` etc. from the model object instead of the matched user document. The API now signs claims from the user, returns a `token`, validates inputs and uses HTTP error status codes.
- Signup could continue after detecting an existing email, and several errors were returned as HTTP 200. These cases are fixed.
- The database cart was shared globally by every visitor. Cart endpoints now scope items by an `x-cart-id` generated per browser, so different browsers do not see one another's carts. This is guest/browser-scoped; tying a cart to an authenticated account across devices is a further production enhancement. If the existing MongoDB `carts` collection already has the old unique index on `id`, back up the collection and remove that old index before running the revised version (`db.carts.dropIndex("id_1")` in mongosh if that is the exact existing index name). The new index is compound (`cartKey`, `id`).
- Authentication screens used nonstandard `/api/Auth/login` and `/api/Auth/signup` frontend routes; they now use `/login` and `/signup`. Backend endpoints remain `/Auth/login` and `/Auth/signup`.
- Checkout now places persisted cash-on-delivery orders in UGX, calculates totals on the server from the cart snapshot, and clears the cart after saving. Online payment remains disabled: the legacy Razorpay route is configured for INR. Cart prices still originate in the browser's static menu data, so load prices from a trusted server catalog before accepting real orders or enabling payments.
- Product images/data are partly static (`SliderData.json`) and partly database-driven. Menu cards built from static JSON may not have MongoDB `_id` values; navigation to `/menu/undefined` and cart ID collisions can still occur unless product IDs are normalized. Check the menu card data as part of the local smoke test.
- No account-protected routes, password reset/email verification, rate limiting, order history, or automated integration tests are included.

## 1. Requirements

Install Node.js 18+ and Git. Use MongoDB Atlas or a local MongoDB server. Never commit `.env` files or production credentials.

## 2. Start MongoDB

1. Create a MongoDB Atlas cluster (or use local MongoDB).
2. Create a database user and allow network access from your development IP. For a hosted API, add the host's required outbound/network access according to the host's instructions; avoid `0.0.0.0/0` if a narrower rule is possible.
3. Copy `Backend/.env.example` to `Backend/.env`; replace `DATABASE` with your connection string and set `SECRET_KEY` to a long random value. Login returns a configuration error until this secret is set and the API is restarted.

## 3. Run the backend

```bash
cd Backend
npm install
npm run dev
```

Visit `http://localhost:8080/`. It should return a JSON status message. If MongoDB fails, check the `DATABASE` value, database user password URL-encoding, Atlas network access, and database permissions.

## 4. Run the frontend

Open a second terminal:

```bash
cd frontend/kfc-app
npm install
```

Copy `.env.example` to `.env` in `frontend/kfc-app/` and set `REACT_APP_API_URL=http://localhost:8080`. Then run:

```bash
npm start
```

The app should open at `http://localhost:3000`. If you change the frontend `.env`, restart `npm start`.

## 5. Seed/check menu products

The API reads products from MongoDB at `GET /api/product/menu`; the current UI also uses local `src/SliderData.json`. Make sure each menu card has a stable ID, a valid image source, a numeric price, and a type matching the section filter. If the menu should be fully database-driven, seed the `menu` collection and update menu components to fetch it rather than relying on static JSON. Relative image paths must be served from `public/` or imported from `src/`; remote image URLs must be reachable and permit hotlinking.

## 6. Test before deploying

- Create account with valid details; try the same email again and confirm a duplicate error.
- Log in with correct and incorrect passwords. Confirm the browser stores a token only after successful login.
- Load menu and verify every image. Click each item and ensure its route uses a real ID.
- Add two different products; add one product twice; increase/decrease quantity; remove it; refresh and confirm the browser cart remains consistent. Test in a second browser/private window to ensure carts are isolated.
- Check that totals equal `price × quantity`. Menu prices are UGX in the supplied static data; review every page and backend payment flow for currency consistency before accepting orders.
- Do not test real payments with live credentials until the payment issues above are fixed.

## 7. Deploy online

### Backend (Render, Railway, or similar Node host)
1. Push this cleaned project to your own GitHub repository.
2. Create a Node web service with root directory `Backend` (if the host supports monorepo root directories). Build/install command: `npm install`; start command: `npm start`.
3. Set environment variables in the host dashboard: `DATABASE`, `SECRET_KEY`, and `FRONTEND_URL` (your deployed frontend origin). Add payment variables only after payment logic has been reviewed.
4. Check the deployed API root URL and logs. Configure CORS to allow the exact deployed frontend origin.

### Frontend (Netlify or Vercel)
1. Create a static-site project from the same repository, with base/root directory `frontend/kfc-app`. Build command: `npm run build`; publish directory: `build`.
2. Set `REACT_APP_API_URL` to the deployed backend URL (for example, `https://your-api-host.example`). Use your actual URL, not this placeholder.
3. Deploy, open the public URL, then test signup/login/menu/cart in a fresh browser.
4. For React Router deep links, configure SPA rewrites so paths such as `/cart`, `/menu/...`, `/login`, and `/signup` serve `index.html`.

## Important production gaps

Before taking real orders: replace browser-supplied cart prices with a trusted server catalog; choose and correctly configure a payment provider that supports your business location and currency; verify payments server-side and process webhooks; add rate limiting, order-history access controls, privacy/terms pages, HTTPS, backups, and automated integration tests. Do not expose database URLs, JWT secrets, or payment secrets in React environment variables. Only `REACT_APP_API_URL` belongs in the frontend.
