module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/clients',
      handler: 'client.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/clients/:id',
      handler: 'client.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/clients',
      handler: 'client.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/clients/:id',
      handler: 'client.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/clients/:id',
      handler: 'client.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}
