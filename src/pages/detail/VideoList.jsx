import React, { useState, useEffect, useRef } from 'react';

import { useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import SwiperCore, { A11y, Autoplay, Pagination, Scrollbar, Navigation } from 'swiper';
import tmdbApi from '../../api/tmdbApi';
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss"
const VideoList = props => {

    const { category } = useParams();

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const res = await tmdbApi.getVideos(category, props.id);
            setVideos(res.results.slice(0, 5));
        }
        getVideos();
    }, [category, props.id]);


    return (
        <>
            <div className='video-list'>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}

                    // grabCursor={true}
                    // spaceBetween={50}
                    pagination={{
                        type: "progressbar",
                    }}
                    navigation={true}
                    slidesPerView={1}

                    scrollbar={{ draggable: true }}
                >

                    {
                        videos.map((item, i) => (
                            <SwiperSlide key={i}>
                                <Video key={i} item={item} />
                            </SwiperSlide>


                        ))

                    }
                </Swiper>

            </div>

        </>
    );
}

const Video = props => {

    const item = props.item;

    const iframeRef = useRef(null);

    useEffect(() => {
        const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
        iframeRef.current.setAttribute('height', height);
    }, []);

    return (
        <div className="video">
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>
            <div className='videp_iframe'>
                <iframe
                    src={`https://www.youtube.com/embed/${item.key}`}
                    ref={iframeRef}
                    width="60%"
                    title="video"
                ></iframe>
            </div>

        </div>
    )
}

export default VideoList;