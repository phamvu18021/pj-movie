
import { useEffect, useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, update, push, increment, onValue } from 'firebase/database'
import { getDownloadURL, ref as Sref, getStorage, uploadBytes } from "firebase/storage";
import { paste } from "@testing-library/user-event/dist/paste";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0qJVj-GRJQA8dUPhCa15fXNNo1K3CY7A",
  authDomain: "movie-fbase.firebaseapp.com",
  databaseURL: "https://movie-fbase-default-rtdb.firebaseio.com",
  projectId: "movie-fbase",
  storageBucket: "movie-fbase.appspot.com",
  messagingSenderId: "132642473246",
  appId: "1:132642473246:web:252d9bbd8d71555c28f50f",
  measurementId: "G-5RF7EVJ0D8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const database = getDatabase();


export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const uid = user.uid;
      }
    });
    return unsub;
  }, [])

  return currentUser;
}



export async function upload(file, currentUser, setLoading, setPhotoURL) {
  const fileRef = Sref(storage, `image/${currentUser.uid + '.png'}`);
  console.log(currentUser.uid);
  console.log("file Ref: " + fileRef);
  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);

  const photoURL = await getDownloadURL(fileRef);
  setPhotoURL(photoURL)
  console.log(getDownloadURL(fileRef));
  update(ref(database, 'users/' + currentUser.uid), {
    profile_picture: photoURL
  })
  // updateProfile(currentUser, {photoURL});

  setLoading(false);
  alert("Uploaded file!");
}




export function writeMoviesCmtData(movieId, category, cmtcount) {
  const db = getDatabase();
  set(ref(db, 'moviescmt/' + `${category}+${movieId}`), {
    category: category,
    movieId: movieId,
    cmtcount: cmtcount,
  });

}

export function writeCmttoMoviesData(UserId, movieId, category, cmtcontent, cmtat, likecount, dislikecount) {

  const db = getDatabase();

  push(ref(db, 'moviescmt/' + `${category}+${movieId}` + '/' + 'cmt'), {
    cmtby: UserId,
    cmtcontent: cmtcontent,
    cmtat: cmtat,
    likecount: likecount,
    dislikecount: dislikecount,
  });

  onValue(ref(db, '/moviescmt/' + `${category}+${movieId}`), (snapshot) => {

    let a = snapshot.val().cmtcount;
    update(ref(db, 'moviescmt/' + `${category}+${movieId}`), {

      cmtcount: a + 1,
    });

  }, {
    onlyOnce: true
  });
}


   export function historyplayData(userId,movieId,category,playat,imglink,name){
    const db=getDatabase();
    set(ref(db,'users/' + `${userId}` +'/history/'+`${userId}+${category}+${movieId}`),{
      id:movieId,
      category:category,
      playat:playat,
      imglink:imglink,
      name:name,
    });
   }

   export function saveData(userId,movieId,category,playat,imglink,name){
    const db=getDatabase();
    set(ref(db,'users/' + `${userId}` +'/save/'+`${userId}+${category}+${movieId}`),{
      id:movieId,
      category:category,
      playat:playat,
      imglink:imglink,
      name:name,
    });
   }
  
export function writeCmtreptoMoviesData(UserId, movieId, category, cmtcontent, cmtat, likecount, dislikecount,cmtmainkey) {

  const db = getDatabase();

  push(ref(db, 'moviescmt/' + `${category}+${movieId}` + '/' + 'cmt/'+`${cmtmainkey}`+'/cmtrep'), {
    cmtrepby: UserId,
    cmtrepcontent: cmtcontent,
    cmtrepat: cmtat,
    likerepcount: likecount,
    dislikerepcount: dislikecount,
  });

  onValue(ref(db, '/moviescmt/' + `${category}+${movieId}`), (snapshot) => {
    // console.log(snapshot.val().profile_picture);
    let a = snapshot.val().cmtcount;


    update(ref(db, 'moviescmt/' + `${category}+${movieId}`), {

      cmtcount: a + 1,
    });

  }, {
    onlyOnce: true
  });
}

// export function likeCmt(UserId, cmtKey, category, movieId, likestatus) {
//   const db = getDatabase();
//   push(set(ref(db, 'moviescmt/' + `${category}+${movieId}` + '/' + 'cmt/' + `${cmtKey}` + '/like/' + `${UserId}+${cmtKey}`), {
//     likeby: UserId,
//     likestatus: likestatus,
//   }))

//   onValue(ref(db, 'moviescmt/' + `${category}+${movieId}` + '/' + 'cmt/' + `${cmtKey}`), (snapshot) => {
//     // console.log(snapshot.val().profile_picture);
//     let a =Number( snapshot.val().likecount);
//     update(ref(db, 'moviescmt/' + `${category}+${movieId}` + '/' + 'cmt/' + `${cmtKey}`), {
//       likecount:Number(a + 1)
//     });


//   }, {
//     onlyOnce: true
//   });

// }


export function writeUserData(userId, name, email, password, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    password: password,
    profile_picture: imageUrl
  });
}