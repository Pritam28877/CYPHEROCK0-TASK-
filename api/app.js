const express = require("express");
const cors = require("cors");

const userRouter = require("./Api/Routers/userRouter");
const tokenRouter = require("./Api/Routers/tokenRouter");
const accountRouter = require("./Api/Routers/accountRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/token", tokenRouter);

app.use("/api/account", accountRouter);

module.exports = app;
