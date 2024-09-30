const express = require('express');
const argon2 = require('argon2'); //eingefuegt fuer hashing
var serviceRouter = express.Router();
const UserDao = require('../dao/userDao.js');
const helper = require('../helper.js');


console.log("- Service User")

serviceRouter.post('/login', (req, res) => {
  console.log('Login Request incoming');
  // TODO: input validation
  username = req.body.username;
  password = req.body.password;
  const userDao = new UserDao(req.app.locals.dbConnection);


  try {
    //var exists = userDao.exists(username, password);
    var exists = userDao.exists(username);

    // check if user exists
    if (exists == false) {
      return res.status(400).json({ 'error': true, 'message': 'Benutzername oder Passwort falsch!' });
    }

    console.log(exists)

    // *NEU* Promises, um die asynchrone Passwortverifizierung zu handhaben
    argon2.verify(exists.password, password).then(isValidPassword => {
      if (!isValidPassword) {
        return res.status(400).json({ 'error': true, 'message': 'Invalid password!' });
      }
      

    helper.generateTokenAndSetCookie(res, exists.ID);
    /*req.session.user = exists.ID;   
    req.session.save(function (err) {
      if (err) return next(err)
      return res.status(200).json({})
    });*/

  }).catch(err => {   // *NEU* 
    // Fehlerbehandlung für die Passwortverifizierung
    console.error('Service User: Error verifying password. Exception occurred: ' + err.message);
    return res.status(400).json({ 'error': true, 'message': "Login fehlgeschlagen" });
  });

  } catch (ex) {
      // TODO: keine error informationen exposen
      console.error('Service User: Error checking if record exists. Exception occured: ' + ex.message);
      return res.status(400).json({ 'error': true, 'message': "Login fehlgeschlagen"});
  }
});

serviceRouter.post('/register', (req, res) => {
  console.log('Register Request incoming')
  username = req.body.username;
  password = req.body.password;
  confirm_password = req.body.confirm_password;
  const userDao = new UserDao(req.app.locals.dbConnection);

  console.log('test');
  // check if username and password are valid inputs
  if (password != confirm_password) {
    return res.status(400).json({ 'error': true, 'message': 'Passwords do not match!' });
  }

  if (username == '') {
    return res.status(400).json({ 'error': true, 'message': 'Username invalid!' });
  }

  if (password.length < 4) {
    return res.status(400).json({ 'error': true, 'message': 'Password too short!' });
  }

  // TODO: eventuell error handling
  // check if username isn't already taken
  if (userDao.isunique(username) == false) {
    return res.status(400).json({ 'error': true, 'message': 'User already exists!' });
  }

  // Passwort hashen und Benutzer erstellen
  argon2.hash(password, {
    type: argon2.argon2id, // Verwendeter Typ des Argon2 Hashingalgos
    memoryCost: 19 * 1024, // 19 MiB
    timeCost: 2,           // 2 iterations
    parallelism: 1         // 1 degree of parallelism
  }).then(hashedPassword => {
    userDao.create(username, hashedPassword);

    // TODO: Session zurückgeben
    return res.status(200).json({});
  }).catch(err => {
    console.error('Error hashing password:', err);
    return res.status(500).json({ 'error': true, 'message': 'Internal server error' });
  });
});


serviceRouter.get('/logout', (req, res) => {
  console.log('Logout Request incoming');

  res.cookie('token', "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true
  });

  res.status(200).json({"info": "Logged out successfully"});
});


serviceRouter.get('/current_user', helper.authenticateToken, (req, res) => {
  res.json({ userId: req.userid });
});


module.exports = serviceRouter