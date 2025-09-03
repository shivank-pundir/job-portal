import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login"); // "Login" | "Signup"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const {setShowRecrutierLogin} = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Signup" && !isTextDataSubmitted) {
    
      setIsTextDataSubmitted(true);
    } else {
      const formData = { name, email, password, image };
      console.log("Form submitted:", formData);

 

      alert(`${state} successful!`);
    }
  }
    useEffect(() => {
      document.body.style.overflow = 'hidden'

      return () => {
              document.body.style.overflow = 'unset'

      }
    },
     [])
  

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-700 w-96"
      >
        <h2 className="text-2xl text-center font-medium text-neutral-700">
          Recruiter {state}
        </h2>
        <p className="text-sm text-center">
          Welcome back! Please {state === "Login" ? "sign in" : "sign up"} to
          continue
        </p>

        {/* Signup step 2 (image upload etc.) */}
        {state === "Signup" && isTextDataSubmitted ? 
          <>
            <div className="flex items-center gap-4 mt-5">
              <label htmlFor="image">
                <img className="w-16 rounded-full" src={ image? URL.createObjectURL(image) : assets.upload_area} alt="" />
                <input onChange={e =>setImage(e.target.files[0])} type="file" id="image" hidden />
          
              </label>
              <p>Upload Company <br /> logo</p>
            </div>
          </>
         : (
          <>
            {/* Company name (only for signup before step 2) */}
            {state === "Signup" && (
              <div className="border border-gray-200 px-4 py-2 gap-2 flex items-center rounded-xl mt-6 ">
                <img src={assets.person_icon} alt="" />
                <input

                  className="outline-none text-sm w-full"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company name"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="border border-gray-200 px-4 mt-6 py-2 gap-2 flex items-center rounded-xl">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm w-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="border border-gray-200 mt-6 px-4 py-2 gap-2 flex items-center rounded-xl">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-blue-400 text-sm mt-4 cursor-pointer">
            Forgot Password?
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-full py-2 px-4 mt-5 cursor-pointer"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create account"
            : "Next"}
        </button>

        {/* Toggle */}
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don&apos;t have an account?{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => {
                setState("Signup");
                setIsTextDataSubmitted(false);
              }}
            >
              Signup
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
              <img onClick={e => setShowRecrutierLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />

      </form>
    </div>
  );
};

export default RecruiterLogin;
