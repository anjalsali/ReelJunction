const apiKey = "bd47bd61ffdc07b88868a059e48e9040";
const youtubeApiKey = "AIzaSyAcyFaQuKnjyDgqIrS7KiSfweuz8aRZ1wI";

// Display top 10 popular movies and favorites when the page loads
$(document).ready(function () {
   getTopPopularMovies();
   displayFavoriteMovies();
});

function getTopPopularMovies() {
   $.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`, function (data) {
      const topMovies = data.results.slice(0, 12);
      console.log("Popular Movies", topMovies);
      displayMovieResults(topMovies, "#movieDetails", "Popular Movies");
   });
}

function searchMovie() {
   const movieTitle = $("#movieSearch").val();

   // Clear previous results

   // Make TMDb API request for movie details
   $.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`, function (movieData) {
      if (movieData.results && movieData.results.length > 0) {
         const searchMovies = movieData.results.slice(0, 12);
         console.log("search Movies", searchMovies);
         displayMovieResults(searchMovies, "#movieDetails", "Search Results");
      } else {
         showNoResultsModal();
      }
   });
}

function displayMovieResults(results, targetElement, heading) {
   // Create Bootstrap cards in a responsive grid for the movie results
   const cardsHTML = results.map((movie) => createMovieCard(movie)).join("");
   document.getElementById("headingName").innerHTML = heading;
   $(targetElement).html(`<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">${cardsHTML}</div>`);

   // Attach click event to each card
   $(".movie-card").click(function () {
      const movieId = $(this).data("movie-id");
      console.log("movie card Id", movieId);
      // Retrieve detailed information and trailers for the selected movie
      getMovieDetails(movieId);
   });
}

function createMovieCard(movie) {
   const posterURL = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750.png?text=No+Poster+Available";

   return `
     <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card movie-card" data-movie-id="${movie.id}">
           <img src="${posterURL}" class="card-img-top" alt="${movie.title}">
           <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
           </div>
        </div>
     </div>
  `;
}

function getMovieDetails(movieId) {
   // Make TMDb API request for detailed movie information
   $.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`, function (movie) {
      console.log("movie detail", movie);
      // Display detailed information and trailers for the selected movie
      displayMovieDetails(movie);
      getYouTubeTrailers(movie.title);
   });
}

function displayMovieDetails(movie) {
   const posterURL = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750.png?text=No+Poster+Available";
   document.getElementById("headingName").innerHTML = "";
   const movieDetailsHTML = `
      <div class="row">
         <div class="col-md-4">
            <img src="${posterURL}" alt="${movie.title}" class="img-fluid">
         </div>
         <div class="col-md-8 text-left">
            <h2>${movie.title}</h2>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Language:</strong> ${getLanguageName(movie.original_language)}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
            <p><strong>Duration:</strong> ${movie.runtime} Minutes </p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <button class="btn btn-primary btn-sm add-favorite" data-movie="${encodeURIComponent(JSON.stringify(movie))}">Add to Favorites</button>
         </div>
      </div>
      <div id="youtubeTrailers" class="mt-4"></div>
   `;

   $("#movieDetails").html(movieDetailsHTML);
}

$(document).on("click", ".add-favorite", function () {
   const movieDataString = $(this).data("movie");
   const movieData = JSON.parse(decodeURIComponent(movieDataString));
   console.log("Movie data of favourite movie", movieData);
   addFavoriteMovie(movieData);
});

function addFavoriteMovie(movie) {
   // Get the existing favorites from localStorage
   console.log("This is favourite movie", movie);
   const favorites = getFavoriteMovies();
   console.log("movie Id", movie.id);

   // Check if the movie is already in favorites
   const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id);
   if (!isAlreadyFavorite) {
      // Add the movie to favorites
      favAddModal();
      favorites.push(movie);
      // Save the updated favorites to localStorage
      saveFavoriteMovies(favorites);
      // Display the updated list of favorite movies
      displayFavoriteMovies();
   } else {
      favWarnModal();
   }
}

function getFavoriteMovies() {
   // Retrieve favorites from localStorage
   const favoritesJSON = localStorage.getItem("favorites");
   return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function saveFavoriteMovies(favorites) {
   // Save favorites to localStorage
   localStorage.setItem("favorites", JSON.stringify(favorites));
}

function displayFavoriteMovies() {
   // Display favorite movies as cards
   const favorites = getFavoriteMovies();
   displayMovieResults(favorites, "#favoriteMovies", "");
}

// ... (rest of your existing code)

function showNoResultsModal() {
   // Display Bootstrap modal for no results
   $("#noResultsModal").modal("show");
}

function favAddModal() {
   // Display Bootstrap modal for no results
   $("#favAddModal").modal("show");
}

function favWarnModal() {
   // Display Bootstrap modal for no results
   $("#favWarnModal").modal("show");
}

function getLanguageName(languageCode) {
   // Add more language mappings as needed
   const languageMap = {
      en: "English",
      es: "Spanish",
      fr: "French",
      // Add more language codes and names here
   };

   return languageMap[languageCode] || languageCode;
}

function getYouTubeTrailers(movieTitle) {
   // Make YouTube API request for top 3 video clips
   $.get(`https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${movieTitle} trailer&maxResults=3&part=snippet&type=video`, function (data) {
      const trailersHTML = data.items
         .map(
            (item) => `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
        `
         )
         .join("");
      $("#youtubeTrailers").html(trailersHTML);
   });
}

function clearFavorites() {
   // Remove favorites from local storage
   localStorage.removeItem("favorites");

   // Optionally, update the displayed favorite movies
   displayFavoriteMovies();
}

function reloadPage() {
   location.reload();
}
