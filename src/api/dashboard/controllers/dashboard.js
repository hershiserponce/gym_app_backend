const { getTenant } = require('../../../utils/tenant')

module.exports = {
  async stats(ctx) {
    try {
      if (!(await getTenant(ctx))) return ctx.unauthorized()
      const data = await strapi.service('api::dashboard.dashboard').getStats(ctx);
      ctx.send(data);
    } catch (error) {
      ctx.internalServerError('Error fetching dashboard stats');
    }
  },

  async revenueChart(ctx) {
    try {
      if (!(await getTenant(ctx))) return ctx.unauthorized()
      const data = await strapi.service('api::dashboard.dashboard').getRevenueChart(ctx);
      ctx.send(data);
    } catch (error) {
      ctx.internalServerError('Error fetching revenue chart');
    }
  },
};
