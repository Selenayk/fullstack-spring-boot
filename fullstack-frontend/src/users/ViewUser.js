import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

export const ViewUser = () => {
  const { id } = useParams();

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
  });

  const fetchUser = async (userId) => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(result.data);
    } catch (error) {
      console.log('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 border-rounded p-4 mt-5 shadow">
            <Link to={'/'} className="link fs-4">
              <i className="bi bi-arrow-left-square-fill m-2 float-start"></i>
            </Link>
            <h2 className="text-center m-4">User Details</h2>
            <div className="card">
              <div className="card-header">
                <ul className="list-group list-group-flush mt-4 text-start">
                  <li className="list-group-item">
                    <b>Id: </b>
                    {user.id}
                  </li>
                </ul>
                <ul className="list-group list-group-flush mt-4 text-start">
                  <li className="list-group-item">
                    <b>Name: </b>
                    {user.name}
                  </li>
                  <li className="list-group-item">
                    <b>Username: </b>
                    {user.username}
                  </li>
                  <li className="list-group-item">
                    <b>Email: </b>
                    {user.email}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
