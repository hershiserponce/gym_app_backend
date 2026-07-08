module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/sale-items',
      handler: 'sale-item.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/sale-items/:id',
      handler: 'sale-item.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/sale-items',
      handler: 'sale-item.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/sale-items/:id',
      handler: 'sale-item.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/sale-items/:id',
      handler: 'sale-item.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
