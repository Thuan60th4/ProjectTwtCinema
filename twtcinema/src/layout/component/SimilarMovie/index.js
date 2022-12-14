import { useEffect, useState } from 'react';
import styles from './Similar.module.scss';
import classNames from 'classnames/bind';

import requestApi from '~/apiService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Img } from '~/apiService/instance';

const cs = classNames.bind(styles);

function SimilarMovie({ category, slug }) {
    const [similar, setSimilar] = useState([]);
    useEffect(() => {
        async function getCast() {
            const result = await requestApi.getSimilar(slug);
            setSimilar(result.data);
        }
        getCast();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);
    return (
        <div className={cs('wrapper')}>
            <Swiper grabCursor spaceBetween={10} slidesPerView={'auto'}>
                {similar.map((list, index) => (
                    <SwiperSlide key={index} className={cs('swiperItem')}>
                        <a href={`/${category}/${list.slug}`}>
                            <img className={cs('movieImg')} src={Img.baseImg(list.backdrop_path)} alt="" />
                            <span>{list.name}</span>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default SimilarMovie;
