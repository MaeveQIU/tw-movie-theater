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
        newList.push(item)
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
    <p>${element.title}</p>
    <p>Rating: ${element.rating.average}</p>`
    document.getElementById("movies").appendChild(newMovie)
  });
}

const clearList = node => {
  document.getElementById(node).innerHTML = "";
}

const filterList = (movieList, genre) => {
  return movieList.filter(element => element.genres.includes(genre));
}

const checkResult = movieList => {
  const input = document.getElementById("search-area").value;
  return movieList.filter(element => element.title.includes(input));
}

const displayResult = resultArr => {
  if (resultArr.length !== 0) {
    resultArr.forEach(element => {
      const result = document.createElement("div");
      result.setAttribute("class", "movie-result")
      result.innerHTML = `
      <img src=${element.images.small}>
      <p class="title">${element.title}</p>
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

const addEvents = () => {
  document.addEventListener("click", event => {
    if(event.target.className === "all-list") {
      clearList("movies");
      renderMovie(movieList);
    }
    if(event.target.className === "genre-list") {
      let target = filterList(movieList, event.target.id);
      clearList("movies");
      renderMovie(target);
    }
    if(event.target.id === "search-button") {
      clearList("main")
      displayResult(checkResult(movieList));
    }

  });
}