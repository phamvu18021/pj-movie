import React from 'react';

import './movie-card.scss';

import { Link } from 'react-router-dom';

import Button from '../button/Button';
import { remove,ref,getDatabase } from 'firebase/database';
import { category } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';


const MovieCard = props => {

    const item = props.item;
    console.log(item)
    const link = '/' + category[props.category] + '/' + item.id;

    const bg = apiConfig.w500Image(item.poster_path || item.backdrop_path);

    return (
        <Link to={link}>
            <div className="movie-card" style={{ backgroundImage: `url(${bg})` }}>
                <Button>
                    <i className="bx bx-play"></i>
                </Button>
            </div>
            <h3>{item.title || item.name}</h3>
        </Link>
    );
}

export default MovieCard;

export const MovieCard2 = props => {

    const item = props.item;

    const link = '/' + category[props.category] + '/' + item.id;

    const bg = apiConfig.w500Image(item.poster_path || item.backdrop_path);

    return (
        <div className='movie-card-container'>
            <Link to={link}>
                <div className="movie-card2" style={{ backgroundImage: `url(${bg})` }}>
                    <Button>
                        <i className="bx bx-play"></i>
                    </Button>
                </div>

            </Link>
            <div className="movie-card-info">
                <Link to={link}><p className='mvctitle'>{item.title || item.name}</p></Link>
                <div className="star">
                    <p><i value={{ colors: 'yellow' }} class="ri-star-fill"></i><span>{item.vote_average}</span> </p>
                </div>

                <p> <i class="ri-calendar-todo-fill"></i>  <span>{item.release_date}</span></p>
            </div>

        </div>

    );
}


export const MovieCard3 = props => {

    const item = props.item;
    console.log(item)
    const link = '/' + category[props.category] + '/' + item.id;

    const bg = apiConfig.w500Image(item.poster_path || item.backdrop_path);
    function deletehtr() {
        // remove(ref(getDatabase, 'users/' + `${item.uid}` + `${item.type}`+'/'+`${item.key}`));
        const db = getDatabase();

        const tasksRef = ref(db, 'users/' + `${item.uid}` + '/'+`${item.type}`+'/'+`${item.uid}+${item.category}+${item.id}`);
        
        remove(tasksRef);
    }
    return (

        <div className="mv3container">
            <div className='btn__closemv'  onClick={deletehtr}>
                <i class="ri-close-line"></i>
            </div>

            <Link to={link}>
                <div className="movie-card3" style={{ backgroundImage: `url(${bg})` }}>
                    <Button>
                        <i className="bx bx-play"></i>
                    </Button>

                </div>
            </Link>
            <span>{item.time}</span>
            <p>{item.title || item.name}</p>
        </div>



    );
}

