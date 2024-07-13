const mongoose = require('mongoose')
// Database connection
const url = process.env.MONGODB_URL;

if (!url) {
  console.error('MONGODB_URL environment variable is missing')
  process.exit(1)
}
mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

// Define the schema and model
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [5, 'Name must be at least 5 characters long'],
    unique: true,
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.replace('-', '').length >= 8
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXX and at least 8 characters long.`,
    },
  },
})

//modify the json output
phonebookSchema.set('toJSON', {
  transform: (doc, objReturn) => {
    objReturn.id = doc._id.toString()
    delete objReturn._id
    delete objReturn.__v
    return objReturn
  },
})

module.exports = mongoose.model('Person', phonebookSchema)
