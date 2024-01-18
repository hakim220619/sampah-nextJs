export default {
  meEndpoint: '/api/me',
  loginEndpoint: 'http://localhost:3000/api/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
