
// OMDb API Details

// HTML Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");

// Popular Movies
const popularMovies = [
    "Interstellar",
    "Inception",
    "The Dark Knight",
    "The Avengers"
];

// Genre-wise Movie Collection
const genreMovies = {
    Action: [
        "John Wick",
        "Mad Max: Fury Road",
        "The Dark Knight"
    ],

    Comedy: [
        "Home Alone",
        "The Hangover",
        "21 Jump Street"
    ],

    Romance: [
        "The Notebook",
        "La La Land",
        "Pride and Prejudice"
    ],

    Thriller: [
        "Gone Girl",
        "Shutter Island",
        "Se7en"
    ],

    Drama: [
        "Forrest Gump",
        "The Shawshank Redemption",
        "The Pursuit of Happyness"
    ],

    "Sci-Fi": [
        "Interstellar",
        "Inception",
        "The Matrix"
    ]
};


// Fetch Movie by Title
async function fetchMovie(title) {
   const response = await fetch(
    `/api/movies?${new URLSearchParams({ t: title })}`
);

    const movie = await response.json();

    if (movie.Response === "False") {
        console.log(`Movie not found: ${title}`, movie.Error);
        return null;
    }

    return movie;
}


// Display Movies
function displayMovies(movies, heading) {

    movieContainer.innerHTML = `<h2>${heading}</h2>`;

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML +=
            "<p>No movies found. Try another search!</p>";
        return;
    }

    const movieGrid = document.createElement("div");
    movieGrid.className = "movie-grid";

    movies.forEach(movie => {

        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        
          const poster = document.createElement("img");

poster.className = "movie-poster";
poster.alt = movie.Title;

if (movie.Poster && movie.Poster !== "N/A") {
    poster.src = movie.Poster;
} else {
    poster.src = "assets/no-poster.png";
}

        if (movie.Poster && movie.Poster !== "N/A") {
            poster.src = movie.Poster;
        } else {
            poster.alt = "Poster not available";
        }

        const movieInfo = document.createElement("div");
        movieInfo.className = "movie-info";

        const title = document.createElement("h3");
        title.textContent = movie.Title;

        const year = document.createElement("p");
        year.textContent = "Year: " + movie.Year;

        const rating = document.createElement("p");
        rating.textContent =
            movie.imdbRating && movie.imdbRating !== "N/A"
                ? "⭐ " + movie.imdbRating
                : "Rating unavailable";

        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "View Details";

        detailsBtn.addEventListener("click", function () {
            getMovieDetails(movie.imdbID);
        });

        movieInfo.appendChild(title);
        movieInfo.appendChild(year);
        movieInfo.appendChild(rating);
        movieInfo.appendChild(detailsBtn);

        movieCard.appendChild(poster);
        movieCard.appendChild(movieInfo);

        movieGrid.appendChild(movieCard);
    });

    movieContainer.appendChild(movieGrid);
}


// Search Movies
async function searchMovies() {

    const movieName = searchInput.value.trim();

    if (movieName === "") {
        movieContainer.innerHTML =
            "<h2>Please enter a movie name!</h2>";
        return;
    }

    movieContainer.innerHTML = "<h2>Searching movies...</h2>";

    try {

       const response = await fetch(
    `/api/movies?${new URLSearchParams({ s: movieName })}`
);
        if (!response.ok) {
    throw new Error("Network error: " + response.status);
        }

        const data = await response.json();

        if (data.Response === "False") {
            movieContainer.innerHTML = `<h2>${data.Error}</h2>`;
            return;
        }

        displayMovies(data.Search, "Search Results");

    } catch (error) {

        movieContainer.innerHTML =
            "<h2>Something went wrong. Please try again!</h2>";

        console.log(error);
    }
}


// Get Movie Details
async function getMovieDetails(movieID) {

    movieContainer.innerHTML = "<h2>Loading movie details...</h2>";

    try {

       const response = await fetch(
    `/api/movies?${new URLSearchParams({
        i: movieID,
        plot: "full"
    })}`
);

        const movie = await response.json();

        if (movie.Response === "False") {
            movieContainer.innerHTML = `<h2>${movie.Error}</h2>`;
            return;
        }

        movieContainer.innerHTML = `
            <h2>${movie.Title}</h2>

            <div class="movie-card">
                <img
                    src="${movie.Poster !== "N/A" ? movie.Poster : ""}"
                    class="movie-poster"
                    alt="${movie.Title}"
                >

                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Rating:</strong> ⭐ ${movie.imdbRating}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Actors:</strong> ${movie.Actors}</p>
                    <p><strong>Plot:</strong> ${movie.Plot}</p>

                    <button id="backBtn">Back to Movies</button>
                </div>
            </div>
        `;

        document.getElementById("backBtn").addEventListener(
            "click",
            function () {
                loadPopularMovies();
            }
        );

    } catch (error) {

        movieContainer.innerHTML =
            "<h2>Unable to load movie details.</h2>";

        console.log(error);
    }
}


// Load Popular Picks
async function loadPopularMovies() {

    movieContainer.innerHTML =
        "<h2>Loading Popular Picks...</h2>";

    try {

        const movies = await Promise.all(
            popularMovies.map(title => fetchMovie(title))
        );

        const validMovies = movies.filter(movie => movie !== null);

        displayMovies(validMovies, "Popular Picks");

    } catch (error) {

        movieContainer.innerHTML =
            "<h2>Unable to load Popular Picks. Please try again.</h2>";

        console.log(error);
    }
}


// Load Movies by Genre
async function loadGenreMovies(genre) {

    const selectedMovies = genreMovies[genre];

    if (!selectedMovies) return;

    movieContainer.innerHTML =
        `<h2>Loading ${genre} Movies...</h2>`;

    try {

        const movies = await Promise.all(
            selectedMovies.map(title => fetchMovie(title))
        );

        const validMovies = movies.filter(movie => movie !== null);

        displayMovies(validMovies, `${genre} Movies`);

    } catch (error) {

        movieContainer.innerHTML =
            "<h2>Unable to load genre movies. Please try again.</h2>";

        console.log(error);
    }
}


// Genre Button Click Events
const genreButtons = document.querySelectorAll(".mood-btn");

genreButtons.forEach(button => {

    button.addEventListener("click", function () {

        const genre = button.textContent.trim();

        genreButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        loadGenreMovies(genre);
    });
});


// Search Button
searchBtn.addEventListener("click", searchMovies);


// Search using Enter Key
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchMovies();
    }

});


// Load Popular Picks when website opens
loadPopularMovies();
