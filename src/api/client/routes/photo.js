module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/clients/:id/photo',
      handler: 'client.uploadPhoto',
      config: {
        auth: false,
        policies: [],
        middlewares: ['global::jwt-auth'],
      },
    },
    {
      method: 'DELETE',
      path: '/clients/:id/photo',
      handler: 'client.deletePhoto',
      config: {
        auth: false,
        policies: [],
        middlewares: ['global::jwt-auth'],
      },
    },
  ],
}
