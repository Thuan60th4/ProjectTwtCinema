import styles from './Users.module.scss';
import classNames from 'classnames/bind';

import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';
import { deleteUser, getAll } from '~/apiService/user';
import { useState } from 'react';
import image from '~/assets/Images';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const cs = classNames.bind(styles);

function UsersPage() {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const users = await getAll();
            setUsers(users.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if(window.confirm('Are you sure you want to delete')){
            const res = await deleteUser(id);
            if(res.success) {
                await getUsers();
            }
        }else {
            console.log('errror')
            return;
        }
    };

    return (
        <div className={cs('admin_container', 'user')}>
            <h3 className="text-center mb-3 mt-4 fs-1 fw-bold">Danh sách User</h3>
            <Table striped bordered hover className="mt-2">
                <thead className={cs('')}>
                    <tr>
                        <td className="text-center fw-bold">STT</td>
                        <td className="text-center fw-bold">Avatar</td>
                        <td className="text-center fw-bold">Email</td>
                        <td className="text-center fw-bold">Tên</td>
                        <td className="text-center fw-bold">Quyền hạn</td>
                        <td className="text-center fw-bold">Chức năng</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                                <img className={cs('user_avatar_img')} src={user.avatar || image.avatar} alt="" />
                            </td>
                            <td className="text-center">{user.email}</td>
                            <td className="text-center">{user.name}</td>
                            <td className="text-center">{user.isAdmin == true ? 'Admin' : 'User'}</td>
                            <td className="text-center">
                                <Link to={`/admin/dashboard/users/edit/${user.email}`}>Sửa</Link>
                                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                                    Xoá
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default UsersPage;
