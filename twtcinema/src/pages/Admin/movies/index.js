/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Movies.module.scss';
import classNames from 'classnames/bind';
import { Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';

import requestApi from '~/apiService/index';
import { deleteMovie, getMovieMonth } from '~/apiService/movie';
import { Img } from '~/apiService/instance';
import { AuthContext } from '~/context';
import Panigation from '~/layout/component/Panigation';
import CountCmt from './CountComment';

const cs = classNames.bind(styles);

function MoviesPage() {
    const [movies, setMovies] = useState();
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState();
    const [currPage, setCurrPage] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [category, setCategory] = useState('all');
    const { showToastMessage } = useContext(AuthContext);

    const { searchValue, month } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef();

    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (!inputValue.startsWith(' ')) {
            setInputValue(inputValue);
        }
    };

    const getAllMovies = async (currPage) => {
        try {
            if (month) {
                const result = await getMovieMonth();
                if (result.success) {
                    setMovies(result.data);
                    setLoading(false);
                }
            } else if (searchValue) {
                const result = await requestApi.getSearch({ params: { keyword: searchValue } });
                if (result.success) {
                    setMovies(result.data);
                    setLoading(false);
                }
            } else {
                const result = await requestApi.getAll(currPage, category);
                if (result.success) {
                    setMovies(result.data);
                    setPages(result.pages);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllMovies(currPage);
    }, [currPage, searchValue, category, month]);

    const handleDeleteMovie = async (id) => {
        if (window.confirm('B???n th???t s??? mu???n xo?? phim n??y')) {
            const res = await deleteMovie(id);
            showToastMessage('success', res.message);
            getAllMovies();
        }
    };

    useEffect(() => {
        if (inputValue) {
            const ref = inputRef.current;
            const enterKey = async (e) => {
                e.preventDefault();
                if (e.keyCode === 13) {
                    navigate(`/admin/dashboard/movies/search/${inputValue}`);
                    setInputValue('');
                }
            };
            ref.addEventListener('keyup', enterKey);
            return () => {
                ref.removeEventListener('keyup', enterKey);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleChangeCate = (e) => {
        setCurrPage(1);
        setCategory(e.target.value);
    };

    return (
        <div className={cs('admin_container', 'movie')}>
            <h3 className="text-center mb-3 fs-1 fw-bold">Danh s??ch phim</h3>
            <div className={cs('movie_utils')}>
                <Link to="/admin/dashboard/movies/create" className="btn btn-success">
                    Th??m phim m???i
                </Link>
                <div className={cs('movie_search-box')}>
                    <input
                        ref={inputRef}
                        placeholder="Nh???p t??n phim..."
                        value={inputValue}
                        required
                        onChange={handleChange}
                    />
                    <Link
                        to={`/admin/dashboard/movies/search/${inputValue}`}
                        onClick={(e) => {
                            if (!inputValue) e.preventDefault();
                        }}
                    >
                        <button>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </Link>
                </div>
                {!month && !searchValue && (
                    <Form.Select className={cs('movie_select-form')} onChange={(e) => handleChangeCate(e)}>
                        <option value="all">-- T???t C??? --</option>
                        <option value="movie">Phim L???</option>
                        <option value="tv">Phim D??i T???p</option>
                    </Form.Select>
                )}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : movies.length < 1 ? (
                <h4 style={{ textAlign: 'center', fontSize: '1.8rem', marginTop: '30px' }}>Kh??ng c?? k???t qu??? n??o</h4>
            ) : (
                <>
                    <Table striped bordered hover className="mt-2">
                        <thead>
                            <tr>
                                <th className="text-center ">STT</th>
                                <th className="text-center">T??n phim</th>
                                <th className="text-center">Danh m???c</th>
                                <th className="text-center">???nh</th>
                                <th className="text-center">??i???m ????nh gi?? IMDb</th>
                                <th className="text-center">L?????t xem</th>

                                <th className="text-center">Ng??y ph??t h??nh</th>
                                <th className="text-center">B??nh lu???n</th>

                                <th className="text-center">Ch???c n??ng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies &&
                                movies.map((movie, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{movie.name}</td>
                                        <td className="text-center">
                                            {movie.category == 'movie' ? 'Phim l???' : 'Phim d??i t???p'}
                                        </td>
                                        <td className="text-center">
                                            <img
                                                className={cs('movie_img')}
                                                src={Img.baseImg(movie.backdrop_path)}
                                                alt=""
                                            />
                                        </td>
                                        <td className="text-center">{movie.ibmPoints}</td>
                                        <td className="text-center">{movie.viewed ?? 0}</td>

                                        <td className="text-center">
                                            {new Date(movie.releaseDate).toLocaleDateString()}
                                        </td>
                                        <CountCmt movieId={movie._id} />
                                        <td className="text-center">
                                            <Link to={`/admin/dashboard/movies/edit/${movie.slug}`}>S???a</Link>
                                            <Button variant="danger" onClick={() => handleDeleteMovie(movie._id)}>
                                                Xo??
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    {pages && !searchValue && (
                        <Panigation pages={pages} currPage={currPage} onSetCurrentPage={setCurrPage} />
                    )}
                </>
            )}
        </div>
    );
}

export default MoviesPage;
