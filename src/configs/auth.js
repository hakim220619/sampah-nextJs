export default {
  meEndpoint: '/api/me',
  loginEndpoint: '/api/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
