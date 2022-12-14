import instance from './instance';

export const getAll = (currPage, limit = null) => {
    let url;
    if (limit) {
        url = `/genres/get-all-genres?page=${currPage}&limit=${limit}`;
    } else {
        url = `/genres/get-all-genres?page=${currPage}`;
    }
    return instance.get(url);
};

export const getMulti = (slug) => {
    const url = '/genres/get-multi/' + slug;
    return instance.get(url);
};

export const getDetail = (id) => {
    const url = '/genres/get-detail/' + id;
    return instance.get(url);
};

export const createGenres = (data) => {
    const url = '/genres/create';
    return instance.post(url, data);
};

export const editGenres = (data, id) => {
    const url = '/genres/update/' + id;
    return instance.put(url, data);
};

export const deleteGenres = (id) => {
    const url = '/genres/delete/' + id;
    return instance.delete(url);
};
