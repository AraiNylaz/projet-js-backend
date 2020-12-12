const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
};

const password = process.argv[2]; //m6WmmBVWfehiHQlA
const dbname = "ressources";

const url = /*`mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`*/
            `mongodb+srv://theChoice:${password}@cluster0.ezt7n.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
});

note.save().then(result => {
  console.log('note saved!');
  //mongoose.connection.close();
});

// Pour afficher
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note);
    });
    mongoose.connection.close();
});

Note.find({ important: true }).then(result => {
    // ...
})