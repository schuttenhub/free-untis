const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.TOKEN_SECRET;

// middleware to test if authenticated
module.exports.isAuthenticated = function(req, res, next) {
    if (req.session.user) next()
    else next('route')
  }

// checks if given value is an array and if its empty
module.exports.isArrayEmpty = function(val) {
  if (val === null) 
      return true;
  
  if (val === undefined) 
      return true;

  if (!Array.isArray(val)) 
      return true;
  
  return (val.length == 0);
}


module.exports.generateTokenAndSetCookie = function (res, userid) {
  const token = jwt.sign({ data: userid }, JWT_SECRET, { 
    expiresIn: '42h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 151_200_000
  });

  return res.status(200).send('Login successfull')
}

module.exports.authenticateToken = function(req, res, next) {
  if (!req.cookies) {
    return res.status(401).json({ 
      error: true, message: "User not logged in" 
    });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      error: true, message: "User not logged in" 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, userid) => {
    console.log(err)

    if (err) {
      return res.status(403).json({ 
        error: true, message: "User not logged in" 
      });
    }

    req.userid = userid.data

    next()
  })
}