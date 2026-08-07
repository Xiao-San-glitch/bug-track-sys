const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const bugSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    code: String,
    createdAt: { type: Date, default: Date.now }
});

const Bug = mongoose.models.Bug || mongoose.model('Bug', bugSchema);

const bugData = [
    { title: "App crashes on login screen", description: "When entering an invalid email, the app throws an unhandled exception.", priority: "Critical", status: "Open" },
    { title: "Sidebar overlapping content", description: "On small screens, the sidebar doesn't collapse properly.", priority: "High", status: "In Progress" },
    { title: "Typo in settings page", description: "The word 'Password' is spelled 'Psword'.", priority: "Low", status: "Open" },
    { title: "Cannot reset password", description: "The forgot password link sends a broken token.", priority: "Critical", status: "In Progress" },
    { title: "Dashboard charts not loading", description: "The severity doughnut chart remains blank for some users.", priority: "High", status: "Closed" },
    { title: "Notification bell icon missing", description: "The icon disappeared after the last CSS update.", priority: "Medium", status: "Open" },
    { title: "Slow API response on /bugs", description: "Fetching bugs takes over 3 seconds.", priority: "High", status: "Open" },
    { title: "User avatar shows undefined", description: "If the user has no name, the avatar circle breaks.", priority: "Medium", status: "Closed" },
    { title: "Missing hover state on buttons", description: "Secondary buttons have no visual feedback on hover.", priority: "Low", status: "Open" },
    { title: "JWT token not expiring", description: "Users are staying logged in indefinitely.", priority: "Critical", status: "In Progress" }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Insert bugs
        await Bug.insertMany(bugData);
        console.log('Successfully added 10 bugs.');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
