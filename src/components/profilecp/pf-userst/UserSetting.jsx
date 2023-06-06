import React from 'react'
import { useEffect, useState } from "react";
import { useAuth, upload } from "../../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { ref, getDatabase, get, onValue, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

import './usersetting.scss'

const UserSetting = () => {

  const checkUser = useAuth();
  const currentUsera = getAuth().currentUser;
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [userName, setUserName] = useState("User");
  const [btneditimg, setBtneditimg] = useState(false);
  const [btneditname, setBtneditname] = useState(false);
  const [btneditpw, setBtneditemailpw] = useState(false);
  const [btneditemail, setBtneditemail] = useState(false);
  const [emailtxt, setEmailtxt] = useState("Is not set yet");
  const [emailtxts, setEmailtxts] = useState("");
  const [userNames, setUserNames] = useState("");
  const [phonetxt, setPhonetxt] = useState("Is not set yet");
  const [passwordtxt, setPasswordtxt] = useState("Change your password");
  const navigate = useNavigate();
  const db = getDatabase();

  /*........................... */
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
    console.log(e.target);
  }

  useEffect(() => {
    if (currentUsera) {
      onValue(ref(db, 'users/' + currentUsera.uid), (snapshot) => {
        if (snapshot.val().email.length > 0) { setEmailtxt(snapshot.val().email) }
      })
    }
  }, [currentUsera])

  function handleClick() {
    upload(photo, currentUsera, setLoading, setPhotoURL);

    setBtneditimg(false);
    // setTimeout(window.location.reload(), 5000);

  }

  function handleClickemail() {
    if (emailtxts.length > 0) {
      update(ref(db, 'users/' + currentUsera.uid), {
        email: emailtxts,
      })
    }
    setBtneditemail(false);
  }

  function handleClickname() {
    if (userNames.length > 0) {
      update(ref(db, 'users/' + currentUsera.uid), {
        username: userNames,
      })
    }
    setBtneditname(false);
  }

  function handleClickImg() {
    setBtneditimg(true);
  }

  function handleClickcloseimg() {
    setBtneditimg(false);
  }







  useEffect(() => {

    if (currentUsera) {
      const userId = currentUsera.uid;

      onValue(ref(db, '/users/' + userId), (snapshot) => {

        if (snapshot.val().profile_picture != "") {
          setPhotoURL(snapshot.val().profile_picture);
          setUserName(snapshot.val().username);

        }
        // ...
      });
    } else {
      navigate("/home");
    }


  }, [currentUsera])


  // useEffect(()=>{
  //    setBtneditimg(false);
  // },checkUser)


  return (
    <div className="pf_uscontainer">
      <div className="pf_fields">

        <div className="pf_title">
          <p >User settings</p>
        </div>

        <div className="user__info_us">
          <div className="user__info_title">
            <p>User info</p>
          </div>

          <div className="user__info_in">
            <div className='user__info_info'>
              <img onClick={handleClickImg} src={photoURL} alt="Avatar" className="avatar" />
              <div className="user_info_info_z">
                <span>{userName}</span>
                <p>Sex :<span> Female</span></p>
              </div>

            </div>
            <span onClick={e => setBtneditname(true)}>Edit</span>
          </div>

        </div>
        {
          btneditimg &&
          <>
            <div className="edit_info">
              <input type="file" onChange={handleChange} />
              <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
              <i onClick={handleClickcloseimg} class="ri-close-line"></i>
            </div>
          </>
        }
        {
          btneditname &&
          <>
            <div className="edit_info">
              <input type="text" placeholder='Write something....' onChange={e => setUserNames(e.target.value)} />
              <button onClick={handleClickname}>Update</button>
              <i onClick={e => setBtneditname(false)} class="ri-close-line"></i>
            </div>

          </>
        }

        <div className="user__security">
          <div className="user__security_title">
            <p>User Settings</p>
          </div>
          <div className="user_sc_body">
            <div className="user__sc_acc">
              <div className="user__sc_left">
                <span className='sp_a'>Email:  </span> <span>{emailtxt}</span>
              </div>
              <span className='sp_btn' onClick={e => setBtneditemail(true)}>Edit</span>
            </div>
            {
              btneditemail &&
              <>
                <div className="edit_info">
                  <input type="email" placeholder='Write something...' onChange={e => setEmailtxts(e.target.value)} />
                  <button onClick={handleClickemail}>Update</button>
                  <i onClick={e => setBtneditemail(false)} class="ri-close-line"></i>
                </div>
              </>
            }


            <div className="user__sc_acc">
              <div className="user__sc_left">
                <span className='sp_a'>Phone:  </span> <span>{phonetxt}</span>
              </div>
              <span className='sp_btn'>Edit</span>
            </div>



            <div className="user__sc_acc">
              <div className="user__sc_left">
                <span className='sp_a'>Password:  </span> <span>{passwordtxt}</span>
              </div>
              <span className='sp_btn'>Edit</span>
            </div>



            <div className="user__sc_acc">
              <div className="user__sc_left">
                <span className='sp_a'>Delete:  </span> <span>Delete this acount</span>
              </div>
              <span className='sp_btn'>Delete</span>
            </div>
          </div>

        </div>



      </div>
    </div>

  )
}

export default UserSetting;