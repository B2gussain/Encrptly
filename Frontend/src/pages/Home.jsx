import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Form from "../components/Form";
import Title from "../components/Title";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else if (token === "") {
      navigate("/");
    }
  }, [token, navigate]); // Added navigate as a dependency

  return (
    <div className="app">
      <Navbar setToken={setToken} username={name} />
      <Title />
      {token ? (
        <>
          <Form token={token} />
        </>
      ) : (
        <div className="blank_div">Please sign in to manage your passwords.</div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
