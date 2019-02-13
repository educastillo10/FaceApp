const handleRegister = (db,bcrypt)=>(req,res)=>{
    let {email,name,password} = req.body;    

    if( !email || !password || !name ) return res.status(400).json('invalid inputs');

    db.transaction( trx => 
    {        
        bcrypt.hash(password, null, null, function(err, hash) {
            if(err) res.status(400).json('cant validate password');
            
            trx('login')
            .insert({email,hash})
            .returning('email')
            .then(  registerEmail => 
             { 
               return trx('users')
                        .returning('*')
                        .insert({email : registerEmail[0]  , name, joined : new Date()})
                        .then(user => res.json(user[0]))
                        .catch(err => res.status(400).json('we can\'t write in users '));        
             })
            .then(trx.commit) 
            .catch( trx.rollback )
        });
    })
    .catch(err => res.status(400).json('can\'t do transactions '))
}

module.exports = { handleRegister } /* sintaxis ecmas6 cuando el atributo del objeto tiene el mismo nombre que su valor no hay necesidad de especificarlo */