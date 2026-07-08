module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/audit-logs',
      handler: 'audit-log.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/audit-logs/:id',
      handler: 'audit-log.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/audit-logs',
      handler: 'audit-log.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/audit-logs/:id',
      handler: 'audit-log.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
