const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  // Handle Mongoose CastError (invalid ObjectId)
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  }

  // Handle Mongoose ValidationError
  if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  // Handle Mongoose Duplicate Key Error
  if (error.code === 11000) {
    return res.status(409).send({ error: "duplicate key error" });
  }

  // Handle Unauthorized Access (example)
  if (error.name === "UnauthorizedError") {
    return res.status(401).send({ error: "unauthorized access" });
  }

  // Handle Forbidden Access (example)
  if (error.name === "ForbiddenError") {
    return res.status(403).send({ error: "forbidden access" });
  }

  // Handle Not Found
  if (error.status === 404) {
    return res.status(404).send({ error: "resource not found" });
  }

  // Default to 500 Internal Server Error for any other errors
  return res.status(500).send({ error: "internal server error" });

  next(error);
};

module.exports = errorHandler;
