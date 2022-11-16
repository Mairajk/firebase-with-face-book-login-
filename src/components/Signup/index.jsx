import { useFormik } from "formik"
import * as yup from 'yup';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";




const Signup = (props) => {
    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            age: "",
            gender: "",
        },

        validationSchema:

            yup.object({

                fullName: yup
                    .string('Enter your email')
                    .required('Email is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                email: yup
                    .string('Enter your email')
                    .required('Email is required')
                    .email("Enter a valid Email ")
                    .min(3, "please enter more then 3 characters ")
                    .max(25, "please enter within 20 characters "),

                password: yup
                    .string("Please enter your Password")
                    .required("Password is required")
                    .min(8, "Minimum 8 characters"),

                age: yup
                    .number("Please Enter Your age in number")
                    .required("Required")
                    .positive("Please Enter a valid age")
                    .integer("Please Enter a valid age"),

                gender: yup
                    .string("Please enter your Password")
                    .required("Please select your gender"),


            }),

        onSubmit: (values) => {
            console.log("values : ", values);
            console.log("Hello");
            // (() => {
            //     let newVar = !props.state
            //     props.setState(newVar);
            //     console.log("isSignup :", props.state);
            // })();

            const auth = getAuth();

            createUserWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("Signup user: ", user);

                    (() => {
                        // let newVar =true ;// !props.state
                        props.setState(true);
                        props.setLogState(false);
                        console.log("isSignup :", props.state);
                    })();

                    // sendEmailVerification(auth.currentUser)
                    //     .then(() => {
                    //         // Email verification sent!
                    //         // ...
                    //     });

                    // updateProfile(auth.currentUser, {
                    //     displayName: values.fullName
                    // }).then(() => {
                    //     // Profile updated!
                    //     // ...
                    // }).catch((error) => {
                    //     // An error occurred
                    //     // ...
                    // });




                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("firebase signup error: ", error);
                });

        }
    });

    return (

        <div className="formDiv">

            <h1> Signup </h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="inputDiv">
                    <label htmlFor="fullName">Full Name : </label>
                    <input
                        type="text"
                        id="fullName"
                        value={formik.values.fullName}
                        placeholder="Enter you name :"
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.fullName && Boolean(formik.errors.fullName)) ?
                        <p className="inputError">{formik.errors.fullName}</p> : <p className="inputError"></p>}
                </div>

                <div className="inputDiv">
                    <label htmlFor="email">Email : </label>
                    <input
                        type="email"
                        id="email"
                        value={formik.values.email}
                        placeholder="Enter your Email :"
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.email && Boolean(formik.errors.email)) ?
                        <p className="inputError">{formik.errors.email}</p> : <p className="inputError"></p>}
                </div>

                <div className="inputDiv">
                    <label htmlFor="password">Password : </label>
                    <input
                        type="password"
                        id="password"
                        value={formik.values.password}
                        placeholder="Enter your password :"
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.password && Boolean(formik.errors.password)) ?
                        <p className="inputError">{formik.errors.password}</p> : <p className="inputError"></p>}
                </div>


                <div className="inputDiv">
                    <label htmlFor="age"> Enter your age : </label>
                    <input
                        type="number"
                        id="age"
                        value={formik.values.age}
                        placeholder="Enter your age :"
                        min={1}
                        onChange={formik.handleChange}
                    />
                    {(formik.touched.age && Boolean(formik.errors.age)) ?
                        <p className="inputError">{formik.errors.age}</p> : <p className="inputError"></p>}
                </div>

                <div className="inputDiv genderInput">
                    <label htmlFor="gender"> Gender </label>
                    <select id="gender"
                        // value={formik.values.gender} 
                        onChange={(e) => { formik.values.gender = e.target.value }}
                    >
                        <option
                        // disabled selected
                        > Your Gender </option>
                        <option value="male" > Male </option>
                        <option value="female" > Female </option>
                        <option value="other" > Other </option>
                    </select>
                    {(formik.touched.gender && Boolean(formik.errors.gender)) ?
                        <p className="inputError">{formik.errors.gender}</p> : <p className="inputError"></p>}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );

}


export default Signup;