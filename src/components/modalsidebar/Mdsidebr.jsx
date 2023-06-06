import React, { useRef, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { sidebarUiActions } from '../../store/sidebar/sidebarUiSlice';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../firebase/firebase';
import { ref, getDatabase, get, onValue } from "firebase/database";
import { logout } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import './mdside.scss'
const Mdsidebr = () => {
    const checkUser = useAuth();
    const currentUsera = getAuth().currentUser;
    const dispatch = useDispatch();
    const db = getDatabase();
    const toggleSidebar = () => {
        dispatch(sidebarUiActions.toggle());
    };
    const [photoURL, setPhotoURL] = useState("");
    const [userName, setUserName] = useState("User");
    async function handleLogout() {

        try {
            await logout();
            window.location.reload();


        } catch {
            alert("Error!");
        }

    }
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
    return (
        <div className='sideContainer'>
            <div className="btn__close">
                <span onClick={toggleSidebar}>
                    <i class="ri-close-fill"></i></span>
            </div>
            <ul className='dropdown__menu_'>
                <li className='header__user__i'>
                <Link to='/Profile'>  <img src={photoURL} alt="Avatar2" className="avatar" /> <span>{userName}</span></Link>

                </li>

                <Link to='/profile/user-settings'> <li><span>User setting</span>  <i class="ri-arrow-drop-right-line"></i></li></Link>
                <hr />
                <Link to='/profile/pf-history'><li><span>Watch List</span><i class="ri-arrow-drop-right-line"></i></li></Link>
                <Link to='profile/pf-gallery'><li><span>Favorite List</span> <i class="ri-arrow-drop-right-line"></i></li></Link>
                <hr />
                <li><span>About us</span><i class="ri-arrow-drop-right-line"></i></li>
                <li><span>Term of services</span><i class="ri-arrow-drop-right-line"></i></li>
                <li onClick={handleLogout}> <span>LogOut</span><i class="ri-arrow-drop-right-line"></i></li>

            </ul>
            {/* <div onClick={toggleSidebar}></div> */}
        </div>

    )
}

export default Mdsidebr