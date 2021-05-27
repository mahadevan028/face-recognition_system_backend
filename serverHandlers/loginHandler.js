

function loginHandler(req, res, database, bcrypt) {

    database('login')
        .select('*')
        .where('email', '=', req.body.email)
        .then(function (data) {
            let isValid = bcrypt.compareSync(req.body.password, data[0].password);
            if (!isValid) {
                return res.status(400).json("Invalid credentials")
            }
            return database('users')
                .select('*')
                .where('email', '=', req.body.email)
                .then(function (userData) {
                    res.json(userData[0])
                })
                .catch(function (err) {
                    res.status(400).json("Unable to fetch user details " + err);
                })
        })
        .catch(function (err) {
            res.status(400).json("Invalid credentials")
        })
}

export default loginHandler;
