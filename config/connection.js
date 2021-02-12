const mongoose = require('mongoose');
const config = require('config');

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongoDB...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
