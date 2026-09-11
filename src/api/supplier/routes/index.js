module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/suppliers',
      handler: 'supplier.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/suppliers/:id',
      handler: 'supplier.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/suppliers',
      handler: 'supplier.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/suppliers/:id',
      handler: 'supplier.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/suppliers/:id',
      handler: 'supplier.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
