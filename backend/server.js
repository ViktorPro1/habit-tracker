require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Habit Tracker server running on port ${PORT}`);
});