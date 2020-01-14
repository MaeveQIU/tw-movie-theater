
const getData = (start, count) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://127.0.0.1:8888/v2/movie/top250?start=${start}&count=${count}`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const movieList = getData(0, 40).subjects;

const getGenre = (movieList) => {
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

const renderGenre = (genreList) => {
  genreList.forEach(element => {
    const newGenre = document.createElement("li");
    newGenre.innerHTML = `${element}`
    document.getElementById("genre-list").appendChild(newGenre);
  })
}

renderGenre(getGenre(movieList));

const renderMovie = (movieList) => {
  movieList.forEach(element => {
    const newMovie = document.createElement("div");
    newMovie.innerHTML = `
    <img src=${element.images.small}>
    <p>${element.title}</p>
    <p>Rating: ${element.rating.average}</p>`
    document.getElementById("movies").appendChild(newMovie)
  });
}

renderMovie(movieList);