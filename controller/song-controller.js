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

        // Extended aggregation to count songs and albums for each artist
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

        // Extended aggregation to count songs in each album
        const albumAggregation = [
            {
                $group: {
                    _id: "$album",
                    totalSongs: { $sum: 1 }, // Count songs for each album
                },
            },
        ];

        const albumCounts = await Song.aggregate(albumAggregation);

        // 4. Combine song data, total counts, genre counts, artist counts, and album counts into a single response object
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

// Save data of edited user in the database
export const editSong = async (request, response) => {
    let song = await Song.findById(request.params.id);
    song = request.body;

    const editSong = new Song(song);
    try{
        await Song.updateOne({_id: request.params.id}, editSong);
        response.status(201).json(editSong);
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}

// deleting data of user from the database
export const deleteSong = async (request, response) => {
    try{
        await Song.deleteSong({_id: request.params.id});
        response.status(201).json("Song deleted Successfully");
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}



  

