const getData = (start, count) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://127.0.0.1:8888/v2/movie/top250?start=${start}&count=${count}`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const movieList = getData(0, 40).subjects;

const getGenre = movieList => {
  let newList = [];
  movieList.forEach(element => {
    element.genres.forEach(item => {
      if (!newList.includes(item)) {
        newList.push(item);
      }
    });
  });
  return newList;
}

const renderGenre = genreList => {
  genreList.forEach(element => {
    const newGenre = document.createElement("li");
    newGenre.setAttribute("id", `${element}`);
    newGenre.setAttribute("class", `genre-list`);
    newGenre.innerHTML = `${element}`;
    document.getElementById("genre-list").appendChild(newGenre);
  })
}

const renderMovie = movieList => {
  movieList.forEach(element => {
    const newMovie = document.createElement("div");
    newMovie.innerHTML = `
    <img src=${element.images.small}>
    <a href="./movie-details.html">
      <p class="title">${element.title}</p>
    </a>
    <p class="rating">Rating: ${element.rating.average}</p>`
    document.getElementById("movies").appendChild(newMovie)
  });
}

const clearList = node => {
  document.getElementById(node).innerHTML = "";
}

const filterList = genre => {
  return movieList.filter(element => element.genres.includes(genre));
}

const postInputData = () => {
  const value = document.getElementById("search-area").value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/inputs", false);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`value=${value}`);
}

const getLocalData = database => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/${database}`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const checkResult = input => {
  if (input !== "") {
    return movieList.filter(element => element.title.includes(input));
  }
  else {
    return [];
  }
}

const displayResult = resultArr => {
  if (resultArr.length !== 0) {
    resultArr.forEach(element => {
      const result = document.createElement("div");
      result.setAttribute("class", "movie-result")
      result.innerHTML = `
      <img src=${element.images.small}>
      <a href="./movie-details.html">
        <p class="title">${element.title}</p>
      </a>
      <p>Rating: ${element.rating.average}</p>
      <p>Year: ${element.year}</p>
      <p>Directors: ${element.directors.map(item => item.name_en).join(", ")}</p>
      <p>Casts: ${element.casts.map(item => item.name_en).join(", ")}</p>
      <p>Duration: ${element.durations[0]}`
      document.getElementById("main").appendChild(result);
    });
  }
  else {
    const line = document.createElement("div");
    line.setAttribute("class", "no-result")
    line.innerHTML = `
    <p>Sorry we can't find the movie you're searching for.<br>
    But we're constantly updating our database.<br>
    So stay tuned! ❤︎</p>`
    document.getElementById("main").appendChild(line);
  }
}

const getMovieId = movieTitle => {
  return movieList.filter(element => element.title === movieTitle)[0].id;
}

const getMovieData = (movieId) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://127.0.0.1:8888/v2/movie/subject/${movieId}`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const calculateScoreAndRank = movieItem => {
  const movieDatabase = getLocalData("recommender");
  movieDatabase.forEach(element => {
    let score = 0;
    score += (movieItem.year === element.year) ? 1 : 0;
    score += (movieItem.countries === element.countries) ? 2 : 0;
    score += (movieItem.genres.filter(item => element.genres.includes(item))).length * 3;
    score += (movieItem.tags.filter(item => element.tags.includes(item))).length * 4;
    element.score = score;
  });
  return movieDatabase.sort((x, y) => y.score - x.score).slice(1, 6);
}

const renderMovieItem = (movieItem) => {
  document.getElementById("info").innerHTML = `
    <img src="${movieItem.images.small}">
    <p class="title">${movieItem.title}</p>
    <p>Rating: ${movieItem.rating.average}</p>
    <p>Year: ${movieItem.year}</p>
    <p>Directors: ${movieItem.directors.map(item => item.name_en).join(", ")}</p>
    <p>Casts: ${movieItem.casts.map(item => item.name_en).join(", ")}</p>
    <p>Duration: ${movieItem.durations[0]}
    <p>Country: ${movieItem.countries[0]}
    <p>Genres: ${movieItem.genres.join(", ")}`

  document.getElementById("summary").innerHTML = `
    <h2>Summary: </h2>
    <p>${movieItem.summary}</p>`

  movieItem.popular_reviews.slice(0, 5).forEach(element => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>
        <img src=${element.author.avatar}>
        <p>${element.author.name}</p>
      </td>
      <td class="comment">${element.summary}</td>`
    document.querySelector("table").appendChild(newRow);
  });

  calculateScoreAndRank(movieItem).forEach(item => {
    const newMovie = document.createElement("div");
    newMovie.innerHTML = `
    <img src=${item.image}>
    <p>${item.title}</p>
    <p>${item.year}</p>`
    document.getElementById("recommended-movies").appendChild(newMovie);
  });
}

const postMovieData = (event) => {
  const title = event.target.innerText;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/movies", false);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`title=${title}`);
}

const addEvents = () => {
  document.addEventListener("click", event => {
    if (event.target.className === "all-list") {
      clearList("movies");
      renderMovie(movieList);
    }
    if (event.target.className === "genre-list") {
      let target = filterList(event.target.id);
      clearList("movies");
      renderMovie(target);
    }
    if (event.target.id === "search-button") {
      postInputData();
      const input = getLocalData("inputs");
      clearList("main");
      displayResult(checkResult(input[input.length - 1].value));
    }
    if (event.target.className === "title") {
      postMovieData(event);
    }
  });
}