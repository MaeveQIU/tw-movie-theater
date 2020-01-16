const topMovies = getData(200, 50).subjects;
const movieWithDetails = topMovies.map(item => getMovieData(item.id));

const postClassificationData = element => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/recommender", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`title=${element.title}&id=${element.id}&year=${element.year}&genres=${element.genres}&countries=${element.countries}&tags=${element.tags}&image=${element.images.small}`);
}

movieWithDetails.forEach(element => postClassificationData(element));