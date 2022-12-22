const token_secret = "secretstringzajsonwebtoken"

const jwt = require("jsonwebtoken")

function generateAccessToken(user) {
    return jwt.sign({usename : user.username, role : user.role, uuid : user.id, },token_secret, { expiresIn: '1800s' });
  }

function getTokenID (req)  {
    const token = req.headers["authorization"].split(' ')[1];    
    decodedToken = jwt.verify(token,token_secret)
    return decodedToken.id;
}
function getTokenRole (req) {
    const token = req.headers["authorization"].split(' ')[1];        
    decodedToken = jwt.verify(token,token_secret) 
    return decodedToken.role;
}

  module.exports = {
      generateAccessToken,
      getTokenID,
      getTokenRole      
  }
