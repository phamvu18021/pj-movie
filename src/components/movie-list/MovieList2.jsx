import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'swiper/swiper.min.css';

import './movie-list.scss';


import { SwiperSlide, Swiper } from 'swiper/react';
import { Link } from 'react-router-dom';

import Button from '../button/Button';

import tmdbApi, { category } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import MovieCard, { MovieCard2 } from '../movie-card/MovieCard';
import "swiper/components/pagination/pagination.scss"
const MovieList2 = props => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            let response = null;
            const params = { page: 1};

            if (props.type !== 'similar') {
                switch(props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(props.type, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(props.type, {params});
                }
            } else {
                response = await tmdbApi.similar(props.category, props.id);
            }
            setItems(response.results.slice(0,5));
        }
        getList();
    }, []);

    return (
        <div className="movie-list2">
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
                direction="vertical"
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard2 item={item} category={props.category}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

MovieList2.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default MovieList2