import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const AddUser = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  const { firstName, lastName, username, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await axios.post(
          'http://localhost:8080/admin/user',
          {
            firstName,
            lastName,
            username,
            email,
            role: 'USER',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        navigate('/users');
      } catch (error) {
        console.log('Error adding user: ', error);
      }
    } else {
      console.error('Token is missing.');
      navigate('/users');
    }
  };

  return (
    <div className="container flex items-center justify-center mt-5">
      <div className="bg-white p-6 rounded-lg shadow-2xl shadow-gray-700 w-full max-w-md">
        <div className="bg-gray-50 p-2 rounded-full shadow-lg mb-4">
          <h2 className="text-2xl font-mono font-bold text-center mt-2">
            ~ Add User ~
          </h2>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-2 text-start ">
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              name="firstName"
              value={firstName}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="mb-2 text-start ">
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              name="lastName"
              value={lastName}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="mb-2 text-start">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <input
              type="email"
              className="form-control"
              placeholder="E-mail"
              name="email"
              value={email}
              onChange={onInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary">
            Submit
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
};
