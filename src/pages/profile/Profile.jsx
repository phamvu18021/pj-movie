import { useEffect, useState } from "react";
import { useAuth, upload } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { ref, getDatabase, get, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import './profile.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
export default function Profile() {
  // const checkUser = useAuth();
  const currentUsera = getAuth().currentUser;
  // const [photo, setPhoto] = useState(null);
  // // const [loading, setLoading] = useState(false);
  // const [photoURL, setPhotoURL] = useState("");
  // const [userName, setUserName] = useState("User")
  // const navigate = useNavigate();
  // const db = getDatabase();





  /*........................... */
  // function handleChange(e) {
  //   if (e.target.files[0]) {
  //     setPhoto(e.target.files[0])
  //   }
  //   console.log(e.target);
  // }

  // function handleClick() {
  //   upload(photo, currentUsera, setLoading, setPhotoURL);

  // }


  // console.log(currentUsera);





  // useEffect(() => {

  //   if (currentUsera) {
  //     const userId = currentUsera.uid;

  //     onValue(ref(db, '/users/' + userId), (snapshot) => {

  //       if (snapshot.val().profile_picture != "") {
  //         setPhotoURL(snapshot.val().profile_picture);
  //         setUserName(snapshot.val().username);
  //       }
  //       // ...
  //     }, {
  //       onlyOnce: true
  //     });
  //   } else {
  //     navigate("/home");
  //   }


  // }, [currentUsera])



  return (


    <div className="pfcontainer">
      {currentUsera &&
        <>
          <div className=" SidebarPf">
            <Sidebar />
          </div>
          {/* 
          <div className="fields">

            <div className="user__info">
              <img src={photoURL} alt="Avatar" className="avatar" />
              <p>{userName}</p>
            </div>
            <div className="edit_info">
              <input type="file" onChange={handleChange} />
              <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
            </div>

          </div> */}
          <div className="outletpf">
            <Outlet />
          </div>

        </>
      }

    </div>

  );
}