import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/users');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });

      if (res.status === 200 && res.data.access_token) {
        const token = res.data.access_token;
        localStorage.setItem('accessToken', token);
        navigate('/users');
      } else {
        setError('Login failed: Access token not received');
      }
    } catch (error) {
      setError('Login failed: ' + (error.res?.data?.message || error.message));
    }
  };

  return (
    <div className="container flex items-center justify-center mt-5 ">
      <div className="bg-white p-6 rounded-lg shadow-2xl shadow-gray-700 w-full max-w-md">
        <div className=" bg-gray-50 p-2 rounded-full shadow-lg mb-4">
          <h2 className="text-2xl font-mono font-bold text-center mt-2">
            ~ Login ~
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>
          <div className="relative flex items-center mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-1 flex items-center px-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEye className="w-5 h-5 text-gray-700 mt-2" />
              ) : (
                <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500 mt-2" />
              )}
            </button>
          </div>
          {error && <div>{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
          <Link to="/register" className="text-blue-400">
            Do not have an account?
          </Link>
        </p>
      </div>
    </div>
  );
};
