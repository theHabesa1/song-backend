import Song from "../model/song.js";

// Get all users
// export const getSong = async (request, response) => {
//     // 1. Find all songs
//     const songs = await Song.find();
  
//     // 2. Calculate the total number of songs
//     const totalSongs = songs.length;
  
//     // 3. Use aggregation pipeline to efficiently calculate artist, album, and genre counts
//     const aggregation = [
//       {
//         $group: {
//           _id: null,
//           totalArtists: { $addToSet: "$artist" }, // Count unique artists
//           totalAlbums: { $addToSet: "$album" }, // Count unique albums
//           totalGenres: { $addToSet: "$genre" }, // Count unique genres
//         },
//       },
//     ];
  
//     const [result] = await Song.aggregate(aggregation);
  
//     // 4. Combine song data and counts into a single response object
//     const responseData = {
//       songs,
//       totalSongs,
//       totalArtists: result.totalArtists.length,
//       totalAlbums: result.totalAlbums.length,
//       totalGenres: result.totalGenres.length,
//     };
  
//     response.status(200).json(responseData);
//   };

export const getSong = async (request, response) => {
    try {
        // 1. Find all songs
        const songs = await Song.find();

        // 2. Calculate the total number of songs
        const totalSongs = songs.length;

        // 3. Use aggregation pipeline to efficiently calculate artist, album, and genre counts
        const aggregation = [
            {
                $group: {
                    _id: "$genre", // Group by genre
                    count: { $sum: 1 }, // Count songs for each genre
                },
            },
            {
                $project: {
                    _id: 0,
                    genre: "$_id",
                    count: 1,
                },
            },
        ];

        const genreCounts = await Song.aggregate(aggregation);

      
        const artistAggregation = [
            {
                $group: {
                    _id: "$artist",
                    totalSongs: { $sum: 1 }, // Count songs for each artist
                    totalAlbums: { $addToSet: "$album" }, // Count unique albums for each artist
                },
            },
        ];

        const artistCounts = await Song.aggregate(artistAggregation);

      
        const albumAggregation = [
            {
                $group: {
                    _id: "$album",
                    totalSongs: { $sum: 1 }, // Count songs for each album
                },
            },
        ];

        const albumCounts = await Song.aggregate(albumAggregation);

      
        const responseData = {
            songs,
            totalSongs,
            totalArtists: new Set(songs.map(song => song.artist)).size,
            totalAlbums: new Set(songs.map(song => song.album)).size,
            totalGenres: new Set(songs.map(song => song.genre)).size,
            genreCounts: genreCounts.reduce((acc, genreCount) => {
                acc[genreCount.genre] = genreCount.count;
                return acc;
            }, {}),
            artistCounts: artistCounts.reduce((acc, artistCount) => {
                acc[artistCount._id] = {
                    totalSongs: artistCount.totalSongs,
                    totalAlbums: artistCount.totalAlbums.length,
                };
                return acc;
            }, {}),
            albumCounts: albumCounts.reduce((acc, albumCount) => {
                acc[albumCount._id] = albumCount.totalSongs;
                return acc;
            }, {}),
        };

        response.status(200).json(responseData);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};




// Save data of the user in database
export const addSong = async (request, response) => {
    // retreive the info of user from frontend
    const song = request.body;
    console.log("inside")

    const newSong = new Song(song);
    try{
        await newSong.save();
        response.status(201).json(newSong);
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}

// Get a user by id
export const getSongById = async (request, response) => {
    try{
        const song = await Song.findById(request.params.id);
        response.status(200).json(song);
    }catch( error ){
        response.status(404).json({ message: error.message })
    }
}

// Save data of edited song in the database
export const editSong = async (request, response) => {
    try {
        const songId = request.params.id;
        const updatedSongData = request.body;

        // Find the existing song by ID
        const existingSong = await Song.findById(songId);

        if (!existingSong) {
            return response.status(404).json({ message: "Song not found" });
        }

        // Update the fields of the existing song
        existingSong.title = updatedSongData.title;
        existingSong.artist = updatedSongData.artist;
        existingSong.album = updatedSongData.album;
        existingSong.genre = updatedSongData.genre;

        // Save the updated song
        await existingSong.save();

        response.status(201).json(existingSong);
    } catch (error) {
        response.status(409).json({ message: error.message });
    }
};


// deleting data of song from the database
export const deleteSong = async (request, response) => {
    try {
        const result = await Song.deleteOne({ _id: request.params.id });

        if (result.deletedCount === 1) {
            response.status(201).json("Song deleted successfully");
        } else {
            response.status(404).json({ message: "Song not found" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};




  

