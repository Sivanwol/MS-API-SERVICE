const passport = require('passport');
export const authJWT = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) reject(err);
    if (user) resolve(user);
    else reject('Unauthorized');
  })(req, res);
});

export const authLogin = (req, res) => new Promise((resolve, reject) => {
  console.log("bodyparser" ,req.body);
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) reject(err);
    if (user) resolve(user);
    else reject('Unauthorized');
  })(req, res);
});
