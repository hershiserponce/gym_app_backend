module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/inventory-movements',
      handler: 'inventory-movement.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/inventory-movements/:id',
      handler: 'inventory-movement.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/inventory-movements',
      handler: 'inventory-movement.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/inventory-movements/:id',
      handler: 'inventory-movement.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/inventory-movements/:id',
      handler: 'inventory-movement.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
