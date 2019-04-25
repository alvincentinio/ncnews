exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  console.log(err.code, "<-- ERROR CODE handlepsql");
  if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "bad id" });
  } else if (err.code === "42703") {
    res
      .status(400)
      .send({ status: 400, msg: "sort_by parameter doesn't exist" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err.code, "<-- handleCustomErrors");
  if (err.msg === "article_id not found") {
    res.status(404).send(err);
  } else if (err.msg === "no articles in database for selected author") {
    res.status(200).send(err);
  } else if (err.msg === "comment_id not found") {
    res.status(404).send(err);
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log(err.code, "<--ERROR IN HANDLE 500");
  return res.status(500).send({ msg: "Internal Server Error" });
};
