"use strict";

let movies = [];

function loadMovies() {
fetch("http://sanderoestberg.com/wp/wp-json/wp/v2/posts?_embed")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    appendMovies(json);
    movies = json;
  });
}

loadMovies();


function appendMovies(movies) {
  let htmlTemplate = "";

  for (let movie of movies) {
    htmlTemplate += `
    <article class="${movie.slug}"><a href="#movieInfo">
      <h2>${movie.title.rendered} (${movie.acf.year})</h2>
      <img src="${movie.acf.img}"></a>
    </article>
    `;
  }

  document.querySelector('#grid-movies').innerHTML = htmlTemplate;
 
  for (let movie of movies) {
    document.querySelector(`.${movie.slug}`).onclick = function(){
      function appendClicked(movie) {
        console.log(movie);
        document.querySelector("#moreInfo").innerHTML += `
          <article>
            <h2>${movie.title.rendered} (${movie.acf.year})</h2>
            <img src="${movie.acf.img}">
            <h4>Description</h4>
            <p>${movie.acf.description}</p>
            <h4>Trailer</h4>
            <iframe src="${movie.acf.trailer}" height="200" width="300"></iframe>
          </article>
          `;
      }
      document.querySelector("#grid-movies").style.display = "none"
      appendClicked(movie);
      }
    }
}

// search functionality
function search(value) {
  let searchQuery = value.toLowerCase();
  console.log(searchQuery);
  let filteredMovies = [];
  for (let movie of movies) {
    let title = movie.title.rendered.toLowerCase();
    let year = movie.acf.year.toLowerCase();
    if (title.includes(searchQuery) || year.includes(searchQuery)) {
      filteredMovies.push(movie);
    }
  }
  console.log(filteredMovies);
  appendMovies(filteredMovies);
}


// fetch all genres / categories from WP
function getGenres() {
  fetch('http://sanderoestberg.com/wp/wp-json/wp/v2/categories')
    .then(function(response) {
      return response.json();
    })
    .then(function(categories) {
      console.log(categories);
      appendGenres(categories);
    });
}

getGenres();

// append all genres as select options (dropdown)
function appendGenres(genres) {
  let htmlTemplate = "";
  for (let genre of genres) {
    htmlTemplate += `
      <option value="${genre.id}">${genre.name}</option>
    `;
  }

  document.querySelector('#select-genre').innerHTML += htmlTemplate;
}

// genre selected event - fetch movies by selected category
function genreSelected(genreId) {
  console.log(`Genre ID: ${genreId}`);
  if (genreId) {
    fetch(`http://sanderoestberg.com/wp/wp-json/wp/v2/posts?_embed&categories=${genreId}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(movies) {
        console.log(movies);
        appendMoviesByGenre(movies);
      });
  } 
}

// append movies by genre
function appendMoviesByGenre(moviesByGenre) {
  let htmlTemplate = "";

  for (let movie of moviesByGenre) {
    htmlTemplate += `
      <article>
        <h2>${movie.title.rendered} (${movie.acf.year})</h2>
        <img src="${movie.acf.img}">
      </article>
    `;
  }
  document.querySelector('#grid-movies').innerHTML = htmlTemplate;
}