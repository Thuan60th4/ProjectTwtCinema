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
        if (window.confirm('Bạn thật sự muốn xoá phim này')) {
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
            <h3 className="text-center mb-3 fs-1 fw-bold">Danh sách phim</h3>
            <div className={cs('movie_utils')}>
                <Link to="/admin/dashboard/movies/create" className="btn btn-success">
                    Thêm phim mới
                </Link>
                <div className={cs('movie_search-box')}>
                    <input
                        ref={inputRef}
                        placeholder="Nhập tên phim..."
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
                        <option value="all">-- Tất Cả --</option>
                        <option value="movie">Phim Lẻ</option>
                        <option value="tv">Phim Dài Tập</option>
                    </Form.Select>
                )}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : movies.length < 1 ? (
                <h4 style={{ textAlign: 'center', fontSize: '1.8rem', marginTop: '30px' }}>Không có kết quả nào</h4>
            ) : (
                <>
                    <Table striped bordered hover className="mt-2">
                        <thead>
                            <tr>
                                <th className="text-center ">STT</th>
                                <th className="text-center">Tên phim</th>
                                <th className="text-center">Danh mục</th>
                                <th className="text-center">Ảnh</th>
                                <th className="text-center">Điểm đánh giá IMDb</th>
                                <th className="text-center">Lượt xem</th>

                                <th className="text-center">Ngày phát hành</th>
                                <th className="text-center">Bình luận</th>

                                <th className="text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies &&
                                movies.map((movie, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{movie.name}</td>
                                        <td className="text-center">
                                            {movie.category == 'movie' ? 'Phim lẻ' : 'Phim dài tập'}
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
                                            <Link to={`/admin/dashboard/movies/edit/${movie.slug}`}>Sửa</Link>
                                            <Button variant="danger" onClick={() => handleDeleteMovie(movie._id)}>
                                                Xoá
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
