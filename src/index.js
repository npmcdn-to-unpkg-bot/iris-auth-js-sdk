export class AuthManager {
  constructor(config) {
    this.config = config;
  }

  get token() {
    return this.config.token;
  }
}
