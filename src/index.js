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
