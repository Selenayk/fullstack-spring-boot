import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
  });

  const fetchUser = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(data);
    } catch (error) {
      console.log('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/user/${id}`, user);
      navigate('/');
    } catch (error) {
      console.log('Failed to update user data.');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit User</h2>
          <form onSubmit={onUpdateUser}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="form-label"
                style={{ fontWeight: 'bold' }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={user.name}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
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
                placeholder="Enter your username"
                value={user.username}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
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
                placeholder="Enter your e-mail address"
                value={user.email}
                onChange={onInputChange}
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
