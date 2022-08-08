const customError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new customError.UnauthenticatedError("authentication invalid");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError("authentication invalid");
  }
};
const authorizePermissions = (...rest) => {
 return (req, res, next)=>{
    if (!rest.includes(req.user.role)) {
        throw new customError.UnauthorizedError("not allowed to access");
      }
      next();
 }
};

module.exports = { authenticateUser, authorizePermissions };
