const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'FaceApp'
    }
  });

// obtener usuario al ingresar, mostra el nombre y contador, actualizar el contador

// app.use sirve para cargar middleware el cual es software intermedio que añade alguna funcionalidad en su mayoria de comunicacion en este caso a express
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get('/', (req,res)=> {
    db('users')
    .returning('*')
    .then( users =>  res.json(users) )
})

app.post('/signin', signin.handleLogin(db,bcrypt))

app.post('/register', register.handleRegister(db,bcrypt) )

// sirve para aumentar el contador cada vez que analizamos una imagen
app.put('/image', image.handleCounter(db) ) /*injeccion de dependencia db y esta fucnion callback tambien lleva req and res*/ 

app.post('/imageRecognition', image.handleRecognition )

app.listen(3000);

const PORT = process.env.PORT;

console.log(PORT,'imprimiendo puerto con una variable de entorno');