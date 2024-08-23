import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './layout/Navbar';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddUser } from './users/AddUser';
import { EditUser } from './users/EditUser';
import { ViewUser } from './users/ViewUser';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />

        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
