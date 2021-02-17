import {
  AUTH_FORM_SUCCESS,
  AUTH_FORM_FAIL,
  AUTH_ERROR,
  USER_IS_LOADED,
  LOG_OUT,
} from '../constants/auth.constants';
import axios from 'axios';
import setAuthToken from '../middleware/setAuthToken';

export const userLoaded = () => async (dispatch) => {
  if (localStorage.getItem('token')) {
    setAuthToken(localStorage.getItem('token'));
  }
  try {
    const response = axios.get('http://localhost:5000/api/users/');

    dispatch({
      type: USER_IS_LOADED,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(userData);

    const response = await axios.post(
      'http://localhost:5000/api/users/register',
      body,
      config
    );

    dispatch({
      type: AUTH_FORM_SUCCESS,
      payload: response.data,
    });
    dispatch(userLoaded());
  } catch (error) {
    dispatch({
      type: AUTH_FORM_FAIL,
      payload: 'REJECTED',
    });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(userData);

    const response = await axios.post(
      'http://localhost:5000/api/users/login',
      body,
      config
    );

    dispatch({
      type: AUTH_FORM_SUCCESS,
      payload: response.data,
    });
    dispatch(userLoaded());
  } catch (error) {
    dispatch({
      type: AUTH_FORM_FAIL,
      payload: 'REJECTED',
    });
  }
};

export const logOut = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
};
