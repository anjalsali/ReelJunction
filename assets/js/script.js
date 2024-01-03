const API_KEY = 'AIzaSyAcyFaQuKnjyDgqIrS7KiSfweuz8aRZ1wI'; // Replace with your actual YouTube API key
const videoPlayer = document.getElementById('youtube-player');

function playYouTubeVideo(videoId) {
  if (typeof YT !== 'undefined' && YT.loaded) {
    // If the YouTube API is already loaded, create the player immediately
    createYouTubePlayer(videoId);
  } else {
    // If the YouTube API is not loaded, dynamically load it
    loadYouTubeAPI(() => createYouTubePlayer(videoId));
  }
}

function loadYouTubeAPI(callback) {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Callback function to execute when the YouTube API is ready
  window.onYouTubeIframeAPIReady = function () {
    callback();
  };
}

function createYouTubePlayer(videoId) {
  new YT.Player(videoPlayer, {
    height: '360',
    width: '640',
    videoId: videoId,
    playerVars: {
      'autoplay': 1,
    },
  });
}

$("#find-movie").on("click", function (event) {
  event.preventDefault();

  var movie = $("#movie-input").val();
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Response === "True") {
        $("#movie-view").empty();

        var title = $("<h2>").text(data.Title);
        var year = $("<p>").text("Year: " + data.Year);
        var genre = $("<p>").text("Genre: " + data.Genre);
        var plot = $("<p>").text("Plot: " + data.Plot);

        $("#movie-view").append(title, year, genre, plot);

        // Assuming you have a property like 'youtubeVideoId' in your OMDB data
        if (data.youtubeVideoId) {
          // Play YouTube video
          playYouTubeVideo(data.youtubeVideoId);
        }
      } else {
        $("#movie-view").text("Movie not found!");
      }
    })
    .catch(function (error) {
      console.log("Error fetching data: ", error);
    });
});