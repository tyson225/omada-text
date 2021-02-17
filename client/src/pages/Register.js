import React, { useState } from 'react';
import { registerUser } from '../actions/auth.actions';
import { connect } from 'react-redux';

const Register = ({ registerUser }) => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const { name, username, email, password } = userData;

  const onChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  return (
    <div>
      <div>
        <label>Name</label>
        <input
          type='text'
          name='name'
          value={name}
          onChange={(e) => onChange(e)}
        />
      </div>
      <br />
      <div>
        <label>Username</label>
        <input
          type='text'
          name='username'
          value={username}
          onChange={(e) => onChange(e)}
        />
      </div>
      <br />
      <div>
        <label>Email</label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={(e) => onChange(e)}
        />
      </div>
      <br />
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={(e) => onChange(e)}
        />
      </div>
      <br />

      <button onClick={() => registerUser(userData)}>
        Create Your Account
      </button>
    </div>
  );
};

export default connect(null, { registerUser })(Register);
