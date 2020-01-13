
const getData = (start) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://127.0.0.1:8888/v2/movie/top250?start=${start}&count=50`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const getMovieList = () => {
  let list = [];
  for (let i = 0; i < 250; i += 50) {
    let temp = getData(i).subjects;
    list = list.concat(temp);
  }
  return list;
}

const movieList = getMovieList();

