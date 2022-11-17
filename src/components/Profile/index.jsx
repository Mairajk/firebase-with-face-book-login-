
import { useEffect, useState } from "react";

import moment from "moment";
import axios from "axios"

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



const Profile = () => {

    const auth = getAuth();

    const db = getFirestore();
    const [posts, setPosts] = useState([]);
    const [editingData, setEditingData] = useState({
        editingId: null,
        editingText: ""
    });


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
                where("user", "==", auth.currentUser.email)
            );

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
    )

}


export default Profile;