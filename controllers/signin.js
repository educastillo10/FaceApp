const handleLogin = (db,bcrypt)=>(req,res)=>{
    let {email,password} = req.body;

    if( !email || !password ) return res.status(400).json('invalid inputs');

    db('login')
    .select('hash')
    .where({email})
    .then( user =>{
        // Load hash from your password DB.
        bcrypt.compare(password, user[0].hash, function(err, validation) {
            if(validation){
                db
                .select('*')
                .from('users')
                .where({email})                
                .then( user => res.json(user[0]))
                .catch( err => res.status(400).json('can\'t get into users') )                
            }else{
                res.status(400).json('can\'t log in');
            }
        });
    })
    .catch(err => res.status(400).json('error consulting data'))
}

module.exports = { handleLogin }