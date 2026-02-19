const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/fitness-app';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Delete all fitness plans
        const result = await mongoose.connection.db.collection('fitnessplans').deleteMany({});
        console.log(`Deleted ${result.deletedCount} plans`);

        console.log('Database cleared! Refresh your dashboard to see the new comprehensive plan.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
