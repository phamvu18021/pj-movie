import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'
import tmdbApi, { category, movieType } from '../../api/tmdbApi'
import apiConfig from '../../api/apiConfig'
import './hero-slide.scss'
import Button, { Buttonplay,Buttonsave } from '../button/Button'
import { Pagination, Navigation } from 'swiper'
import { ref, getDatabase, update, onValue, set, child } from "firebase/database";
import "swiper/swiper.scss";
import { saveData } from '../../firebase/firebase';
import "swiper/components/navigation/navigation.scss";
import { getAuth } from "firebase/auth";

const HeroSlide = () => {
    const [genrea, setGenrea] = useState({});


    useEffect(() => {
        const getGenresa = async () => {
            const responsea = await tmdbApi.getGenres(category.movie);
            setGenrea(responsea);
            ;
            console.log(responsea);
        };
        getGenresa();

    }, [])
    console.log(genrea)
    // setTimeout( console.log(genrea),3000);
    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 }
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.results.slice(0, 4));
                // console.log(response);
            } catch {
                console.log('error');
            }
        }
        getMovies();
    }, []);

    return (
        <div className='hero-slide'>
            <Swiper
                modules={[Navigation]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}


            // autoplay={{ delay: 3000 }}
            >
                {
                    movieItems.map((item, i) => (
                        <SwiperSlide key={i}>
                            {({ isActive }) => (
                                <HeroSlideItem item={item} genrea={genrea} className={`${isActive ? 'active' : ''}`} />
                            )}
                        </SwiperSlide>
                    ))
                }
            </Swiper>

        </div>
    );
}

const HeroSlideItem = props => {

    const currentUsera = getAuth().currentUser;
    let history = useNavigate();
    const item = props.item;
    const genreab = props.genrea;
    const db = getDatabase();
    console.log(item)
    console.log(genreab)
    const [savedata, setSavedata] = useState(false)
    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);
    console.log(item.genre_ids)
    function savemovie() {
        if (currentUsera) {
            const date = new Date().toLocaleString() + '';
            let datea = date + "";
            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/save/' + `${currentUsera.uid}+movie+${item.id}`), (snapshot) => {
                if (snapshot.exists()) {

                } else {
                    saveData(currentUsera.uid, item.id, "movie", datea, item.poster_path || item.backdrop_path, item.name || item.title);
                    setSavedata(true);
                }
            }, {
                onlyOnce: true
            })
        }
    }
    useEffect(() => {
        if (currentUsera) {


            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/save/' + `${currentUsera.uid}+movie+${item.id}`), (snapshot) => {
                if (snapshot.exists()) {
                    setSavedata(true);
                }
            })

        }
    }, [currentUsera])

    const arraygen = item.genre_ids.map(getGenresfun);
    console.log(arraygen);
    function getGenresfun(item) {
        for (let i = 0; i < genreab.genres.length; i++) {
            if (item == genreab.genres[i].id) {
                return genreab.genres[i].name;
            }
        }
    }

    return (
        <div
            className={`hero-slide__item ${props.className}`}
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className='hero-slide__item__content container'>
                <div className='hero-slide__item__content__info'>
                    <h2 className='title'>{item.title}</h2>
                    <div className='btns'>
                        <Buttonplay onClick={() => history('/movie/' + item.id)}>
                            <div className='iconhrs'>
                                <i class="ri-play-fill"></i>
                            </div>

                        </Buttonplay>
                        {savedata &&
                            <div>
                                <Buttonsave className="btnsavehrs" onClick={savemovie}>
                                    <div className='iconhrs'>
                                        <i class="ri-check-line"></i>
                                    </div>

                                </Buttonsave>
                            </div>
                        }

                        {!savedata &&
                            <div>
                                <Buttonsave className="btnsavehrs" onClick={savemovie}>
                                    <div className='iconhrs'>
                                        <i class="ri-bookmark-3-line"></i>
                                    </div>

                                </Buttonsave>
                            </div>
                        }
                        {/* <OutlineButton onClick={setModalActive} >
                            Watch trailer
                        </OutlineButton> */}

                    </div>

                    <div className="voteanddate">
                        <div className="star">
                            <span><i class="ri-star-fill"></i><span>{item.vote_average}</span> </span>  | <span> {item.release_date}</span>
                        </div>
                    </div>
                    <div className="genresz">
                        {
                            arraygen.map((item, i) => (

                                <span key={i} className="genresz__item">{item}</span>

                            ))
                        }

                    </div>

                    <div className='overview'>{item.overview}</div>


                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt="" />
                </div>
            </div>
        </div>
    )

}


// const TrailerModal = props => {
//     const item = props.item;

//     const iframeRef = useRef(null);

//     const onClose = () => iframeRef.current.setAttribute('src', '');

//     return (
//         <Modal active={false} id={`modal_${item.id}`}>
//             <ModalContent onClose={onClose}>
//                 <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
//             </ModalContent>
//         </Modal>
//     )
// }

export default HeroSlide;