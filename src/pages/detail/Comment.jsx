import React, { useEffect, useState } from 'react'
import nft from '../../components/modala/nft.jpg'
import { getAuth } from "firebase/auth";
import { ref, getDatabase, get, onValue, set, child, update, push } from "firebase/database";
import CmtRep from './CmtRep';
import { likeCmt } from '../../firebase/firebase';
import { number } from 'prop-types';
import { writeCmtreptoMoviesData } from '../../firebase/firebase';
import moment from 'moment-timezone';
const Comment = (props) => {
    const currentUsera = getAuth().currentUser;
    // console.log(props)
    const item = props.item;
    const db = getDatabase();
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    const [userName, setUserName] = useState("User");
    const [myphotoURL, setMyphotoURL] = useState("");
    const [myName, setMyName] = useState("User");
    const [reply, setReply] = useState(false);
    const [likestatus, setLikestatus] = useState(false);
    const [likecount, setLikecount] = useState("1")
    const [cmtrep, setCmtrep] = useState("")
    const [dislikestatus, setDislikestatus] = useState(false);
    const [dislikecount, setDislikecount] = useState("1")
    const [cmtcount, setCmtcount] = useState('1')
    const [listCmtrep, setListcmtrep] = useState([]);

    function handleClickRep() {
        setReply(!reply);
        console.log("reply :" + reply)

    }
    useEffect(() => {
        if (currentUsera) {


            onValue(ref(db, '/moviescmt/' + `${props.category}+${props.id}`), (snapshot) => {
                // console.log(snapshot.val().profile_picture);

                if (snapshot.exists()) {
                    if (cmtcount != snapshot.val().cmtcount) {
                        setCmtcount(snapshot.val().cmtcount)
                    }

                }
                // ...
            });

        }
    }, [cmtcount])

    useEffect(() => {

        onValue(ref(db, '/users/' + item.cmtby), (snapshot) => {

            if (snapshot.val().profile_picture != "") {
                setPhotoURL(snapshot.val().profile_picture);
                setUserName(snapshot.val().username);

            }
            // ...
        }, {
            onlyOnce: true
        });

        if (currentUsera) {
            onValue(ref(db, '/users/' + currentUsera.uid), (snapshot) => {

                if (snapshot.val().profile_picture != "") {
                    setMyphotoURL(snapshot.val().profile_picture);
                    setMyName(snapshot.val().username);

                }
                // ...
            }, {
                onlyOnce: true
            });
        }


    }, [])


    useEffect(() => {
        if (currentUsera) {
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), (snapshot) => {
                setLikecount(snapshot.val().likecount)
            });
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/like"), (snapshot) => {
                setLikestatus(false);
                if (snapshot.exists()) {
                    let a = Object.keys(snapshot.val());
                    let b = Object.values(snapshot.val());
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] == currentUsera.uid && b[i] == true) {
                            setLikestatus(true);
                        }
                    }

                }
            }, {
                onlyOnce: true
            });
        }
    }, [likestatus])

    useEffect(() => {
        if (currentUsera) {
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), (snapshot) => {
                setDislikecount(snapshot.val().dislikecount)
            });
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/dislike"), (snapshot) => {
                setDislikestatus(false);
                if (snapshot.exists()) {
                    let a = Object.keys(snapshot.val());
                    let b = Object.values(snapshot.val());
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] == currentUsera.uid && b[i] == true) {
                            setDislikestatus(true);
                        }
                    }

                }
            }, {
                onlyOnce: true
            });
        }
    }, [dislikestatus])


    useEffect(() => {



        onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + '/cmtrep'),
            (snapshot) => {
                // console.log(snapshot.val().profile_picture);
                let listCmtrepa = [

                ];
                if (snapshot.exists()) {

                    snapshot.forEach(childSnapshot => {
                        let obex = {};
                        obex = {
                            key: childSnapshot.key,
                            cmtrepby: childSnapshot.val().cmtrepby,
                            cmtrepat: childSnapshot.val().cmtrepat,
                            cmtrepcontent: childSnapshot.val().cmtrepcontent,
                        }

                        listCmtrepa.push(obex);


                    })


                    console.log(listCmtrepa)
                    setListcmtrep(listCmtrepa)
                } else {
                    console.log("No data available");
                }

                // ...
            }, {
            onlyOnce: true
        });

    }, [cmtcount])
    // console.log(listCmtrepa);
    function handlelike() {
        if (currentUsera) {
            setLikestatus(true);
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), (snapshot) => {


                onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/like"), (snapshotchild) => {
                    var like = {};
                    if (snapshotchild.exists()) {

                        let a = Object.keys(snapshotchild.val());
                        let b = Object.values(snapshotchild.val())
                        console.log(a);
                        for (let i = 0; i < a.length; i++) {
                            like[a[i]] = b[i];
                        }


                        if (a.includes(currentUsera.uid)) {
                            console.log("daco")
                        } else {
                            console.log("chuaco")
                            update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), {
                                likecount: Number(snapshot.val().likecount) + 1,

                            });
                        }
                        like[currentUsera.uid] = true;
                        console.log(like);
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/"),
                            { like });
                    }
                    else {
                        like[currentUsera.uid] = true;
                        console.log("trong0")
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), {
                            likecount: Number(snapshot.val().likecount) + 1,

                        });
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/"),
                            { like });
                    }
                }, {
                    onlyOnce: true
                });

            }
                , {
                    onlyOnce: true
                });
        }
    }

    function handledislike() {
        if (currentUsera) {

            setDislikestatus(true);

            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), (snapshot) => {


                onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/dislike"), (snapshotchild) => {
                    var dislike = {};
                    if (snapshotchild.exists()) {

                        let a = Object.keys(snapshotchild.val());
                        let b = Object.values(snapshotchild.val())
                        console.log(a);
                        for (let i = 0; i < a.length; i++) {
                            dislike[a[i]] = b[i];
                        }


                        if (a.includes(currentUsera.uid)) {
                            console.log("daco")
                        } else {
                            console.log("chuaco")
                            update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), {
                                dislikecount: Number(snapshot.val().dislikecount) + 1,

                            });
                        }
                        dislike[currentUsera.uid] = true;
                        console.log(dislike);
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/"),
                            { dislike });
                    }
                    else {
                        dislike[currentUsera.uid] = true;
                        console.log("trong0")
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}`), {
                            dislikecount: Number(snapshot.val().dislikecount) + 1,

                        });
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${item.key}` + "/"),
                            { dislike });
                    }
                }, {
                    onlyOnce: true
                });

            }
                , {
                    onlyOnce: true
                });
        }

    }

    function handleSendrep() {
        if (currentUsera) {
            if (cmtrep.trim().length > 0) {
                const date = new Date().toLocaleString() + '';
                let datea = date + "";
                writeCmtreptoMoviesData(currentUsera.uid, props.id, props.category, cmtrep, datea, 0, 0, item.key);

                setTimeout(setCmtrep(""), 3000);
            }
        }
    }



    return (
        <div className='Comment_list'>
            <div className="avata">
                <img src={photoURL} />
            </div>
            <div className="comment_fields">
                <div className="nameandcontent">
                    <div className='user__name'>
                        <p>{userName}</p>
                    </div>

                    <div className='comment__content'>
                        <p>{item.cmtcontent}
                        </p>
                    </div>
                </div>

                <div className='button_commnet'>
                    <div className={likestatus ? "likeon" : "btnlike"}>
                        <i onClick={handlelike} class={likestatus ? "ri-thumb-up-fill" : "ri-thumb-up-line"}></i>
                        <p>{likecount}</p>
                    </div>

                    <div className={dislikestatus ? "dislikeon" : "btnlike"}>
                        <i onClick={handledislike} class={dislikestatus ? "ri-thumb-down-fill" : "ri-thumb-down-line"}></i>
                        <p>{dislikecount}</p>
                    </div>
                    <div className="timeagoo">
                        <p>{moment(item.cmtat).fromNow()}</p>
                    </div>
                    <div className="btnlike">
                        <button onClick={handleClickRep}>Reply</button>
                    </div>
                </div>
                {
                    reply &&
                    <>
                        <div>
                            <div className="comment_fieldss">
                                <div className="avata">
                                    <img src={myphotoURL} />
                                </div>
                                <div className="comment_ri">
                                    <div className="fields_texta">
                                        <input
                                            type="text"
                                            placeholder='Viet binh luan...'
                                            value={cmtrep}

                                            onChange={(e) => setCmtrep(e.target.value)}

                                        />
                                    </div>
                                    <div className="btn_cmt">
                                        <button onClick={handleClickRep}>Huy</button>

                                        <button onClick={handleSendrep}>Dawng</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                }
                <div>
                    {
                        listCmtrep.map((itemr, i) => (
                            <div key={i}>
                                <CmtRep itemr={itemr} category={props.category} id={props.id} cmtmainkey={item.key} />
                            </div>
                        ))
                    }

                </div>

            </div>


        </div>
    )
}

export default Comment;

