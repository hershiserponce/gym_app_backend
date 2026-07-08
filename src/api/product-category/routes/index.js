module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/product-categories',
      handler: 'product-category.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/product-categories/:id',
      handler: 'product-category.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/product-categories',
      handler: 'product-category.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/product-categories/:id',
      handler: 'product-category.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/product-categories/:id',
      handler: 'product-category.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
