import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog'
import Detail from '../pages/detail/Detail'
import Profile from '../pages/profile/Profile';

import UserSetting from '../components/profilecp/pf-userst/UserSetting';

import Phistory from '../components/profilecp/pf-history/Phistory';
import Pgallery from '../components/profilecp/pf-gallery/Pgallery';
const Routers = () => {

    const pathname = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />

            <Route path='/:category/search/:keyword' element={<Catalog />} />

            <Route path='/:category/:id' element={<Detail />} />

            <Route path='/:category' element={<Catalog />} />
            {/* <Route path='/movie' element={<Home />}  />
            <Route path='/tv' element={<Home />}  /> */}
            <Route path='profile' element={<Profile />} >
                <Route path='' element={<UserSetting />} />
                <Route path='user-settings' element={<UserSetting />} />
                <Route path='pf-history' element={<Phistory />} />
                <Route path='pf-gallery' element={<Pgallery />} />
  
            </Route>
        </Routes>
    )
};

export default Routers;