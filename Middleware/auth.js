const jwt = require("jsonwebtoken");

require("dotenv").config();



let auth = async (req, res, next) => {
  try {
    const authToken = await req.headers.cookie;

    if (!authToken) {
      req.user = null;
      return next();
    }

    const token = await authToken.split("=")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const user = await jwt.verify(token, process.env.PRIVATE_KEY);

    if (!user) {
      return res.json({
        status: 404,
        message: "Sorry you are not authenticated",
      });
    }

    req.user = await user._id;


    next();
  } catch (error) {
    res.json({
      status: 404,
      error: error.message,
      message: "Sorry you are not authenticated",
    });
  }
};

module.exports = { auth };
