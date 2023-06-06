import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from "firebase/auth";
import { ref, getDatabase, get, onValue, set, child ,remove} from "firebase/database";
import tmdbApi from '../../../api/tmdbApi';
import { MovieCard3 } from '../../movie-card/MovieCard';
import apiConfig from '../../../api/apiConfig';
import '../../movie-grid/movie-grid.scss';
import './pfhistory.scss'
const Phistory = () => {
    const db = getDatabase();
    const currentUsera = getAuth().currentUser;
    const [listmovie, setListmovie] = useState([]);
    const [listmovieapi, setListmovieapi] = useState([]);

    const [moviecount,setMoviecount] = useState("1000");



    useEffect(() => {
        if (currentUsera) {

            let listitemapi = []


            onValue(ref(db, 'users/' + `${currentUsera.uid}` + '/history'), (snapshot) => {
                // console.log(snapshot);

                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        listitemapi.push({
                            uid:currentUsera.uid,
                            type:'/history',
                            key:childSnapshot.val().title,
                            id: childSnapshot.val().id,
                            category: childSnapshot.val().category,
                            poster_path: childSnapshot.val().imglink,
                            name: childSnapshot.val().name,
                            time: childSnapshot.val().playat,
                        })
                  
                    }
                    );
                    console.log(snapshot.val())
                    console.log(listitemapi);
                    setListmovieapi(listitemapi);
                    setMoviecount(listitemapi.length);
                }else{
                    setMoviecount(0);
                    setListmovieapi(listitemapi);
                }
            })
        }
    }, [moviecount])




    return (
        <div className="pfht_container">
            <div className="pfht_main">
                <div className="pfht_title">
                    <p>History List</p>
                </div>
                <div className="movie-grid2">
                    {
                        listmovieapi.map((item, i) => <MovieCard3 category={item.category} item={item} key={i} />)
                    }
                </div>
            </div>

        </div>

    )
}

export default Phistory