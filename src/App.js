import "./App.css";
import { useState, useEffect } from "react";
import { UserContext } from "./contexts/user";
import { getAuth } from "firebase/auth";
import { Outlet } from "react-router-dom";

import NavBar from "./components/navbar";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      <div className="App flex flex-col">
        <NavBar />
        <div className="flex justify-center items-center flex-grow">
          <Outlet />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
