
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";



import Navbar from "../Navbar"


const Main = () => {


    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div>
            <Navbar
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                isSignup={isSignup}
                setIsSignup={setIsSignup}

            />
        </div>
    )
};

export default Main;