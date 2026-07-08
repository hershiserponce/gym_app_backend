module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/memberships',
      handler: 'membership.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/memberships/:id',
      handler: 'membership.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/memberships',
      handler: 'membership.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/memberships/:id',
      handler: 'membership.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/memberships/:id',
      handler: 'membership.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
