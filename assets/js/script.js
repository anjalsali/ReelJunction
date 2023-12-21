$(document).ready(function() {
    $('#searchBtn').on('click', function() {
        var movieTitle = $('#movieInput').val();
        if (movieTitle.trim() !== '') {
            searchMovieInfo(movieTitle);
        } else {
            alert('Please enter a movie title');
        }
    });

    function searchMovieInfo(movieTitle) {
        // Call OMDB API to get movie information
        $.ajax({
            url: 'http://www.omdbapi.com/',
            type: 'GET',
            data: {
                apikey: 'YOUR_OMDB_API_KEY',
                t: movieTitle
            },
            success: function(movieData) {
                displayMovieInfo(movieData);
            },
            error: function() {
                alert('Error fetching movie information');
            }
        });

        // Call YouTube API to search for relevant videos
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search',
            type: 'GET',
            data: {
                key: 'YOUR_YOUTUBE_API_KEY',
                q: movieTitle + ' official trailer',
                part: 'snippet',
                maxResults: 1
            },
            success: function(videoData) {
                displayVideo(videoData);
            },
            error: function() {
                alert('Error fetching video information');
            }
        });
    }

    function displayMovieInfo(movieData) {
        var infoHtml = '<h2>' + movieData.Title + '</h2>' +
                       '<p><strong>Rating:</strong> ' + movieData.imdbRating + '</p>' +
                       '<p><strong>Cast:</strong> ' + movieData.Actors + '</p>' +
                       '<p><strong>Director:</strong> ' + movieData.Director + '</p>' +
                       '<p><strong>Release Date:</strong> ' + movieData.Released + '</p>' +
                       '<p><strong>Runtime:</strong> ' + movieData.Runtime + '</p>';
        $('#movieInfo').html(infoHtml);
    }

    function displayVideo(videoData) {
        if (videoData.items.length > 0) {
            var videoId = videoData.items[0].id.videoId;
            var videoHtml = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
            $('#videoContainer').html(videoHtml);
        } else {
            $('#videoContainer').html('<p>No videos found</p>');
        }
    }
});