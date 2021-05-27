

function registerHandler(req, resp, bcrypt, database, uuidv4) {
  let password;
  let generatedUUIDForLogin = uuidv4();
  let generatedUUIDForUser = uuidv4();
  bcrypt.hash(req.body.password, null, null, function (err, hash) {
    password = hash;
  });

  database.transaction(function (trx) {
    trx('login')
      .insert({
        "id": generatedUUIDForLogin,
        "password": password,
        "email": req.body.email
      })
      .returning('email')
      .then(function (returnedEmail) {
        return trx('users')
          .returning('*')
          .insert({
            "id": generatedUUIDForUser,
            "name": req.body.name,
            "email": returnedEmail[0],
            "joiningDate": new Date()
          }).then(function (data) {
            resp.json(data[0]);
          }).catch(function (err) {
            resp.status(400).json("Unable to register: " + err);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch(function (err) {
    resp.status(400).json("transactional error: " + err);
  })
}

export default registerHandler;

