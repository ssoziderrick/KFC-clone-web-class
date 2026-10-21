require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./Database/db");

const userAuthRouter = require("./routes/userAuth.route");
const paymentRouter = require("./routes/paymentIntegrate.route");
const menuRouter = require("./routes/menu.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const searchRouter = require("./routes/serach.route");
const landingRouter = require("./routes/landing.route");

const server = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "x-cart-id"],
  })
);

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.json({
    message: "KFC API is running",
    status: "OK",
  });
});

server.use("/Auth", userAuthRouter);
server.use("/api/home", landingRouter);
server.use("/api/searchapi", searchRouter);
server.use("/api/product", menuRouter);
server.use("/api/productcart", cartRouter);
server.use("/api/orders", orderRouter);
server.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 8080;

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`KFC API running at http://localhost:${PORT}`);
  });
}

startServer();