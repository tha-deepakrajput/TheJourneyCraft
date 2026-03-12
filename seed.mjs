import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/journeycraft";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Creator", "Explorer"], default: "Explorer" },
    password: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        await User.findOneAndUpdate(
            { email: "admin@journeycraft.com" },
            {
                name: "Admin",
                role: "Creator",
                password: hashedPassword
            },
            { upsert: true }
        );
        
        console.log("Admin user seeded successfully with email: admin@journeycraft.com");
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
