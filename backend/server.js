const express = require("express");
const env = require("dotenv");
const checkoutRoutes = require("./routes/checkoutRoutes");
const cors = require("cors");

require("dotenv").config({
  path: `./.env`,
});

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json()); // Middleware to parse JSON bodies

// importing and initializing routers
const paymentPlanRoutes = require("./routes/paymentPlanRoutes");
const questionRoutes = require("./routes/questionRoutes"); // You need to create this
const courseRoutes = require("./routes/courseRoutes"); // And this
const subjectRoutes = require("./routes/subjectRoutes"); // And this
const userRoutes = require("./routes/userRoutes"); // And this

app.use("/api/payment-plans", paymentPlanRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
