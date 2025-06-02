import logo from "./434901950_443213378263818_1248838208233989345_n-removebg-preview.png";
import "./App.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { login, get_meals } from "./fetch/fetch";

function App() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token_meals");
    if (access_token) {
      setLoggedIn(true);
    }
    get_meals("/meals", access_token, setLoggedIn);
  }, []);

  const handleChange = async (e) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setPasscode(value);
      setError(false);
    }
    if (value.length === 6) {
      const response = await login(value);
      console.log(response);
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("access_token_meals", data);
        console.log(data);
      } else {
        console.log("Login failed");
        setError(true);
      }
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <div
          className="body"
          style={{ backgroundColor: error ? "rgb(186, 50, 50)" : "#282c34" }}
        >
          <div className="passcode-box">
            <input
              type="password"
              maxLength={6}
              className="passcode"
              value={passcode}
              onChange={handleChange}
              id="passcode"
              name="passcode"
            />
          </div>
          <div className="digit-box">
            {Array.from({ length: 6 }, (_, index) => (
              <p className="digit" key={index}>
                {index < passcode.length && (
                  <CircleIcon sx={{ width: "100%" }} />
                )}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div> logged </div>
      )}
    </div>
  );
}

export default App;
