module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/sales',
      handler: 'sale.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/sales/:id',
      handler: 'sale.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/sales',
      handler: 'sale.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/sales/:id',
      handler: 'sale.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/sales/:id',
      handler: 'sale.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
