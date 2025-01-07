import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Form from "../components/Form";
import Title from "../components/Title";
import Footer from "../components/Footer";

const Home = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setname] = useState(localStorage.getItem("name"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

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
