const apiKey = "bd47bd61ffdc07b88868a059e48e9040";
const youtubeApiKey = "AIzaSyAcyFaQuKnjyDgqIrS7KiSfweuz8aRZ1wI";

function searchMovie() {
   const movieTitle = $("#movieSearch").val();

   // Clear previous results
   $("#movieDetails").html("");

   // Make TMDb API request for movie details
   $.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`, function (data) {
      console.log(data);
      if (data.results && data.results.length > 0) {
         const movie = data.results[0];
         displayMovieDetails(movie);
         // Make YouTube API request for movie trailers
         getYouTubeTrailers(movieTitle);
      } else {
         $("#movieDetails").html("<p>No results found.</p>");
      }
   });
}

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
           <p><strong>Overview:</strong> ${movie.overview}</p>
        </div>
     </div>
     <div id="youtubeTrailers" class="mt-4"></div>
  `;

   $("#movieDetails").html(movieDetailsHTML);
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
