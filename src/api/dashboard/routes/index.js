module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/dashboard/stats',
      handler: 'dashboard.stats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/dashboard/revenue-chart',
      handler: 'dashboard.revenueChart',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
