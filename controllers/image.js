const Clarifai = require('clarifai');
      
// Instantiate a new Clarifai app by passing in your API key. f
const app = new Clarifai.App({apiKey: 'e5922df00b6e40609a2d4fddbf760e8f'});

handleRecognition = (req,res) =>{
    app
    .models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageUrl )
    .then( response => res.json(response)  )
    .catch( err => res.status(400).json(err))
}

handleCounter = (db) => (req, res) => { /* las funciones callback para metodos http siempre reciben  loa parametros req, res por lo cual no es necesario enviarlos 
                                            explicitamente, por el contrarior hay que hacer una injection de dependecion con db que es un modulo el cual exportamos en  el server.js*/ 
    let { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(count => {
        if (count.length) { res.json(count[0]) } //como es un arreglo si el arreglo es vacio igual entra en verdadero
        else { res.status(400).json('user not found') }
    })
    .catch(err => res.status(400).json('invalid user'));
}




module.exports = 
{ 
    handleCounter : handleCounter, 
    handleRecognition
} /*se envia un objeto con varias propiedades*/ 