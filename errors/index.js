exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err.code, "<-- ERROR CODE handlepsql");
  const psqlCodes = {
    "22P02": { status: 400, msg: "Invalid Input" },
    "42703": { status: 400, msg: "sort_by parameter doesn't exist" },
    "23503": { status: 404, msg: "Invalid Username" }
  };
  if (psqlCodes[err.code]) {
    res
      .status(psqlCodes[err.code].status)
      .send({ msg: psqlCodes[err.code].msg });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err, "error in handleCustomErrors");
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  // console.log(err, "<--ERROR IN HANDLE 500");
  return res.status(500).send({ msg: "Internal Server Error" });
};
