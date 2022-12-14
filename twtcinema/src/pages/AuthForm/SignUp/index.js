import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.scss';
import classNames from 'classnames/bind';

import { AuthContext } from '~/context';

import { register } from '~/apiService/auth';

import image from '~/assets/Images';

const cs = classNames.bind(styles);

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const { showToastMessage } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !password2) {
            showToastMessage('error', 'Vui lòng nhập đủ thông tin');
        } else {
            if (password !== password2) {
                showToastMessage('error', 'Mật khẩu không khớp');
            } else {
                const data = {
                    name,
                    email,
                    avatar: image.avatar,
                    password,
                };
                const res = await register(data);
                if (res.success) {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    navigate('/movie');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setPassword2('');
                    showToastMessage('success', res.message);
                } else {
                    showToastMessage('error', res.message);
                }
            }
        }
    };
    return (
        <div className={cs('wrapper')} style={{ backgroundImage: `url(${image.background})` }}>
            <div className={cs('modal')}>
                <Link to="/movie" className={cs('header')}>
                    <img className={cs('logo-img')} src={image.logo} alt="logo" />
                    <h4>Đăng ki tài khoản TwTCinema</h4>
                </Link>
                <form onSubmit={handleSubmit} className={cs('form')}>
                    <input
                        type="name"
                        name="name"
                        value={name}
                        placeholder="Nhập tên người dùng..."
                        required
                        className={cs('Input')}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Nhập email..."
                        required
                        className={cs('Input')}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Nhập mật khẩu..."
                        required
                        className={cs('Input')}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password2}
                        placeholder="Xác nhận lại mật khẩu..."
                        required
                        className={cs('Input')}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <button type="submit" className={cs('Button')}>
                        Đăng kí
                    </button>
                </form>
                <p className={cs('textNote')}>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay bây giờ</Link>
                </p>
            </div>
        </div>
    );
};
export default Signup;
