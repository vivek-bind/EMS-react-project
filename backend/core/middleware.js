const jwt = require("jsonwebtoken");
// JWT Key setup
const jwtKey = process.env.JWTKEY || require("./jwtKey.js").jwtKey;

if (!jwtKey) {
  console.error("JWT key is missing. Please check your .env or jwtKey.js.");
  process.exit(1);  // Terminate the application if JWT key is missing
}


// middleware
const verifyAdmin = (req, res, next)=> {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          if (authData.Account == 1) {
            next();
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }
  const verifyAdminHR=(req, res, next)=> {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          if (authData.Account == 1 || authData.Account == 2) {
            next();
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }
  const verifyHR=(req, res, next)=> {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          if (authData.Account == 2) {
            next();
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }
  const verifyHREmployee=(req, res, next)=> {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          if (authData.Account == 2) {
            next();
          } else if (authData.Account == 3) {
            if (authData._id == req.params.id) {
  
  
              next();
            }
            else {
              res.sendStatus(403);
  
            }
  
  
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }
  const verifyEmployee=(req, res, next)=> { 
    console.log("Authorization Header:", req.headers["authorization"]);  
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];
  
    if (typeof Header !== "undefined") {
      // decodedData = jwt.decode(req.headers['authorization']);
      // if(decodedData.Account)
      jwt.verify(Header, jwtKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          if (authData._id == req.params.id) {
            console.log(authData);
            if (authData.Account == 3) {
              next();
            } else {
              res.sendStatus(403);
            }
          } else {
            res.sendStatus(403);
          }
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }


  // Export the middleware functions
module.exports = {
  verifyAdmin,
  verifyAdminHR,
  verifyHR,
  verifyHREmployee,
  verifyEmployee
};