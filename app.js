const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const serverless = require("serverless-http");

// Routers
// const demoRoutes = require("./routes/demoRoutes");
// const loginRouter = require("./routes/loginRoutes");
// const studentRouter = require("./routes/studentRoutes");
// const studentClassRouter = require("./routes/studentClassRoutes");
const resultRouter = require("./routes/resultRoutes");
const locationRouter = require("./routes/locationRoutes");
const userRouter = require("./routes/userRoutes");

// Middlewares
app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes(Middlewares)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes(Middlewares)
// app.use("/api/v1/login", loginRouter);
// app.use("/api/v1/tours", demoRoutes);
// app.use("/api/v1/student", studentRouter);
// app.use("/api/v1/studentClass", studentClassRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/result", resultRouter);
app.use("/api/v1/location", locationRouter);

module.exports.handler = serverless(app);
module.exports = app;
