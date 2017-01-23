var axios = require('axios');

import * as actionTypes from 'actionTypes';

import {showError} from './errorActions';

export var requestRegister = () => {
  return {
    type: actionTypes.FETCH_REGISTER_REQUEST
  };
};

export var receiveRegisterSuccess = (authToken) => {
  return {
    type: actionTypes.FETCH_REGISTER_SUCCESS,
    authToken
  };
};

export var receiveRegisterFailure = (jsonRes) => {
  return {
    type: actionTypes.FETCH_REGISTER_FAILURE,
    jsonRes
  };
};

export var fetchRegister = (email, password) => {
  return (dispatch, getState) => {
    dispatch(requestRegister());

    return axios.post('http://localhost:3000/users', {
      email, password
    }).then( (res) => {
      dispatch(receiveRegisterSuccess(res.headers['x-auth']));
      // dispatch(receiveRegisterSuccess("something"));
    })
    .catch( (err) => {
      dispatch(receiveRegisterFailure(JSON.stringify(err)));
      //needed for register reducer to set 'isFetching' back to false

      dispatch(showError('Oops, that username is already taken.'));
    });

  };
};
