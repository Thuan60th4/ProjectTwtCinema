/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import styles from './Movies.module.scss';
import classNames from 'classnames/bind';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseConnect } from '~/components/Firebase';

import { editMovie } from '~/apiService/movie';
import { getAll } from '~/apiService/genres';
import requestApi from '~/apiService';
import { AuthContext } from '~/context';
import { Img } from '~/apiService/instance';

const cs = classNames.bind(styles);

const EditMovie = () => {
    const { slug } = useParams();
    const [isTvShow, setIsTvShow] = useState(false);
    const [genres, setGenres] = useState([]);
    const [movie, setMovie] = useState();
    const [backdrop, setBackdrop] = useState('');
    const [posTer, setPosTer] = useState('');

    const { showToastMessage } = useContext(AuthContext);
    const naviagte = useNavigate();
    const storage = getStorage();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const getMovie = async () => {
            try {
                const result = await requestApi.getDetails(slug);
                if (result.success) {
                    setMovie(result.data);
                    if (Number.isInteger(result.data.genres[0])) {
                        result.data.genres = result.data.genres.map((genre) => genre.toString());
                    }
                    result.data.seasons=result.data.seasons ? result.data.seasons : 1;
                    reset(result.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMovie();
    }, [slug]);

    const Onsubmit = async (data) => {
        data.ibmPoints = Number(data.ibmPoints);
        data.episodes = Number(data.episodes);
        if (posTer) {
            data.poster_path = posTer;
        }
        if (backdrop) {
            data.backdrop_path = backdrop;
        }
        try {
            const res = await editMovie(data, movie._id);
            naviagte(-1);
            showToastMessage('success', res.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeCate = (e) => {
        if (e.target.value == 'tv') {
            setIsTvShow(true);
        } else {
            setIsTvShow(false);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await getAll();
                setGenres(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getGenres();
    }, []);

    const handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            if (e.target.id == 'backDrop') {
                                setBackdrop(downloadURL);
                            } else {
                                setPosTer(downloadURL);
                            }
                        } catch (error) {
                            console.log(error);
                            // setLoading(false);
                        }
                    });
                },
            );
        }
    };

    return (
        <div className={cs('movie')}>
            <h3 className="text-center mb-3 fs-1 fw-bold">Sửa phim</h3>
            {movie && (
                <Form className={cs('movie_form')} onSubmit={handleSubmit(Onsubmit)}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên phim</Form.Label>
                                <Form.Control required type="text" {...register('name')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Link trailer</Form.Label>
                                <Form.Control required type="text" {...register('trailerCode')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select {...register('category')} onChange={(e) => handleChangeCate(e)}>
                                    <option value="movie">Phim Lẻ</option>
                                    <option value="tv">Phim Dài Tập</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {(isTvShow || movie.category == 'tv') && (
                            <>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phần</Form.Label>
                                        <Form.Control required type="number" {...register('seasons')} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số tập phim</Form.Label>
                                        <Form.Control required type="number" {...register('episodes')} />
                                    </Form.Group>
                                </Col>
                            </>
                        )}
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Thể loại</Form.Label>
                                <Form.Select {...register('genres')} multiple className={cs('movie_form_genres')}>
                                    {genres.map((genres, index) => (
                                        <option value={genres.id} key={index}>
                                            {genres.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Quốc gia</Form.Label>
                                <Form.Control required type="text" {...register('country')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Id url phim</Form.Label>
                                <Form.Control required type="text" {...register('id')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Tóm tắt phim</Form.Label>
                                <Form.Control required as="textarea" type="text" {...register('overview')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày phát hành</Form.Label>
                                <Form.Control required type="date" {...register('releaseDate')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Điểm đánh giá</Form.Label>
                                <Form.Control required type="text" {...register('ibmPoints')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Ảnh nền</Form.Label>
                                <img
                                    className={cs('movie_backdrop_path')}
                                    src={backdrop || Img.baseImg(movie.backdrop_path)}
                                    alt=""
                                />
                                <Form.Control
                                    className="mt-4"
                                    id="backDrop"
                                    type="file"
                                    style={{ border: 'none' }}
                                    onChange={handleUploadImg}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Ảnh đại diện</Form.Label>
                                <img
                                    className={cs('movie_poster_path')}
                                    src={posTer || Img.posterImg(movie.poster_path)}
                                    alt=""
                                />
                                <Form.Control
                                    className="mt-4"
                                    type="file"
                                    style={{ border: 'none' }}
                                    onChange={handleUploadImg}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <button type="submit" className={cs('movie_btn_submit')}>
                        Cập nhập phim
                    </button>
                </Form>
            )}
        </div>
    );
};

export default EditMovie;
