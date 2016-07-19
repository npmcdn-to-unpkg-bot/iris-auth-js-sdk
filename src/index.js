import Fetch from 'isomorphic-fetch';
import jws from 'jws';

export class AuthManager {
  constructor(config) {
    this.config = config;
  }

  _checkStatus(response) {
    console.log('response status: ' + response.status);
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  _parseJSON(response) {
    return response.json();
  }

  mediaRegister(type, mediaToken, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': this.config.appKey,
      },
      body: JSON.stringify({
        'Type': type,
        'MediaToken': mediaToken,
      }),
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Social media register failed: ' + error);
      errorCallback(error);
    });
  }

  emailRegister(username, email, password, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': this.config.appKey,
      },
      body: JSON.stringify({
        'Type': 'Email',
        'Email': email,
        'Password': password,
        'Name': username,
      }),
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Email register failed: ' + error);
      errorCallback(error);
    });
  }

  userInformation(token, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'user/current', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Get user information failed: ' + error);
      errorCallback(error);
    });
  }

  validateUserAccessToken(token, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'user/validate?access_token=' + token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Validate user token failed: ' + error);
      errorCallback(error);
    });
  }

  socialLogin(type, mediaToken, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': this.config.appKey,
      },
      body: JSON.stringify({
        'Type': type,
        'MediaToken': mediaToken,
      }),
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Social media login failed: ' + error);
      errorCallback(error);
    });
  }

  emailLogin(email, password, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': this.config.appKey,
      },
      body: JSON.stringify({
        'Type': 'Email',
        'Email': email,
        'Password': password,
      }),
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Email login failed: ' + error);
      errorCallback(error);
    });
  }

  anonymousLogin(userID, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'login/anonymous/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': this.config.appKey,
      },
      body: JSON.stringify({
        'UserID': userID,
      }),
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Anonymous login failed: ' + error);
      errorCallback(error);
    });
  }

  logout(token, successCallback, errorCallback) {
    return fetch(this.config.managementApiUrl + 'logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log('Logout failed: ' + error);
      errorCallback(error);
    });
  }

  decodeToken(token) {
    let decoded = jws.decode(token);
    if (!decoded) {
      return null;
    }
    let payload = decoded.payload;

    //try parse the payload
    if(typeof payload === 'string') {
      try {
        let obj = JSON.parse(payload);
        if(typeof obj === 'object') {
          payload = obj;
        }
      } catch (e) { }
    }

    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature
    };
  }
}
