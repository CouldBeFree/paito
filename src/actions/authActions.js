import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode'

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post('http://localhost:5000/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
};

//Login - Get User Token
export const loginUser = userData => dispatch => {
    axios.post('http://localhost:5000/api/users/login', userData)
        .then(res => {
            // Save to local storage
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            //Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded))
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

// Log user out
export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};