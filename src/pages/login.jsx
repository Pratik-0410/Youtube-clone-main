import React, { useState } from "react";
import { auth, db } from "../firebaseconfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
      navigate("/"); // 🔥 redirect to home
    } catch (err) {
      alert(err.message);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.user.uid), {
        email: email,
        createdAt: new Date(),
        history: [],
        subscriptions: [],
      });

      alert("Signup successful ✅");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9f9f9",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* LOGO */}
        <h2 style={{ color: "red", marginBottom: "20px" }}>YouTube</h2>

        <h3 style={{ marginBottom: "20px" }}>Login</h3>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#ff0000",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Login
        </button>

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: "10px",
            background: "#fff",
            color: "#ff0000",
            border: "1px solid #ff0000",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;