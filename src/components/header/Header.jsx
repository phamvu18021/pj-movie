import React, { useRef, useEffect, useState } from 'react'
import './header.scss';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/tmovie.png'
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../firebase/firebase';
import { ref, getDatabase, get, onValue } from "firebase/database";
import { logout } from '../../firebase/firebase';

import { loginUiActions } from '../../store/login/loginUiSlice';
import { sidebarUiActions } from '../../store/sidebar/sidebarUiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


const headerNav = [
    {
        display: 'Home',
        path: '/'
    },
    {
        display: 'Movies',
        path: '/movie'
    },
    {
        display: 'TV Series',
        path: '/tv'
    },

];





const Header = () => {
    const checkUser = useAuth();
    const currentUsera = getAuth().currentUser;
    const { pathname } = useLocation();
    const headerRef = useRef(null);
    const db = getDatabase();
    const active = headerNav.findIndex(e => e.path === pathname)
    const [photoURL, setPhotoURL] = useState("");
    const [userName, setUserName] = useState("User");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        dispatch(sidebarUiActions.toggle());

    };
    async function handleLogout() {

        try {
            await logout();
            window.location.reload();


        } catch {
            alert("Error!");
        }

    }

console.log(pathname)

    const toggleLogin = () => {
        dispatch(loginUiActions.toggle());
        console.log("fasdfasdf")
    };
    useEffect(() => {
        if (checkUser) {
            const userId = currentUsera.uid;
            // console.log(checkUser);
            onValue(ref(db, '/users/' + userId), (snapshot) => {
                // console.log(snapshot.val().profile_picture);

                setPhotoURL(snapshot.val().profile_picture);
                setUserName(snapshot.val().username);

                // ...
            }, {
                onlyOnce: true
            });
        }
    }, checkUser)







    useEffect(() => {

        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            }

            else {
                headerRef.current.classList.remove('shrink');
            }

            return () => {
                window.removeEventListener('scroll', shrinkHeader);
            }
        }

        window.addEventListener('scroll', shrinkHeader);
    }, [])
    return (
        <div ref={headerRef} className='header'>
            <div>
                { /* header left + logo */}
                <div className="header__wrap container" >

                    <ul className='header__nav'>
                        <div className='logo'>
                            <img src={logo} alt='' />
                            <Link to='/'>tMovies</Link>

                        </div>
                        {
                            headerNav.map((e, i) => (
                                <li key={i} className={`${i === active ? 'active' : ''}`}>
                                    <Link to={e.path}>
                                        {e.display}
                                    </Link>
                                </li>
                            ))
                        }

                    </ul>

                    {  /* header right */}
                    {/* <div className="header__search" >
                        <input
                            type="text"
                            placeholder="Enter keyword"

                        // onChange={(e) => setKeyword(e.target.value)}
                        ></input>
                        <div className="header__searchicon">
                            <i class="ri-search-line"></i>
                        </div>

                    </div> */}

                    <div className='test2'>

                        <div className="header__search" >
                            <input
                                type="text"
                                placeholder="Enter keyword"

                            // onChange={(e) => setKeyword(e.target.value)}
                            ></input>
                            <div className="header__searchicon">
                                <i class="ri-search-line"></i>
                            </div>

                        </div>
                        <ul className='header__navr'>

                            {checkUser &&
                                <>
                                    {/* <li>
                                    <div className="header__search" >
                                        <input
                                            type="text"
                                            placeholder="Enter keyword"

                                        // onChange={(e) => setKeyword(e.target.value)}
                                        ></input>
                                        <div className="header__searchicon">
                                            <i class="ri-search-line"></i>
                                        </div>

                                    </div>
                                </li> */}
                                    <li className='header__navr_user'>
                                        <Link to='/profile/pf-history'><i class="ri-time-line"></i> <p>History</p> </Link>
                                        {/* <ul className='dropdown__menu_profile'>
                                            <li><i class="ri-login-box-line"> <span>LogOut</span></i> </li>

                                        </ul> */}


                                    </li>

                                    <li className='header__navr_user'>
                                        <div>

                                            <img src={photoURL} alt="Avatar" className="avatar" />

                                        </div>



                                        <ul className='dropdown__menu_profile'>
                                            <li className='header__user__info'>
                                                <Link to='/Profile'>
                                                    <img src={photoURL} alt="Avatar" className="avatar" /> <p>{userName}</p>
                                                </Link>
                                            </li>
                                            <Link to='profile/pf-gallery'><li><i class="ri-bookmark-line"><span>Watch List</span></i><i class="ri-arrow-drop-right-line"></i></li> </Link>
                                            <Link to='/profile/pf-history'>  <li><i class="ri-heart-line"><span>Favorite List</span> </i><i class="ri-arrow-drop-right-line"></i></li> </Link>
                                            <Link to='/profile/user-settings'>  <li><i class="ri-user-line"><span>User setting</span></i>  <i class="ri-arrow-drop-right-line"></i></li> </Link>
                                            <li onClick={handleLogout}><i class="ri-login-box-line"> <span>LogOut</span></i> <i class="ri-arrow-drop-right-line"></i></li>
                                        </ul>

                                    </li>
                                </>
                            }


                            {!checkUser &&
                                <>
                                    {/* <li>
                                        <div className="header__search" >
                                            <input
                                                type="text"
                                                placeholder="Enter keyword"

                                            // onChange={(e) => setKeyword(e.target.value)}
                                            ></input>
                                            <div className="header__searchicon">
                                                <i class="ri-search-line"></i>
                                            </div>

                                        </div>
                                    </li> */}

                                    <li className='header__navr_user'>
                                        <i class="ri-time-line"></i> <p>History</p>
                                        <ul className='dropdown__menu_profile'>
                                            <p className='pinheader'>Login to use this feature!</p>
                                            <li className='header__btnlogin'>

                                                <button onClick={toggleLogin}>Login</button>
                                            </li>
                                        </ul>

                                    </li>

                                    <li className='header__navr_user'>
                                        <div onClick={toggleLogin}>
                                            <i class="ri-user-line"></i><p>Cua toi</p>
                                        </div>


                                        <ul className='dropdown__menu_profile'>
                                            <p className='pinheader'>Login to use this feature!</p>
                                            <li className='header__btnlogin'>

                                                <button onClick={toggleLogin}>Login</button>
                                            </li>
                                        </ul>

                                    </li>
                                </>
                            }

                            <li className='header__navr_app' >
                                <span onClick={toggleLogin}>
                                    <i class="ri-download-2-line"></i>
                                    <p>APP</p>
                                </span>

                            </li>
                        </ul>
                    </div>

                    <ul className="mobile__menu" onClick={toggleSidebar} >
                        <i class="ri-menu-line"></i>
                    </ul>


                </div>
            </div>


        </div>


    )
}
export default Header;
