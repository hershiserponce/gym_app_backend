module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/payments',
      handler: 'payment.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/payments/:id',
      handler: 'payment.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/payments',
      handler: 'payment.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/payments/:id',
      handler: 'payment.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/payments/:id',
      handler: 'payment.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
