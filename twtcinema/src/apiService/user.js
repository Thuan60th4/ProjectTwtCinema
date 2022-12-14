import instance from './instance';

export const getAll = () => {
    const url = '/user/get-all-user';
    return instance.get(url);
};

export const getAllCount = () => {
    const url = '/user/get-user-all-year';
    return instance.get(url);
};

export const getDetail = (email) => {
    const url = '/user/get-detail/' + email;
    return instance.get(url);
};

export const getFavoritesMovies = (id) => {
    const url = '/user/get-favorites-movie/' + id;
    return instance.get(url);
};

export const updateUserClient = (data, email) => {
    const url = '/user/update-user/' + email;
    return instance.put(url, data);
};

export const deleteUserClient = (data) => {
    const url = '/user/delete-user-client';
    return instance.put(url, data);
};

export const changePassword = (data) => {
    const url = '/user/change-password';
    return instance.put(url, data);
};

export const deleteUser = (id) => {
    const url = '/user/delete/' + id;
    return instance.delete(url);
};

export const editUser = (data, userEmail) => {
    const url = '/user/edit-user/' + userEmail;
    return instance.put(url, data);
};

export const addFavouriteMovie = (movieId, userId) => {
    const url = `/user/add-favourite`;
    return instance.post(url, { movieId, userId });
};

export const addHistoryMovie = (movieId, userId) => {
    const url = `/user/add-history`;
    return instance.post(url, { movieId, userId });
};
