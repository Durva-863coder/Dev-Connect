const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const Connection = require('../models/Connection');
const seedDatabase = require('./seedData');

const forceSeed = async () => {
  try {
    console.log('Connecting to database for force seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected.');

    console.log('Wiping existing data for clean seed...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Connection.deleteMany({});
    console.log('Collections cleared.');

    await seedDatabase();
    console.log('Force seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during force seed:', err);
    process.exit(1);
  }
};

forceSeed();
