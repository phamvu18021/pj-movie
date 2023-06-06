
import React, { useEffect, useState } from 'react'
import nft from '../../components/modala/nft.jpg'
import { getAuth } from "firebase/auth";
import { ref, getDatabase, get, onValue, set, child, update, push } from "firebase/database";
import { writeCmtreptoMoviesData } from '../../firebase/firebase';
import moment from 'moment-timezone';
const CmtRep = (props) => {
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    const [userName, setUserName] = useState("User");
    const currentUsera = getAuth().currentUser;
    const [myphotoURL, setMyphotoURL] = useState("");
    const [myName, setMyName] = useState("User");
    const item = props.itemr;
    const [cmtrep, setCmtrep] = useState("")
    const [reply, setReply] = useState(false);
    const db = getDatabase();
    const [likerepstatus, setLikerepstatus] = useState(false);
    const [likerepcount, setLikerepcount] = useState("1")

    const [dislikerepstatus, setDislikerepstatus] = useState(false);
    const [dislikerepcount, setDislikerepcount] = useState("1")
    function handleClickRep() {
        setReply(!reply);
        console.log("reply :" + reply)
    }
    useEffect(() => {
       
            onValue(ref(db, '/users/' + item.cmtrepby), (snapshot) => {

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
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), (snapshot) => {
                setLikerepcount(snapshot.val().likerepcount)
            });
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/like"), (snapshot) => {
                setLikerepstatus(false);
                if (snapshot.exists()) {
                    let a = Object.keys(snapshot.val());
                    let b = Object.values(snapshot.val());
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] == currentUsera.uid && b[i] == true) {
                            setLikerepstatus(true);
                        }
                    }

                }
            }, {
                onlyOnce: true
            });
        }
    }, [likerepstatus])
    useEffect(() => {
        if (currentUsera) {
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), (snapshot) => {
                setDislikerepcount(snapshot.val().dislikerepcount)
            });
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/dislike"), (snapshot) => {
                setDislikerepstatus(false);
                if (snapshot.exists()) {
                    let a = Object.keys(snapshot.val());
                    let b = Object.values(snapshot.val());
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] == currentUsera.uid && b[i] == true) {
                            setDislikerepstatus(true);
                        }
                    }

                }
            }, {
                onlyOnce: true
            });
        }
    }, [dislikerepstatus])
    function handlereplike() {
        if (currentUsera) {
            setLikerepstatus(true);
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), (snapshot) => {

                console.log(likerepstatus)
                onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/like"), (snapshotchild) => {
                    let like = {};
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
                            update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), {
                                likerepcount: Number(snapshot.val().likerepcount) + 1,

                            });
                        }
                        like[currentUsera.uid] = true;
                        console.log(like);
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/"),
                            { like });
                    }
                    else {
                        like[currentUsera.uid] = true;
                        console.log("trong0")
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), {
                            likerepcount: Number(snapshot.val().likerepcount) + 1,

                        });
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/"),
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

    function handlerepdislike() {
        if (currentUsera) {
            setDislikerepstatus(true);
            console.log(dislikerepstatus);
            onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), (snapshot) => {


                onValue(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/dislike"), (snapshotchild) => {
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
                            update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), {
                                dislikerepcount: Number(snapshot.val().dislikerepcount) + 1,

                            });
                        }
                        dislike[currentUsera.uid] = true;
                        console.log(dislike);
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/"),
                            { dislike });
                    }
                    else {
                        dislike[currentUsera.uid] = true;
                        console.log("trong0")
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}`), {
                            dislikerepcount: Number(snapshot.val().dislikerepcount) + 1,

                        });
                        update(ref(db, 'moviescmt/' + `${props.category}+${props.id}` + '/' + 'cmt/' + `${props.cmtmainkey}` + '/' + 'cmtrep/' + `${item.key}` + "/"),
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
                writeCmtreptoMoviesData(currentUsera.uid, props.id, props.category, cmtrep, datea, 0, 0, props.cmtmainkey);

                setTimeout(setCmtrep(""), 3000);
            }
        }
    }
    return (
        <div>
            <div className='Comment_list_rep2'>
                <div className="avata2">
                    <img src={photoURL} />
                </div>
                <div className="comment_fields2">

                    <div className="nameandcontent">
                        <div className='user__name'>
                            <p>{userName}</p>
                        </div>

                        <div className='comment__content'>
                            <p>{item.cmtrepcontent}
                            </p>
                        </div>
                    </div>

                    <div className='button_commnet2'>
                        <div className={likerepstatus ? "likeon2" : "btnlike2"}>
                            <i onClick={handlereplike} class={likerepstatus ? "ri-thumb-up-fill" : "ri-thumb-up-line"}></i>
                            <p>{likerepcount}</p>
                        </div>

                        <div className={dislikerepstatus ? "dislikeon2" : "btnlike2"}>
                            <i onClick={handlerepdislike} class={dislikerepstatus ? "ri-thumb-down-fill" : "ri-thumb-down-line"}></i>
                            <p>{dislikerepcount}</p>
                        </div>
                        <div className="timeagoo">
                            <p>{moment(item.cmtrepat).fromNow()}</p>
                        </div>
                        <div className="btnlike2">
                            <button onClick={handleClickRep}>Reply</button>


                        </div>
                    </div>

                </div>

            </div>
            {
                reply &&
                <>
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

                                        <button onClick={handleSendrep}>Send</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                </>
            }
        </div>

    )
}
export default CmtRep