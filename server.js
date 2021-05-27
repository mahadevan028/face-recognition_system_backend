
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import knex from 'knex';
import registerHandler from './serverHandlers/registerHandler.js';
import loginHandler from './serverHandlers/loginHandler.js';


const database = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl:true
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', function(req, resp){
   resp.send("Deployment  is Successful");
})

//signin
app.post('/signin', function (req, res) {
  loginHandler(req, res, database, bcrypt);
});

//register
app.post('/register', function (req, resp) {
  registerHandler(req, resp, bcrypt, database, uuidv4);
})


//listening to port
app.listen(process.env.PORT || '3001', function () {
  console.log("connection is online");
});




