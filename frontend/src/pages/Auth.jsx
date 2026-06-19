import { useEffect, useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSignIn(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div
      id="container"
      className={`container ${isSignIn ? "sign-in" : "sign-up"}`}
    >
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="off"
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              </div>

              <button>Sign Up</button>

              <p>
                <span>Already have an account? </span>
                <b onClick={toggle} className="pointer">
                  Sign in here
                </b>
              </p>
            </div>
          </div>
        </div>

        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>

              <button>Sign In</button>

              <p>
                <b>Forgot Password?</b>
              </p>

              <p>
                <span>Don't have an account? </span>
                <b onClick={toggle} className="pointer">
                  Sign up here
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="row content-row">
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
          </div>
        </div>

        <div className="col align-items-center flex-col">
          <div className="text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
      </div>
    </div>
  );
}