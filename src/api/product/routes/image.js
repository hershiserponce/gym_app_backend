module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/products/:id/image',
      handler: 'product.uploadImage',
      config: {
        auth: false,
        policies: [],
        middlewares: ['global::jwt-auth'],
      },
    },
    {
      method: 'DELETE',
      path: '/products/:id/image',
      handler: 'product.deleteImage',
      config: {
        auth: false,
        policies: [],
        middlewares: ['global::jwt-auth'],
      },
    },
  ],
}
