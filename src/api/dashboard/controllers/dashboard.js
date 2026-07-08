module.exports = {
  async stats(ctx) {
    try {
      const data = await strapi.service('api::dashboard.dashboard').getStats();
      ctx.send(data);
    } catch (error) {
      ctx.internalServerError('Error fetching dashboard stats');
    }
  },

  async revenueChart(ctx) {
    try {
      const data = await strapi.service('api::dashboard.dashboard').getRevenueChart();
      ctx.send(data);
    } catch (error) {
      ctx.internalServerError('Error fetching revenue chart');
    }
  },
};
