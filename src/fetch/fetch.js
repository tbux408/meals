export const login = async (passcode) => {
  const response = await fetch(
    process.env.REACT_APP_PUBLIC_API_URL + "/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: passcode,
      },
      body: JSON.stringify({ passcode: passcode }),
    }
  );
  // const data = await response.json();
  return response;
};

export const get_meals = async (path, setLoggedIn) => {
  const response = await fetch(process.env.REACT_APP_PUBLIC_API_URL + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access_token_meals"),
    },
    // credentials: "include",
    // body: JSON.stringify(body),
  });
  if (response.status === 401) {
    setLoggedIn(false);
    localStorage.removeItem("access_token_meals");
    return null;
  }
  const data = await response.json();
  console.log(data);
  return data;
};


export const fetch_meals = async (type, path, body, setLoggedIn) => {
  const response = await fetch(process.env.REACT_APP_PUBLIC_API_URL + path, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access_token_meals"),
    },
    body: JSON.stringify(body),
  });
  if (response.status === 401) {
    setLoggedIn(false);
    localStorage.removeItem("access_token_meals");
    return null;
  }
  const data = await response.json();
  console.log(data);
  return data;
};

// export const fetch_meals = async (type, path, body) => {
//   const response = await fetch(process.env.REACT_APP_PUBLIC_API_URL + path, {
//     method: type,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: localStorage.removeItem("access_token_meals"),
//     },
//     // credentials: "include",
//     // body: JSON.stringify(body),
//   });
//   const data = await response.json();
//   return data;
// };
