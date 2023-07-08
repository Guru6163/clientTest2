import { Auth, DataStore } from "aws-amplify";
import { User } from "../../models";


export const setUserDetails = (userDetails) => ({
    type: 'SET_USER_DETAILS',
    payload: userDetails,
  });
  
  export const fetchUserDetails = () => async (dispatch) => {
    try {
      // Here, you can fetch the user details using AWS Amplify or any other authentication method you're using
      const userDetails = await Auth.currentAuthenticatedUser({ bypassCache: true })
  
      dispatch(setUserDetails(userDetails));
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };
  