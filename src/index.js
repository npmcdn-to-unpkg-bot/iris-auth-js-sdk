import Fetch from 'isomorphic-fetch';

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

  get token() {
    return this.config.token;
  }
}
