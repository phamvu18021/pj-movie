import React, { useEffect } from 'react'
import Header from '../header/Header';

import Routers from '../../config/Routers';
import Footer from '../footer/Footer'
import { useSelector } from 'react-redux'
import Modala from '../modala/Modala';
import Mdsidebr from '../modalsidebar/Mdsidebr';

const Layouta = () => {
    const showLogin = useSelector((state) => state.loginUi.loginIsVisible);
    const showSidebar = useSelector((state) => state.sidebarUi.sidebarIsVisible);
    console.log(showLogin);
    useEffect(() => {

        if (showLogin) {
            document.body.style.overflow = 'hidden';
        }
        else { document.body.style.overflow = 'visible'; }
    }, [showLogin]);


    useEffect(() => {

        if (showSidebar) {
            document.body.style.overflow = 'hidden';
        }
        else { document.body.style.overflow = 'visible'; }
    }, [showSidebar]);
    return (

        <div>
            <Header />
            {
                showLogin && <Modala />
            }

            <div>
                <Routers />
            </div>
            {
                showSidebar && <Mdsidebr />
            }

            <div>
                <Footer />
            </div>

        </div>



    );
};

export default Layouta;