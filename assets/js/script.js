const apiKey = "bd47bd61ffdc07b88868a059e48e9040";
const youtubeApiKey = "AIzaSyAcyFaQuKnjyDgqIrS7KiSfweuz8aRZ1wI";

// Display top 10 popular movies when the page loads
$(document).ready(function () {
   getTopPopularMovies();
});

function getTopPopularMovies() {
   $.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`, function (data) {
      const topMovies = data.results.slice(0, 12);
      displayMovieResults(topMovies, "#movieDetails", "Popular Movies");
   });
}

function searchMovie() {
   const movieTitle = $("#movieSearch").val();

   // Clear previous results
   $("#movieDetails").html("");

   // Make TMDb API request for movie details
   $.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`, function (data) {
      console.log(data);
      if (data.results && data.results.length > 0) {
         // Display the top five results as Bootstrap cards
         displayMovieResults(data.results.slice(0, 8), "#movieDetails", "Search Results");
      } else {
         showNoResultsModal();
      }
   });
}

// ... (your existing code)

function displayMovieResults(results, targetElement, heading) {
   // Create Bootstrap cards in a responsive grid for the movie results
   const cardsHTML = results.map((movie) => createMovieCard(movie)).join("");
   $(targetElement).html(`<h2>${heading}</h2><div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">${cardsHTML}</div>`);

   // Attach click event to each card
   $(".movie-card").click(function () {
      const movieId = $(this).data("movie-id");
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

// ... (your existing functions)

function getMovieDetails(movieId) {
   // Make TMDb API request for detailed movie information
   $.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`, function (movie) {
      console.log(movie);
      // Display detailed information and trailers for the selected movie
      displayMovieDetails(movie);
      getYouTubeTrailers(movie.title);
   });
}

// ... (your existing functions)

function displayMovieDetails(movie) {
   const posterURL = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750.png?text=No+Poster+Available";

   const movieDetailsHTML = `
      <div class="row">
         <div class="col-md-4">
            <img src="${posterURL}" alt="${movie.title}" class="img-fluid">
         </div>
         <div class="col-md-8">
            <h2>${movie.title}</h2>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Language:</strong> ${getLanguageName(movie.original_language)}</p>
            <p><strong>Popularity:</strong> ${movie.popularity}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
         </div>
      </div>
      <div id="youtubeTrailers" class="mt-4"></div>
   `;

   $("#movieDetails").html(movieDetailsHTML);
}

function showNoResultsModal() {
   // Display Bootstrap modal for no results
   $("#noResultsModal").modal("show");
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

function reloadPage() {
   location.reload();
}
