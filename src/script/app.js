window.addEventListener("DOMContentLoaded", () => {
  const baseURL = "https://imdb-api.com/en/API/";
  const token = "k_0xodwit8";

  const listMovieNav = document.querySelectorAll(".listMovieNav");
  const listMovieWrapper = document.querySelector("#listMovieWrapper");
  const listMovieTitle = document.querySelector("#listMovieTitle");
  const listMovieTableHead = document.querySelector("#listMovieTableHead");
  const listMovieTableBody = document.querySelector("#listMovieTableBody");
  const resultSearchMovieWrapper = document.querySelector("#resultSearchMovieWrapper");
  const resultSearchMovieHeader = document.querySelector("#resultSearchMovieHeader");
  const resultSearchMovie = document.querySelector("#resultSearchMovie");
  const modalBodyDetailMovie = document.querySelector("#modalBodyDetailMovie");
  const formSearchMovie = document.querySelector("#formSearchMovie");

  const fetchListMovie = (name) => {
    fetch(`${baseURL}${name}/${token}`)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        return renderListMovie(responseJson.items, name);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  listMovieNav.forEach((el) => {
    el.addEventListener("click", () => {
      fetchListMovie(el.getAttribute("id"));
      if (document.querySelector(".active")) {
        document.querySelector(".active").classList.remove("active");
      }
      el.classList.add("active");
    });
  });
  const renderListMovie = (movies, name) => {
    resultSearchMovieWrapper.classList.add("d-none");
    listMovieWrapper.classList.remove("d-none");
    listMovieTitle.innerHTML = "";
    listMovieTableHead.innerHTML = "";
    listMovieTableBody.innerHTML = "";
    if (name == "Top250Movies" || name == "MostPopularMovies") {
      listMovieTableHead.innerHTML = `
        <tr>
          <th scope="col">Rank</th>
          <th scope="col"></th>
          <th scope="col" class="text-start">Title</th>
          <th scope="col">Imdb Rating</th>
        </tr>
      `;
      if (name == "Top250Movies") {
        listMovieTitle.innerHTML = "Top 250 Movies";
        movies.forEach((movie) => {
          listMovieTableBody.innerHTML += `
            <tr id="${movie.id}" class="list-movie" data-bs-toggle="modal" data-bs-target="#modalDetailMovie">
              <td scope="row">${movie.rank}</td>
              <td class="px-0 mx-0"><img src="${movie.image}" alt="${movie.fullTitle}/poster" width="40" class="me-3" id="listMoviePoster"/></td>
              <td class="text-start">${movie.fullTitle}</td>
              <td>${movie.imDbRating}</td>
            </tr>
            `;
        });
      } else {
        listMovieTitle.innerHTML = "Most Popular Movies";
        movies.forEach((movie) => {
          listMovieTableBody.innerHTML += `
            <tr id="${movie.id}" class="list-movie" data-bs-toggle="modal" data-bs-target="#modalDetailMovie">
              <td scope="row">${movie.rank}<span class="${movie.rankUpDown < 0 ? "text-danger" : "text-success"} fs-10">${movie.rankUpDown == 0 ? "" : movie.rankUpDown}</span></td>
              <td class="px-0 mx-0"><img src="${movie.image}" alt="${movie.fullTitle}/poster" width="40" class="me-3" id="listMoviePoster"/></td>
              <td class="text-start">${movie.fullTitle}</td>
              <td>${movie.imDbRating}</td>
              </tr>
            `;
        });
      }
    } else {
      listMovieTitle.innerHTML = "Top 10 Box Office";
      listMovieTableHead.innerHTML = `
        <tr>
          <th scope="col">Rank</th>
          <th scope="col"></th>
          <th scope="col" class="text-start">Title</th>
          <th scope="col">Imdb Rating</th>
          <th scope="col">Weekend</th>
          <th scope="col">Gross</th>
        </tr>
        `;
      movies.forEach((movie) => {
        listMovieTableBody.innerHTML += `
          <tr id="${movie.id}" class="list-movie" data-bs-toggle="modal" data-bs-target="#modalDetailMovie">
            <td scope="row">${movie.rank}</td>
            <td class="px-0 mx-0"><img src="${movie.image}" alt="${movie.fullTitle}/poster" width="40" class="me-3" id="listMoviePoster"/></td>
            <td class="text-start">${movie.title}</td>
            <td>${movie.weekend}</td>
            <td>${movie.gross}</td>
            <td>${movie.weeks}</td>
          </tr>
          `;
      });
    }
    const listMovie = document.querySelectorAll(".list-movie");
    for (const item of listMovie) {
      item.addEventListener("click", () => {
        fetchDetailMovie(item.getAttribute("id"));
      });
    }
  };

  formSearchMovie.addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.querySelector(".active")) {
      document.querySelector(".active").classList.remove("active");
    }
    const inputSearchMovie = document.querySelector("#inputSearchMovie").value;
    searchMovie(inputSearchMovie);
  });
  const searchMovie = (name) => {
    fetch(`${baseURL}SearchMovie/${token}/${name}`)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        return renderResultSearch(name, responseJson.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const renderResultSearch = (name, movies) => {
    listMovieWrapper.classList.add("d-none");
    resultSearchMovieWrapper.classList.remove("d-none");
    resultSearchMovieHeader.innerHTML = `Result from `;
    resultSearchMovieHeader.innerHTML += ` "${name}"`;
    resultSearchMovie.innerHTML = "";
    movies.forEach((movie) => {
      resultSearchMovie.innerHTML += `
        <div class="card bg-danger p-0 rounded mx-1 my-2 cardMovie" id="${movie.id}"  data-bs-toggle="modal" data-bs-target="#modalDetailMovie">
          <img src="${movie.image}" class="rounded" alt="${movie.title}/poster" width="100%" height="280" style="object-fit: cover"/>
          <div class="px-2 py-1">
            <p class="m-0 p-0 opacity-50 fs-10">${movie.description}</p>
            <p class="m-0 p-0 fw-bold">${movie.title}</p>
          </div>
        </div>
      `;
    });
    const cardMovie = document.querySelectorAll(".cardMovie");
    for (const card of cardMovie) {
      card.addEventListener("click", () => {
        fetchDetailMovie(card.getAttribute("id"));
      });
    }
  };

  const fetchDetailMovie = (movieId) => {
    fetch(`${baseURL}Title/${token}/${movieId}`)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        return renderDetailMovie(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const renderDetailMovie = (movie) => {
    const genres = [];
    const directors = [];
    const writers = [];
    const stars = [];
    for (const genre of movie.genreList) {
      genres.push(genre.key);
    }
    for (const director of movie.directorList) {
      directors.push(director.name);
    }
    for (const writer of movie.writerList) {
      writers.push(writer.name);
    }
    for (const star of movie.starList) {
      stars.push(star.name);
    }

    modalBodyDetailMovie.innerHTML = "";
    modalBodyDetailMovie.innerHTML = `
    <img src="${movie.image}" alt="${movie.title}/poster" width="380" class="rounded" id="detailMoviePoster"/>
    <div class="container d-flex flex-column my-auto">
      <p class="mb-1 mt-2 mt-sm-0" id="detailMovieGenre"></p>
      <h1 id="detailMovieTitle">${movie.fullTitle}</h1>
      <p class="fs-14 opacity-75" id="detailMovieInfo">${movie.releaseDate} ~ ${movie.runtimeStr} ~ ${movie.imDbRating}</p>
      <p class="my-sm-5 my-3" id="detailMoviePlot">${movie.plot}</p>
      <table class="table fw-bold text-white mt-auto">
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td scope="row" class="px-0" id="detailMovieDirector">Director</td>
          <td class="w-100" id="detailDirector"></td>
        </tr>
        <tr>
          <td scope="row" class="px-0" id="detailMovieWriter">Writer</td>
          <td class="w-100" id="detailWriter"></td>
        </tr>
        <tr>
          <td scope="row" class="px-0" id="detailMovieStar">Stars</td>
          <td class="w-100" id="detailStar"></td>
        </tr>
      </table>
    </div>
    `;
    const detailMovieGenre = document.querySelector("#detailMovieGenre");
    detailMovieGenre.innerHTML = "";
    const detailDirector = document.querySelector("#detailDirector");
    detailDirector.innerHTML = "";
    const detailWriter = document.querySelector("#detailWriter");
    detailWriter.innerHTML = "";
    const detailStar = document.querySelector("#detailStar");
    detailStar.innerHTML = "";
    for (const genre of genres) {
      detailMovieGenre.innerHTML += `
      <button disabled="disabled" class="btn btn-outline-danger border border-2 bg-transparent rounded-pill fw-bold py-1 text-danger fs-14 me-1">${genre}</button>
      `;
    }
    for (const director of directors) {
      detailDirector.innerHTML += `
      <span class="mx-2 text-danger">${director}</span> .
      `;
    }
    for (const writer of writers) {
      detailWriter.innerHTML += `
      <span class="mx-2 text-danger">${writer}</span> .
      `;
    }
    for (const star of stars) {
      detailStar.innerHTML += `
      <span class="mx-2 text-danger">${star}</span> .
      `;
    }
  };
});
