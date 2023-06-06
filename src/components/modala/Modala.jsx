import React, { useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { loginUiActions } from '../../store/login/loginUiSlice';
import { writeUserData } from '../../firebase/firebase';
import { signup, login, logout, useAuth } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import "./modala.scss"
const Modala = () => {
  document.body.style.overflow = 'hidden';
  const dispatch = useDispatch()
  const toggleLogin = () => {
    dispatch(loginUiActions.toggle());
  };

  const [loginVi, setLoginVi] = useState("false");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const currentUser = useAuth();
  const [errorsign, setErrorsign] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSignup() {
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value)
        .then((userCredential) => {
          var user = userCredential.user;
          writeUserData(user.uid, "User-" + user.uid.slice(3 - 8), emailRef.current.value, passwordRef.current.value, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
          toggleLogin();
        })

    } catch (error) {
     setErrorsign(true);
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      toggleLogin();

    } catch (error) {
      setError(true);

    }
    setLoading(false);
  }

  return (

    <div className="cart__container">

      {loginVi &&




        <>
          <div className="login">

            <form className='loginForm' >
              <div className="cart__close">
                <span onClick={toggleLogin}>
                  <i class="ri-close-fill"></i></span>
              </div>
              <h1>Login</h1>

              {error && <span>Wrong email or password!</span>}
              <div className="inputlg">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email"

                />
              </div>
              <div className="inputlg">
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"

                />
              </div>

              <button disabled={loading} onClick={handleLogin} >Login</button>


              <p >Do you have an account ? <span onClick={(e) => { setLoginVi(false) }}>Signup</span></p>
            </form>
          </div>
        </>




      }


      {!loginVi &&

      
        <>
          <div className="login">

            <form className='loginForm' >
              <div className="cart__close">
                <span onClick={toggleLogin}>
                  <i class="ri-close-fill"></i></span>
              </div>
              <h1>Sign up</h1>

              {errorsign && <span>Account already exists!</span>}
              <div className="inputlg">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email"

                />
              </div>
              <div className="inputlg">
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"

                />
              </div>
              <button disabled={loading} onClick={handleSignup} type="submit">Sign Up</button>
              {/* {error && <span>Wrong email or password!</span>} */}
              <p >Have an account ? <span onClick={(e) => { setLoginVi(true) }}>Login</span></p>
             
            </form>


          </div>
        </>





      }


    </div>
  );
};

export default Modala;