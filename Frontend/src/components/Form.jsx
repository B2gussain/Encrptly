import React, { useEffect, useRef, useState } from 'react';
import { TbLockPassword } from "react-icons/tb";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoCopy } from "react-icons/io5";

const Form = ({ token }) => {
  const open_eye = useRef(null);
  const close_eye = useRef(null);

  const [website_name, setWebsiteName] = useState("");
  const [website_username, setWebsiteUsername] = useState("");
  const [website_password, setWebsitePassword] = useState("");
  const [password_type, setPasswordType] = useState(true);
  const [passwords, setPasswords] = useState([]);
  const [editId, setEditId] = useState(null); 

  const password_type_change = () => {
    setPasswordType((prev) => !prev);
    if (open_eye.current && close_eye.current) {
      if (password_type) {
        open_eye.current.style.display = "none";
        close_eye.current.style.display = "block";
      } else {
        open_eye.current.style.display = "block";
        close_eye.current.style.display = "none";
      }
    }
  };

  const fetchPasswords = async () => {
    const response = await fetch('http://localhost:5000/api/password/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPasswords(data);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Error copying text: ', err);
    });
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this password?');
  
    if (!userConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/password/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
      }
  
      setPasswords((prev) => prev.filter((password) => password._id !== id));
      alert('Password deleted successfully!');
    } catch (error) {
      console.error('Error deleting password:', error);
      alert('Failed to delete password!');
    }
  };

  const handleEdit = (password) => {
    setEditId(password._id); // Set the edit ID
    setWebsiteName(password.website_name);
    setWebsiteUsername(password.website_username);
    setWebsitePassword(password.website_password);
  };

  const handle_data = async (e) => {
    e.preventDefault();

    if (editId) {
      // Edit existing password
      try {
        const response = await fetch(`http://localhost:5000/api/password/edit/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ website_name, website_username, website_password }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
        }

        const updatedPassword = await response.json();
        setPasswords((prev) =>
          prev.map((password) => (password._id === editId ? updatedPassword : password))
        );
        alert('Password updated successfully!');
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password!');
      }
    } else {
      // Add new password
      try {
        const response = await fetch('http://localhost:5000/api/password/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ website_name, website_username, website_password }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
        }

        const newPassword = await response.json();
        setPasswords((prev) => [...prev, newPassword]);
        alert('Password added successfully!');
      } catch (error) {
        console.error('Error adding password:', error);
        alert('Failed to add password!');
      }
    }

    // Clear form and reset edit state
    setEditId(null);
    setWebsiteName("");
    setWebsitePassword("");
    setWebsiteUsername("");
  };

  useEffect(() => {
    if (token) {
      fetchPasswords();
    }
  }, [token]);

  return (
    <>
      <form className="form" onSubmit={handle_data}>
        <input
          type="text"
          placeholder="Enter Website Name/Url"
          value={website_name}
          onChange={(e) => setWebsiteName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={website_username}
          onChange={(e) => setWebsiteUsername(e.target.value)}
          className="form-input"
        />
        <span className="form-input password_input_span">
          <input
            type={password_type ? "password" : "text"}
            placeholder="Enter Password"
            value={website_password}
            onChange={(e) => setWebsitePassword(e.target.value)}
            className="password_input"
          />
          <FaEye ref={open_eye} className="eye" onClick={password_type_change} style={{ display: password_type ? "block" : "none" }} />
          <FaEyeSlash ref={close_eye} className="eye" onClick={password_type_change} style={{ display: password_type ? "none" : "block" }} />
        </span>
        <button className="form-button" type="submit">
          <TbLockPassword className="password_icon" />
          {editId ? 'Update Password' : 'Add Password'}
        </button>
      </form>
      <div className="table_component">
        <table>
          <thead>
            <tr>
              <th>Site URL</th>
              <th>Username</th>
              <th>Password</th>
              <th className="action_heading">Action</th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((password) => (
              <tr key={password._id}>
                <td className="site">
                  {password.website_name}
                  <IoCopy className="copy_icon" onClick={() => handleCopy(password.website_name)} />
                </td>
                <td className="username">
                  {password.website_username}
                  <IoCopy className="copy_icon" onClick={() => handleCopy(password.website_username)} />
                </td>
                <td className="password">
                  {password.website_password}
                  <IoCopy className="copy_icon" onClick={() => handleCopy(password.website_password)} />
                </td>
                <td className="action">
                  <button onClick={() => handleEdit(password)}><MdEdit className="edit" /></button>
                  <button onClick={() => handleDelete(password._id)}><MdDelete className="delete" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Form;
