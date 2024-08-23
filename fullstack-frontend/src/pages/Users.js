import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8080/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
          setUsers(res.data);
        } catch (error) {
          console.log('Error fetching users: ', error);
          setError('Error fetching users: ' + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Token is missing.');
      }
    };
    fetchUsersData();
  }, [navigate]);

  const deleteUser = async (id) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await axios.delete(`http://localhost:8080/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.log('Error deleting user: ', error);
        setError(
          'Error deleting user: ' + (error.res?.data?.message || error.message)
        );
      }
    } else {
      console.log('Token is missing');
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto mt-10 mb-10 px-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="max-w-6xl mx-auto overflow-x-auto shadow-2xl shadow-slate-700 rounded-3xl">
        <table className="min-w-full text-left text-lg w-full max-w-screen-md">
          <thead className="bg-gray-200">
            <tr className="text-xl font-semibold">
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <tr key={user.id} className="border-b">
                <th scope="row" className="px-6 py-4 font-bold">
                  {index + 1}
                </th>
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <Link
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    to={`/viewuser/${user.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="border border-blue-500 text-blue-500 py-2 px-4 rounded hover:bg-blue-50"
                    to={`/edituser/${user.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
