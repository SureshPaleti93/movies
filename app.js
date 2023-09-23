const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const startServerAndDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started at http://localhost:3000/");
    });
  } catch (e) {
    console.log("DB Error");
    process.exit(1);
  }
};

startServerAndDB();

// GET LIST OF MOVIE NAMES API

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT *
    FROM movie
    ORDER BY movie_id;`;

  const responseDb = (movieDb) => {
    return {
      movieName: movieDb.movie_name,
    };
  };

  const moviesArray = await db.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => {
      responseDb(eachMovie);
    })
  );
});
exports.module = app;
