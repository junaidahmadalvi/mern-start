function HttpException(status, message) {
  Error.call(this, message);
  this.status = status;
  this.message = message;
  this.name = "HttpException";
  Error.captureStackTrace(this, this.constructor);
}

HttpException.prototype = Object.create(Error.prototype);
HttpException.prototype.constructor = HttpException;

function Throw400(message) {
  HttpException.call(this, 400, message || "Bad Request.");
}

Throw400.prototype = Object.create(HttpException.prototype);
Throw400.prototype.constructor = Throw400;

function Throw401(message) {
  HttpException.call(this, 401, message || "Unauthorized.");
}

Throw401.prototype = Object.create(HttpException.prototype);
Throw401.prototype.constructor = Throw401;

function Throw403(message) {
  HttpException.call(this, 403, message || "Forbidden.");
}

Throw403.prototype = Object.create(HttpException.prototype);
Throw403.prototype.constructor = Throw403;

function Throw404(message) {
  HttpException.call(this, 404, message || "Resource not found.");
}

Throw404.prototype = Object.create(HttpException.prototype);
Throw404.prototype.constructor = Throw404;

function Throw422(message) {
  HttpException.call(this, 422, message || "Unprocessable entity.");
}

Throw422.prototype = Object.create(HttpException.prototype);
Throw422.prototype.constructor = Throw422;

module.exports = {
  HttpException,
  Throw400,
  Throw401,
  Throw403,
  Throw404,
  Throw422,
};
