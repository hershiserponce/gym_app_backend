module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/setting',
      handler: 'setting.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/setting',
      handler: 'setting.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/setting',
      handler: 'setting.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
}
