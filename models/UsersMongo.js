"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => { console.log('connected to MongoDB'); })
.catch((error) => { console.log('error connecting to MongoDB:', error.message); });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: Boolean,
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/*function isUser(email){
    User.find({ email: email }).then(result => {
        if(result) return true;
    });
    return false;
}

async function newUser(username, email, password){
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: false,
    });
    user.save().then(result => {
        console.log('note saved!');
        mongoose.connection.close();
    });
}*/

module.exports = mongoose.model('User', userSchema);