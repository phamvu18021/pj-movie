import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../firebase/firebase';
import { useAuth } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { ref, getDatabase, get, onValue } from "firebase/database";
import './sidebar.scss';

const sidebarNavItems = [

    {
        display: 'User Setings',
        icon: <i className='bx bx-cog'></i>,
        to: '/profile/user-settings',
        event: "",

    },
    {
        display: 'History',
        icon: <i className='bx bx-history'></i>,
        to: '/profile/pf-history',
        event: "",

    },
    {
        display: 'Gallery',
        icon: <i className='bx bx-bookmarks'></i>,
        to: '/profile/pf-gallery',
        event: "",

    },
    {
        display: 'Favorite',
        icon: <i className='bx bx-heart'></i>,
        to: '/profile/pf-gallery',
        event: "",

    },
    {
        display: 'Logout',
        icon: <i class="ri-logout-box-r-line"></i>,
        to: '',
        event: "1",

    },
]

const Sidebar = () => {
    const checkUser = useAuth();
    const currentUsera = getAuth().currentUser;
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();

    const { pathname } = useLocation();
    const [photoURL, setPhotoURL] = useState("");
    const [userName, setUserName] = useState("User")
    // const curPath = useLocation();
    const db = getDatabase();
    const activeind = sidebarNavItems.findIndex(e => e.to === pathname)

    async function handleLogout() {

        try {
            await logout();
            window.location.reload();


        } catch {
            alert("Error!");
        }

    }
    useEffect(() => {
        if (currentUsera) {
            const userId = currentUsera.uid;
            console.log(checkUser);
            onValue(ref(db, '/users/' + userId), (snapshot) => {
                // console.log(snapshot.val().profile_picture);

                setPhotoURL(snapshot.val().profile_picture);
                setUserName(snapshot.val().username);
                // ...
            }, {
                onlyOnce: true
            });
        }
    }, [currentUsera])



    // change active index
    // useEffect(() => {

    //     const activeItem = sidebarNavItems.findIndex(item => item.to === curPath);
    //     setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    // }, [location]);

    return (
        <div className='sidebar'>
            <ul className='sidebar_nav'>
                <li className='user_infoside'>
                    <img src={photoURL} alt="Avatar" className="avatar" /> <span>{userName}</span>

                </li>
                {
                    sidebarNavItems.map((item, index) => (

                        item.to !== "" ? (
                            <li className={`${index === activeind ? 'active' : ''}`}>
                                <Link to={item.to} key={index} >
                                    <div className='sidebar__menu__item '>
                                        <span className="sidebar__menu__item__icon">
                                            {item.icon}
                                        </span>
                                        <span className="sidebar__menu__item__text">
                                            {item.display}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ) : (

                            <li key={index} className={`${activeIndex === index ? 'active' : ''}`} onClick={handleLogout} >
                                <div className='sidebar__menu__item '>
                                    <span className="sidebar__menu__item__icon">
                                        {item.icon}
                                    </span>
                                    <span className="sidebar__menu__item__text">
                                        {item.display}
                                    </span>
                                </div>
                            </li>
                        )
                    ))
                }
            </ul>
        </div>
    )
};

export default Sidebar;