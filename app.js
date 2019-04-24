const express = require("express");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handle500,
  methodNotAllowed,
  handlePsqlErrors,
  handleCustomErrors
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);
// app.use(methodNotAllowed);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
