import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [users, setUsers] = useState([]);

  // const { id } = useParams();
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get('http://localhost:8080/users');
    setUsers(result.data);
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:8080/user/${id}`);
      loadUsers();
    } catch (error) {
      console.log(error);
      alert('Failed to delete the user.');
    }
  };

  return (
    <div className="container">
      <div className="mt-5">
        <table className="table border shadow-lg">
          <thead>
            <tr style={{ fontSize: '1.3rem' }}>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <th scope="row" style={{ fontSize: '1.1rem' }}>
                  {index + 1}
                </th>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className="btn btn-primary mx-2"
                    to={`/viewuser/${user.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/edituser/${user.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
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
