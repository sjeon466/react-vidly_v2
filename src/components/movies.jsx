import React, { Component } from "react";
import Pagination from "./common/pagination";
import Like from "./common/like";
import { getMovies } from "../services/fakeMovieService";
import { paginate } from "../utils/paginate";
import ListGroup from "../components/common/listGroup";
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1
  };

  componentDidMount() {
    const genres = [{ name: "All Genres" }, ...getGenres()];
    this.setState({
      genres,
      movies: getMovies()
    });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    //console.log("handlePageChange, page = ", page);
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    console.log(genre);
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  /*   handleFiler = selectedGenre => {
    const movies = this.state.movies.map(
      movie => this.state.movies.genre === movie.genre
    );
    this.setState(movies);
  };
 */
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre
    } = this.state;
    if (count === 0) return <p>There are no movies in the database.</p>;

    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => selectedGenre._id === m.genre._id)
        : allMovies;

    //const movies = ...
    const movies = paginate(filtered, currentPage, pageSize);

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <p>Showing {filtered.length} movies in the database.</p>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Rate</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>{movie.dailyRentalRate}</td>
                  <td>
                    <Like
                      liked={movie.liked}
                      onClick={() => this.handleLike(movie)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(movie)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
