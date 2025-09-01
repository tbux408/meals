import "./App.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { login, get_meals } from "./fetch/fetch";
import Meals from "./components/Meals";
import { Skeleton } from "@mui/material";

function App() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateVersion, setUpdateVersion] = useState(0);

  useEffect(() => {
    const start = async () => {
      const access_token = localStorage.getItem("access_token_meals");
      if (!access_token) {
        setLoggedIn(false);
      }
      const temp_meals = await get_meals(`/meals?update=latest`, setLoggedIn);
      setIsLoading(false);
      setUpdateVersion(temp_meals.date);
      setMeals(temp_meals.mealGroups);
    };
    start();
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
        const temp_meals = await get_meals("/meals?update=latest", setLoggedIn);
        setLoggedIn(true);
        setIsLoading(false);
        setUpdateVersion(temp_meals.date);
        setMeals(temp_meals.mealGroups);
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
        <div>
          <Meals
            meals={meals}
            setMeals={setMeals}
            setLoggedIn={setLoggedIn}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            updateVersion={updateVersion}
            setUpdateVersion={setUpdateVersion}
          />
        </div>
      )}
    </div>
  );
}

export default App;
