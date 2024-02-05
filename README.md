# Song Management System

## Introduction
This is a simple Node.js project for managing songs [Test Project for Addis Software]. It provides CRUD (Create, Read, Update, Delete) operations for songs, including features to get the total number of songs, artists, albums, and genres.

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- mongoose-auto-increment

## Project Structure
- **model/song.js**: Defines the Mongoose schema for the Song model and initializes the auto-increment plugin.
- **controller/song-controller.js**: Implements the CRUD operations and additional logic for getting total counts.
- **routes/song-routes.js**: Configures the Express routes for handling HTTP requests.
- **app.js**: Entry point for the application, where Express is configured and the routes are connected.

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. Access the application at `http://localhost:8080`

## API Endpoints
- **GET /songs**: Get all songs.
- **POST /songs/add**: Add a new song.
- **GET /songs/:id**: Get a song by ID.
- **PUT /songs/:id**: Edit a song by ID.
- **DELETE /songs/:id**: Delete a song by ID.
- **GET /totalsongs**: Get the total number of songs.
- **GET /totalartists**: Get the total number of unique artists.
- **GET /totalalbums**: Get the total number of unique albums.
- **GET /totalgenres**: Get the total number of unique genres.

## Contributing
Feel free to contribute to this project. Fork the repository, make changes, and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
