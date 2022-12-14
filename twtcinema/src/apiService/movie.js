import instance from './instance';

export const getCountMovieMonth = () => {
    const url = '/get-count-movie-month';
    return instance.get(url);
};
export const getMovieMonth = () => {
    const url = '/get-movie-month';
    return instance.get(url);
};
export const getTotalView = () => {
    const url = '/get-total-view';
    return instance.get(url);
};
export const createMovie = (data) => {
    const url = '/create';
    return instance.post(url, data);
};

export const editMovie = (data, id) => {
    const url = '/update/' + id;
    return instance.put(url, data);
};

export const updateView = (slug) => {
    const url = '/update-viewed/' + slug;
    return instance.put(url);
};

export const deleteMovie = (id) => {
    const url = '/delete/' + id;
    return instance.delete(url);
};
