import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded mb-3" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded mb-3" />
        <button onClick={handleRegister} className="w-full bg-green-500 text-white p-3 rounded font-semibold hover:bg-green-600">Register</button>
      </div>
    </div>
  );
};

export default Register;
