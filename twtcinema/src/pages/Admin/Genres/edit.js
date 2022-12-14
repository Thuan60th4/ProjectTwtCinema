/* eslint-disable eqeqeq */
import styles from './Genres.module.scss';
import classNames from 'classnames/bind';
import { Button, Form } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getDetail, editGenres } from '~/apiService/genres';
import { AuthContext } from '~/context';
import { useNavigate, useParams } from 'react-router-dom';

const cs = classNames.bind(styles);

const EditGenres = () => {
    const { id } = useParams();
    const naviagte = useNavigate();
    const { showToastMessage } = useContext(AuthContext);

    const { register, handleSubmit, reset } = useForm();

    const Onsubmit = async (data) => {
        try {
            const res = await editGenres(data, id);
            naviagte('/admin/dashboard/genres');
            showToastMessage('success', res.message);
        } catch (error) {
            showToastMessage(error);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await getDetail(id);
                if (res.success) {
                    reset(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getGenres();
    }, []);

    return (
        <div className={cs('genres')}>
            <h3 className="text-center mt-4 mb-3 fs-1 fw-bold">Sửa thể loại</h3>
            <Form className={cs('genres_form')} onSubmit={handleSubmit(Onsubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Tên thể loại</Form.Label>
                    <Form.Control required type="text" {...register('name')} />
                </Form.Group>
                <button type="submit" className={cs('movie_btn_submit')}>
                    Lưu thông tin
                </button>
            </Form>
        </div>
    );
};

export default EditGenres;
