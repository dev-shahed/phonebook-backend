const mongoose = require("mongoose");

if (process.argv.length < 5) {
  console.log(
    "Please provide the name and number as arguments: node script.js <name> <number>"
  );
  process.exit(1);
}

const dbName = "phonebook";
const password = process.argv[2];
// Get the name and number from command line arguments
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://shahedthedev:${password}@cluster0.uueucmh.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model("Person", phonebookSchema);

const phonebook = new Phonebook({
  name: name,
  number: number,
});

phonebook.save().then((result) => {
  console.log("person saved!");
});

Phonebook.find({})
  .then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
