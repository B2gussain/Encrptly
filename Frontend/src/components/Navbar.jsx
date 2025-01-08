import React, { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const [username, setUsername] = useState(null); // Local state to hold username
  const navigate = useNavigate();

  // Fetch username from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

 
  const handleSignOut = () => {
    const isConfirmed = confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/"); // Redirect to the login page
    } else {
      // Do nothing if the user cancels
      console.log("Logout canceled");
    }
  };
  

  return (
    <div className="navbar w-[100%]">
      <div className="logo">
        ENCRPTLY <FaShieldAlt className="nav_icon" />
      </div>
      <div className="username_nav">
        {username ? `Hi,${username}` : "Hi,Guest"}
      </div>
      <button onClick={handleSignOut}>Log out</button>
    </div>
  );
};

export default Navbar;

