import axios from "axios";
import { useState} from "react";
import "./auth.css"
function Auth({setislogin,setisloginuser}) {
    const [isSignup, setIsSignup] = useState(true);

    // SIGNUP
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    
    // LOGIN
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;

    const SignUp = async () => {
        try {
            await axios.post(`${API_URL}AUTH/signup`, {
                username: signupUsername,
                password: signupPassword
            });
            
            setSignupUsername("");
            setSignupPassword("");
            alert("User Registered");
            
        } catch (err) {
            console.log(err);
        }

        

    };
    
    const login = async () => {
        try {
            const res = await axios.post(`${API_URL}AUTH/login`, {
                username: loginUsername,
                password: loginPassword,
            });
            setisloginuser(res.data._id);
            // console.log("data of response is ",res.data)
            // console.log("i am ",setisloginuser)
            setislogin (true);
            localStorage.setItem("islogin","true")
            localStorage.setItem("userid", res.data._id);
            //    console.log(  localStorage.setItem("islogin","true"))
                    console.log(localStorage.getItem("islogin"))
            console.log("Successful login", res.data);
            
            // console.log(setislogin)
            if(setislogin===true){
                console.log("hello")
            }
            setLoginUsername("");
            setLoginPassword("");

        } catch (err) {
            console.log("its error",err);
        }
    };

    return (

<div className="auth-page">

    <div className="loginorsignup light">
        <h1>Prody</h1>
        <h3>Have a goal? Stay locked in.</h3>
    </div>

    <div className="boxes">

        <div className="box">
            <h2>{isSignup ? "Signup" : "Login"}</h2>

            <input
                value={isSignup ? signupUsername : loginUsername}
                placeholder="Enter username"
                onChange={(e) =>
                    isSignup
                        ? setSignupUsername(e.target.value)
                        : setLoginUsername(e.target.value)
                }
            />

            <input
                value={isSignup ? signupPassword : loginPassword}
                placeholder="Enter password"
                type="password"
                onChange={(e) =>
                    isSignup
                        ? setSignupPassword(e.target.value)
                        : setLoginPassword(e.target.value)
                }
            />

            <button onClick={isSignup ? SignUp : login}>
                {isSignup ? "Signup" : "Login"}
            </button>

            <p onClick={() => setIsSignup(!isSignup)}>
                {isSignup
                    ? "Already Grinding? Login"
                    : "Wanna Slay? Signup"}
            </p>
        </div>

    </div>
</div>

    );
}

export default Auth;