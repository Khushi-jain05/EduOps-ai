import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/auth.service";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role:'student'
});

const [loginData, setLoginData] = useState({
  email: "",
  password: "",
});
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
  const handleRegister = async () => {
  try {


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(signupData.email)) {
      alert("Please enter a valid email");
      return;
    }

  
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await registerUser({
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
    });

    console.log(response);

    alert("Registration Successful");
    navigate("/home");

  } catch (error) {
    console.error(error);
    alert(error.message || "Registration Failed");
  }
};
const handleLogin = async () => {
  try {
    const response = await loginUser({
      email: loginData.email,
      password: loginData.password,
    });

    console.log(response);

    alert("Login Successful");

    navigate("/home");
  } catch (error) {
    console.error(error);
    alert("Login Failed");
  }
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
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        username: e.target.value,
                      })
                    }
                />
              </div>

              <div className="input-group">
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                    }
                />
              </div>
              <div className="input-group">
                <select
                  value={signupData.role}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                    }
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <button onClick={handleRegister}>Sign Up</button>

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
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                />
              </div>

              <button onClick={handleLogin}>Sign In</button>

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