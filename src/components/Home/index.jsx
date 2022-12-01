
import "./style.css"

import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios"

import { FcAddImage } from "react-icons/fc";

import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    query,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    orderBy,
    where
} from "firebase/firestore";
import { getAuth } from "firebase/auth";



const Home = () => {

    const auth = getAuth();

    const db = getFirestore();

    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");
    const [isPosting, setPosting] = useState(false);

    const [editingData, setEditingData] = useState({
        editingId: null,
        editingText: ""
    });

    const [postPic, setPostPic] = useState(null);


    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));

            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => `, doc.data());

                setPosts((prev) => {

                    let newArray = [...prev, doc.data()];

                    return newArray;
                })

            });
        };
        getData();

        let unsubscribe = null;

        let getRealtimeData = async () => {

            const q = query(
                collection(db, "posts"),
                orderBy("createdOn", "desc"));

            unsubscribe = onSnapshot(q, (querySnapshot) => {

                const posts = [];

                querySnapshot.forEach((doc) => {

                    // posts.push(doc.data());

                    posts.push({ id: doc.id, ...doc.data() });

                });

                setPosts(posts);
                console.log("posts : ", posts);
            });
        }

        getRealtimeData();

        return () => {
            console.log("CleanUp");
            unsubscribe();
        }

    }, [])


    const savePost = async (e) => {
        e.preventDefault();


        if (!postPic) {

            try {
                const docRef = await addDoc(collection(db, "posts"), {
                    text: postText,
                    user: auth.currentUser.email,
                    createdOn: serverTimestamp(),

                });
                setPosting(!isPosting)

                console.log("Document written with ID: ", docRef.id);
            }
            catch (e) {
                console.error("Error adding document: ", e);
            }
            return;


        }



        const cloudinaryData = new FormData();
        cloudinaryData.append("file", postPic);
        cloudinaryData.append("upload_preset", "profilePicDemo");
        cloudinaryData.append("cloud_name", "dzy6qrpp5");
        console.log(cloudinaryData);
        axios.post(`https://api.cloudinary.com/v1_1/dzy6qrpp5/image/upload`,
            cloudinaryData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            .then(async res => {


                console.log("postText : ", postText);


                try {
                    const docRef = await addDoc(collection(db, "posts"), {
                        text: postText,
                        createdOn: serverTimestamp(),
                        image: res?.data?.url

                    });

                    console.log("Document written with ID: ", docRef.id);
                }



                catch (e) {
                    console.error("Error adding document: ", e);
                }
                setPosting(!isPosting)
                setPostPic(null)
            })

            .catch(err => {
                console.log(err);
            })

    }

    const deletePost = async (postId) => {
        console.log("postId :", postId);

        await deleteDoc(doc(db, "posts", postId));
    }

    const updatePost = async (e) => {

        e.preventDefault();

        await updateDoc(doc
            (db, "posts", editingData.editingId),
            {
                text: editingData.editingText
            });

        setEditingData({
            editingId: null,
            editingText: ""
        });
    }

    return (
        <div className="main" >

            <div className="postingDiv"
            // style={isPosting ?
            //     { backgroundColor: "gainsboro" } :
            //     { backgroundColor: "whitesmoke" }}
            >

                {(isPosting) ?
                    <form action="" className="postingForm" onSubmit={savePost}>

                        <div className="inputArea">

                            <label htmlFor="postPic" className="imgLabel">
                                <input id="postPic" type="file"
                                    className="postPic"
                                    onChange={(e) => {
                                        setPostPic(e.currentTarget.files[0])
                                    }}
                                /> <FcAddImage className="imgIcon" />
                            </label>
                            <textarea
                                className="postInput"
                                autoFocus
                                type="text"
                                required
                                max={100}
                                onChange={(e) => {
                                    setPostText(e.target.value)
                                }}
                            />

                        </div>

                        <div className="btnDiv">

                            <button className="shareBtn" onClick={() => {
                                setPosting(!isPosting)
                            }}>Cancel</button>
                            <button type="submit" className="shareBtn">Share</button>

                        </div>

                    </form>
                    :
                    null
                }

                {(isPosting) ? null : <button className="postingBtn"
                    onClick={() => {
                        setPosting(!isPosting)
                    }}>
                    Post
                </button>
                }
            </div>


            <div className="postDiv">

                {posts.map((eachPost, i) => (

                    <div className="postCard" key={i} >

                        <div className="postHead">

                            <p className="time">{moment((eachPost?.createdOn?.seconds) ?
                                eachPost?.createdOn?.seconds * 1000 : undefined
                            ).format('Do MMMM, h:mm a')}</p>

                            {(eachPost.id === editingData.editingId) ?
                                <form className="postUpdateForm" onSubmit={updatePost}>

                                    <textarea className="postUpdateInput" type="text"
                                        autoFocus
                                        value={editingData.editingText}
                                        placeholder="Enter updates"
                                        onChange={(e) => {
                                            setEditingData({
                                                ...editingData,
                                                editingText: e.target.value
                                            })
                                        }} />

                                    <button type="submit" className="postUpdateBtn">Update</button>

                                </form>
                                :
                                <h3 className="postTitle">  {eachPost.text} </h3>

                            }
                        </div>

                        <img src={eachPost.image} alt="" className="postImage" />

                        <div className="postFooter">
                            <button className="dltBtn" onClick={() => {
                                deletePost(eachPost?.id)
                            }}>
                                Delete
                            </button>

                            <button className="editBtn" onClick={() => {
                                setEditingData((editingData.editingId === eachPost?.id) ?

                                    {
                                        editingId: null,
                                        editingText: ""
                                    }
                                    :
                                    {
                                        editingId: eachPost?.id,
                                        editingText: eachPost?.text
                                    }
                                )
                            }}
                            > {(editingData.editingId === eachPost?.id) ? "Cancel" : "Edit"
                                } </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    )

}

export default Home;