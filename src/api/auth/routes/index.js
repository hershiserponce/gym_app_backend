module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.me',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/signup',
      handler: 'auth.signup',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
}
