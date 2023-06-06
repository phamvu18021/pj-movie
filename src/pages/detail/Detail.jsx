import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import nft from '../../components/modala/nft.jpg'
import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import { useAuth, writeCmttoMoviesData } from '../../firebase/firebase';
import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';
import Comment from './Comment';
import MovieList from '../../components/movie-list/MovieList';
import { writeMoviesCmtData } from '../../firebase/firebase';
import { getAuth } from "firebase/auth";
import { ref, getDatabase, update, onValue, set, child } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Button, { Buttonplay } from '../../components/button/Button';
import { historyplayData } from '../../firebase/firebase';
import { hover } from '@testing-library/user-event/dist/hover';
import { saveData } from '../../firebase/firebase';
import MovieList2 from '../../components/movie-list/MovieList2';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Rating from '@mui/material/Rating';
import "../../../node_modules/video-react/styles/scss/video-react.scss";
import { Player } from 'video-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import imga from "../../assets/footer-bg.jpg"
const Detail = () => {

    const { category, id } = useParams();
    const checkUser = useAuth();
    const [listCmt, setListcmt] = useState([]);
    const currentUsera = getAuth().currentUser;
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    const [userName, setUserName] = useState("User");
    const [cmtcount, setCmtcount] = useState('0')
    const [cmt, setCmt] = useState("")
    const navigate = useNavigate();
    const db = getDatabase();
    const [item, setItem] = useState(null);
    const [cmtinput, setcmtinput] = useState("");
    const [savedata, setSavedata] = useState(false)
    const [logintt, setLogintt] = useState(false);
    const [value, setValue] = React.useState('1');
    const [showmv, setShowmv] = useState(false);
    const [tvstatus, setTvstatus] = useState(false);
    const [arrayep, setArrayep] = useState([]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // const uidd=currentUsera.uid


    useEffect(() => {
        if (category === "tv") {
            setTvstatus(true);
            // let newArray = Array.from({ length: `${item.last_episode_to_air.episode_number}` }, (value, index) => index);
            // setArrayep(newArray);
            // console.log(newArray)
        } else {
            setTvstatus(false);
        }
    }, [id])

    console.log(arrayep)
    useEffect(() => {

        onValue(ref(db, '/moviescmt/' + `${category}+${id}`), (snapshot) => {
            // console.log(snapshot.val().profile_picture);

            if (snapshot.exists()) {
                if (cmtcount != snapshot.val().cmtcount) {
                    setCmtcount(snapshot.val().cmtcount)
                }

            }
            // ...
        });


    }, [cmtcount])
    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, { params: {} });

            setItem(response);
            window.scrollTo(0, 0);
            console.log(response)
        }
        getDetail();

        console.log(item)
    }, [category, id]);


    useEffect(() => {

        if (currentUsera) {
            setLogintt(true);
            const userId = currentUsera.uid;

            onValue(ref(db, '/users/' + userId), (snapshot) => {

                if (snapshot.val().profile_picture != "") {
                    setPhotoURL(snapshot.val().profile_picture);
                    setUserName(snapshot.val().username);

                }
                // ...
            });
        }


    }, [currentUsera])
    useEffect(() => {
        if (currentUsera) {


            onValue(ref(db, '/moviescmt/' + `${category}+${id}`), (snapshot) => {
                // console.log(snapshot.val().profile_picture);

                if (snapshot.exists()) {
                    // console.log(snapshot.val())
                    setCmtcount(snapshot.val().cmtcount)
                } else {
                    writeMoviesCmtData(id, category, 0);
                }

                // ...
            });

            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/save/' + `${currentUsera.uid}+${category}+${id}`), (snapshot) => {
                if (snapshot.exists()) {
                    setSavedata(true);
                }
            })

        }
    }, [currentUsera])



    function handleSendcmt() {
        if (currentUsera) {
            if (cmt.trim().length > 0) {
                const date = new Date().toLocaleString() + '';
                let datea = date + "";
                console.log(datea)
                writeCmttoMoviesData(currentUsera.uid, id, category, cmt, datea, 0, 0);

                setTimeout(setCmt(""), 3000);
            }
        }
    }
    console.log(Date().toLocaleDateString)

    useEffect(() => {


        onValue(ref(db, 'moviescmt/' + `${category}+${id}` + '/' + 'cmt'),
            (snapshot) => {

                let listCmta = [

                ];

                if (snapshot.exists()) {

                    snapshot.forEach(childSnapshot => {
                        let obex = {};
                        obex = {
                            key: childSnapshot.key,
                            cmtby: childSnapshot.val().cmtby,
                            cmtat: childSnapshot.val().cmtat,
                            cmtcontent: childSnapshot.val().cmtcontent,
                        }
                        // console.log(obex)
                        listCmta.push(obex);

                    })


                    console.log(listCmta)
                    //    let  listCmtb=listCmta.reverse();
                    setListcmt(listCmta)
                } else {
                    console.log("No data available");
                }

            });

    }, [cmtcount])
    function playmovie() {
        setShowmv(true);
        if (category === "tv") {
            let newArray = Array.from({ length: `${item.last_episode_to_air.episode_number}` }, (value, index) => index+1);
            setArrayep(newArray.reverse());
            console.log(newArray);
        }

        if (currentUsera) {
            const date = new Date().toLocaleString() + '';
            let datea = date + "";
            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/history/' + `${currentUsera.uid}+${category}+${id}`), (snapshot) => {
                if (snapshot.exists()) {
                    update(ref(db, 'users/' + `${currentUsera.uid}` + '/history/' + `${currentUsera.uid}+${category}+${id}`), {
                        playat: datea,
                    })
                } else {
                    historyplayData(currentUsera.uid, id, category, datea, item.poster_path || item.backdrop_path, item.name || item.title);
                }
            }, {
                onlyOnce: true
            })
        }

    }

    function savemovie() {
        if (currentUsera) {
            const date = new Date().toLocaleString() + '';
            let datea = date + "";
            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/save/' + `${currentUsera.uid}+${category}+${id}`), (snapshot) => {
                if (snapshot.exists()) {

                } else {
                    saveData(currentUsera.uid, id, category, datea, item.poster_path || item.backdrop_path, item.name || item.title);
                    setSavedata(true);
                }
            }, {
                onlyOnce: true
            })
        }
    }

    return (
        <>
            {
                item && (
                    <>
                        <div className="banner" style={{ backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})` }}></div>
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">

                                <div className="movie-content__poster__img" style={{ backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})` }}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">
                                    {item.title || item.name}
                                </h1>
                                <div className="genres">
                                    {
                                        item.genres && item.genres.slice(0, 6).map((genre, i) => (
                                            <span key={i} className="genres__item">{genre.name}</span>
                                        ))
                                    }
                                </div>
                                <p className="overview">{item.overview}</p>
                                {/* <div className="cast">
                                    <div className="section__header">
                                        <h2>Casts</h2>
                                    </div>
                                    <CastList id={item.id} />
                                </div> */}
                                <hr />

                                <div className='rateview'>
                                    <div className="rate">
                                        <div className="rate_circle">
                                            <CircularProgressbar
                                                value={item.vote_average * 10}
                                                text={`${(item.vote_average * 10).toFixed(2)}%`}
                                                styles={buildStyles({
                                                    // trailColor: '#3e98c7',
                                                    textColor: "white",
                                                    pathColor: '#AEDD44',
                                                })}
                                            />
                                        </div>
                                        <div className="rate_star">
                                            <Rating className='star-rate' name="read-only" value={item.vote_average / 10 * 5} readOnly />
                                            <p>(Rate <span>{item.vote_average}</span>/10 from  <span>{item.vote_count}</span> members )</p>
                                        </div>
                                    </div>

                                    <div className="viewandrelease">
                                        <p><i class="ri-eye-fill"></i> <span>{item.runtime}</span> views</p>
                                        <p> <i class="ri-calendar-todo-fill"></i> <span>{item.release_date}</span> </p>
                                    </div>
                                </div>

                                <div className='btns'>
                                    <div>
                                        <Buttonplay onClick={playmovie} >
                                            <div className='iconhrsa'>
                                                <i class="ri-play-fill"></i>
                                            </div>

                                        </Buttonplay>
                                    </div>

                                    {savedata &&
                                        <div>
                                            <Button onClick={savemovie}>
                                                <div className='iconhrs'>
                                                    <i class="ri-check-line"></i>
                                                </div>

                                            </Button>
                                        </div>
                                    }

                                    {!savedata &&
                                        <div>
                                            <Button onClick={savemovie}>
                                                <div className='iconhrs'>
                                                    <i class="ri-bookmark-3-line"></i>
                                                </div>

                                            </Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>


                        <div className="detail-body container">
                            <div className='ctop'>

                                <div className="trailer__list">
                                    {
                                        showmv &&
                                        <>
                                            <div className="detail_video">
                                                <div className="player">
                                                    <Player
                                                        playsInline
                                                        poster={apiConfig.originalImage(item.backdrop_path || item.poster_path)}
                                                        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                                                    />
                                                </div>

                                            </div>
                                            <div className="video_ep">
                                                { tvstatus &&
                                                <>
                                                <p>Server : Test </p>
                                                <div>
                                                    {arrayep.map((item)=>(
                                                        <button>{item}</button>
                                                    ))} 
                                                </div>                                                     
                                                </>
                                                }
                                                { !tvstatus &&
                                                <>
                                                <p>Server: test</p>
                                                <div>
                                                      <button>Test</button>
                                                </div>                                                     
                                                </>
                                                }

                                            </div>
                                        </>
                                    }


                                    <Box className="box_detail" sx={{ width: '100%', typography: 'body3' }}>
                                        <TabContext value={value}

                                        >
                                            <Box

                                                sx={{
                                                    // borderBottom: '1',
                                                    // borderColor: 'white',

                                                    "& button": { fontWeight: "500", fontSize: "1.1rem", color: "white" },
                                                    "& button:active": { color: "greenyellow" },
                                                    "& button.Mui-selected": { color: "white", backgroundColor: "#141740" },

                                                }}>
                                                <TabList onChange={handleChange}
                                                    aria-label="lab API tabs example"
                                                    className='tablist_detail'
                                                >
                                                    <Tab label="Movie information" value="1" className='tab_detail' />
                                                    <Tab label="Cast" value="2" />
                                                    <Tab label="Trailer" value="3" />
                                                </TabList>
                                            </Box>



                                            <TabPanel value="1">
                                                <div className='movie_info_grid'>
                                                    <div className="grid_left">
                                                        <p>Status : </p> <span>{item.status}</span>
                                                        <p>Genres : </p>{item.genres.map((item) => <span> {item.name} , </span>)}
                                                        <p>Homepage: </p> <span>{item.homepage}</span>
                                                        <p>Production :</p>{item.production_companies.map(item => <span>{item.name} ,</span>)}
                                                        {tvstatus && <><p>Seasons: </p> <span>{item.number_of_seasons} / {item.seasons.length}</span></>}
                                                    </div>

                                                    <div className="grid_right">
                                                        {tvstatus && <><p>Episode: </p> <span>{item.last_episode_to_air.episode_number
                                                        } / {item.number_of_episodes}</span></>}
                                                        <p>Country :</p> <span>{item.production_countries.map(item => <span>{item.name} ,</span>)}</span>
                                                        <p>Release_date :</p>  <span>{item.release_date || item.seasons[item.number_of_seasons - 1].air_date} </span>
                                                        <p>Languages : </p>{item.spoken_languages.map(item => <span> {item.name} ,</span>)}
                                                        <p>Tagline :</p> {item.tagline}<span> </span>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <div className="cast">
                                                    <div className="section__header">
                                                        <h2>Casts</h2>
                                                    </div>
                                                    <CastList id={item.id} />
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <VideoList id={item.id} />
                                            </TabPanel>
                                        </TabContext>
                                    </Box>



                                    <div className='comment'>
                                        <div className="cmt_count">
                                            <p> <span>{cmtcount}</span> Comments </p>
                                        </div>

                                        <div className="comment_fieldss">
                                            <div className="avata">
                                                <img src={photoURL} />
                                            </div>
                                            <div className="comment_ri">
                                                <div className="fields_texta">
                                                    <input
                                                        multiple
                                                        type="text"
                                                        placeholder='Viet binh luan...'
                                                        value={cmt}
                                                        onChange={(e) => setCmt(e.target.value)}

                                                    />
                                                </div>
                                                <div className="btn_cmt">
                                                    <button onClick={handleSendcmt}>Send</button>
                                                </div>
                                            </div>
                                        </div>


                                        <div>
                                            {
                                                listCmt.map((item, i) => (
                                                    <div key={i}>
                                                        <Comment item={item} category={category} id={id} />
                                                    </div>

                                                ))
                                            }
                                        </div>



                                    </div>


                                </div>
                                <div className="topmovie section mb-3">
                                    <div className=" section__header mb-2">
                                        <h2>Top  {category}</h2>
                                    </div>
                                    <MovieList2 category={category} type="popular" id={item.id} />
                                </div>

                            </div>


                            <div className="section mb-3">
                                <div className="section__header mb-2">
                                    <h2>Similar</h2>
                                </div>
                                <MovieList category={category} type="similar" id={item.id} />
                            </div>




                        </div>

                    </>
                )


            }
        </>
    );
}

export default Detail;





