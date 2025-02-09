import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";
import Home from './pages/Home'
import {app, auth, db} from './firebaseconfig/config'




function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center">
        {user ? (
          <div>
            <h1 className="text-2xl">Welcome, {user.email}</h1>
            <button
              onClick={() => signOut(auth)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />




            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
