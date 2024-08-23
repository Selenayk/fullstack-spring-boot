import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchUser = async (id) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await axios.get(
            `http://localhost:8080/admin/user/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          setUser(res.data);
        } catch (error) {
          console.log('Error fetching user: ', error);
          setError('Error fetching user: ' + error.message);
        }
      } else {
        console.error('Token is missing');
        setError('Token is missing');
      }
    };

    fetchUser(id);
  }, [id]);

  const { firstName, lastName, username, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await axios.put(
          `http://localhost:8080/admin/user/${id}`,
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
        console.log('Failed to update user data.');
        setError(
          'Failed to update user: ' +
            (error.response?.data?.message || error.message)
        );
      }
    } else {
      console.error('Token is missing');
      setError('Token is missing');
    }
  };

  return (
    <div className="container">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-5 shadow-2xl shadow-gray-700">
          <h2 className="text-center m-4">Edit User</h2>
          <form onSubmit={onUpdateUser}>
            <div className="mb-3 text-start">
              <label
                htmlFor="firstName"
                className="form-label"
                style={{ fontWeight: 'bold' }}
              >
                First name
              </label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First name"
                value={user.firstName}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label
                htmlFor="lastName"
                className="form-label"
                style={{ fontWeight: 'bold' }}
              >
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last name"
                value={user.lastName}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label
                htmlFor="username"
                className="form-label"
                style={{ fontWeight: 'bold' }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Username"
                value={user.username}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label
                htmlFor="email"
                className="form-label"
                style={{ fontWeight: 'bold' }}
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="E-mail"
                value={user.email}
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
    </div>
  );
};
