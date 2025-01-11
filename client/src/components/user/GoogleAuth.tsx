// src/components/GoogleAuth.js
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';

const GoogleAuth = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();

  const handleGoogleLoginSuccess = async (response) => {
    const accessToken = response.credential;

    try {
      // Send the access token to your backend to verify and get a JWT
      const res = await axios.post('/api/auth/google', { token: accessToken });
      const { jwt, user, isNewUser } = res.data;

      // Store the JWT in local storage or state
      localStorage.setItem('jwt', jwt);

      // Dispatch the user data to the Redux store
      dispatch(setUser(user));

      // Call the onSuccess callback with the isNewUser flag
      onSuccess(isNewUser);
    } catch (error) {
      console.error('Google login failed:', error);
      onError(error);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    onError(error);
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginFailure}
    />
  );
};

export default GoogleAuth;
