import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function LoginComponent() {
  //Credentials State
  const [username, setUsername] = useState("raman");
  const [password, setPassword] = useState();

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate = useNavigate();
  const authContext = useAuth();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    if (await authContext.login(username, password)) {
      navigate(`/welcome`);
    } else {
      setShowErrorMessage(true);
    }
  }

  return (
    <div className="Login">
      <div className="LoginForm">
        <h1>Login Form</h1>
        {showErrorMessage && (
          <div className="errorMessage p-1 mb-2 bg-danger text-white">
            Authentication Failed. Check your Credentials
          </div>
        )}
        <div>
          <label>User Name: </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <button type="submit" name="login" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
