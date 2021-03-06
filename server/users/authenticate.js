var {User} = require('./user.model.js');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user)
      return Promise.reject();

    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(401).send(); //401 - unauthorized
    //don't call next so subsequent route behavior does not occur
  });
};

module.exports = {authenticate};
