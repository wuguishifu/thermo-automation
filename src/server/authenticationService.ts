class AuthenticationService {
  private authenticationToken: string | null = null;
  private expiresAtMillis = 0;

  private async refreshAuthenticationToken() {
    const data = await fetch('https://integrator-api.daikinskyport.com/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.DAIKIN_API_KEY || '',
      },
      body: JSON.stringify({
        email: process.env.EMAIL,
        integratorToken: process.env.DAIKIN_INTEGRATOR_TOKEN,
      }),
    }).then((response) => response.json());

    this.authenticationToken = data.accessToken;
    this.expiresAtMillis = Date.now() + data.accessTokenExpiresIn * 1000;
  }

  public async getAuthenticationToken() {
    if (this.authenticationToken && this.expiresAtMillis > Date.now()) {
      return this.authenticationToken;
    }

    await this.refreshAuthenticationToken();
    return this.authenticationToken;
  }
}

export const authenticationService = new AuthenticationService();
