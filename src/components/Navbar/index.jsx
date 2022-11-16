import { useState, useEffect } from "react";

import { Routes, Route, Link, Navigate } from "react-router-dom";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


import Home from "../Home";
import About from "../About";
import Gallery from "../Gallery";
import Signup from "../Signup";
import Login from "../Login";


const Navbar = () => {

    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(true);
    const [fullName, setFullName] = useState("");



    useEffect(() => {

        const auth = getAuth();
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {

                (isLogin) ?
                    setIsLogin(true) : setIsLogin(!isLogin)
                const uid = user.uid;
                console.log("auth change: login", user);

                console.log("auth.currentUser: ", auth.currentUser.displayName);
                setFullName(auth.currentUser.displayName)


            } else {
                console.log("auth change: logout");
                setIsLogin(false)

            }
        });

        return () => {
            console.log("Cleanup function called")
            unSubscribe();
        }

    }, [])

    const logoutFunction = () => {

        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("signout successful");
                setIsLogin(false)
                setIsSignup(true)
            })
            .catch((error) => {
                console.log("signout failed");
            });
    };




    return (
        <div className="page">
            <div className="header">
                <h1>Posting App</h1>
                {
                    (isLogin) ?
                        <nav>
                            <ul>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/about`}>About</Link></li>
                                <li><Link to={`/gallery`}>Gallery</Link></li>
                                <li
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                    }}>
                                    <Link to={`/`}
                                        onClick={logoutFunction}
                                    >Logout</Link></li>
                            </ul>
                        </nav>
                        :
                        <nav>
                            <ul>
                                {(isSignup) ?
                                    <li
                                        onClick={() => {
                                            setIsSignup(!isSignup)
                                        }}>
                                        <Link to={`/signup`}>Signup</Link></li>
                                    :
                                    <li
                                        onClick={() => {
                                            setIsSignup(!isSignup)
                                        }}>
                                        <Link to={`/`}>Already have an account</Link></li>
                                }
                            </ul>

                        </nav>
                }
            </div>

            {
                (isLogin) ?

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />
                    </Routes>

                    :


                    <Routes>
                        {/* { (isSignup) ? */}

                        <Route path="/" element={<Login
                            setState={setIsLogin}
                            state={isLogin}
                        />}
                        />

                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />
                        {/* </Routes> */}

                        {/* : */}

                        {/* <Routes> */}

                        <Route path="/signup" element={<Signup
                            setState={setIsSignup}
                            state={isSignup}
                        />}
                        />

                        {/* } */}
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />
                    </Routes>



            }

        </div>
    );

};

export default Navbar;