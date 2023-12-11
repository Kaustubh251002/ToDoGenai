const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://kmishra2510:1234567890@cluster0.yzew6xg.mongodb.net/?retryWrites=true&w=majority';

const databaseUrl = 'mongodb+srv://kmishra2510:1234567890@cluster0.yzew6xg.mongodb.net/?retryWrites=true&w=majority';
const collectionName = 'your_collection';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

module.exports = mongoose;
