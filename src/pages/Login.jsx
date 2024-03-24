import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase"; // Ensure you have this configured
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const CombinedAuth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const photoURL = await uploadPhoto(photo, user.uid);
      await setDoc(doc(db, "admin", user.uid), {
        name: name,
        email: email,
        photoURL: photoURL,
        registeredAt: new Date(),
      });
      alert("User created successfully!");
      setIsRegistering(false);
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: name,
          email: email,
          photoURL: photoURL,
        })
      );
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        width: "auto",
        margin: "0 auto",
        maxWidth: "400px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
        marginBottom: "3rem",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
        {isRegistering ? "Register" : "Login"}
      </h2>
      {isRegistering && (
        <>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
            required
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <input
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            style={{
              marginBottom: "10px",
            }}
          />
        </>
      )}
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        required
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        required
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={isRegistering ? handleRegister : handleLogin}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        {isRegistering ? "Register" : "Login"}
      </button>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#6c757d",
          color: "white",
          cursor: "pointer",
        }}
      >
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
};

export default CombinedAuth;
