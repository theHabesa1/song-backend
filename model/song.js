import mongoose from 'mongoose';

// Define the schema
const songSchema = mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    genre: String
});

// Create the Song model
const Song = mongoose.model('Song', songSchema);

// Export the Song model
export default Song;
