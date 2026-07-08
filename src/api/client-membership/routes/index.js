module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/client-memberships',
      handler: 'client-membership.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/client-memberships/:id',
      handler: 'client-membership.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/client-memberships',
      handler: 'client-membership.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/client-memberships/:id',
      handler: 'client-membership.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/client-memberships/:id',
      handler: 'client-membership.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
