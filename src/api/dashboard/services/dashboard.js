module.exports = {
  async getStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [dailyPayments, dailySales, newClients, activeMemberships] =
      await Promise.all([
        strapi.db.query('api::payment.payment').findMany({
          where: {
            paymentDate: {
              $gte: startOfDay.toISOString(),
              $lte: endOfDay.toISOString(),
            },
          },
        }),
        strapi.db.query('api::sale.sale').findMany({
          where: {
            saleDate: {
              $gte: startOfDay.toISOString(),
              $lte: endOfDay.toISOString(),
            },
          },
        }),
        strapi.db.query('api::client.client').count({
          where: {
            registrationDate: {
              $gte: startOfDay.toISOString(),
              $lte: endOfDay.toISOString(),
            },
          },
        }),
        strapi.db.query('api::client-membership.client-membership').count({
          where: {
            status: 'active',
          },
        }),
      ]);

    const membershipRevenue = dailyPayments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const salesRevenue = dailySales.reduce(
      (sum, s) => sum + parseFloat(s.total),
      0
    );

    return {
      dailyRevenue: membershipRevenue + salesRevenue,
      membershipRevenue,
      salesRevenue,
      newClientsToday: newClients,
      activeMemberships,
      lowStockProducts: 0,
    };
  },

  async getRevenueChart() {
    const days = 7;
    const chartData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

      const [payments, sales] = await Promise.all([
        strapi.db.query('api::payment.payment').findMany({
          where: {
            paymentDate: {
              $gte: startOfDay.toISOString(),
              $lte: endOfDay.toISOString(),
            },
          },
        }),
        strapi.db.query('api::sale.sale').findMany({
          where: {
            saleDate: {
              $gte: startOfDay.toISOString(),
              $lte: endOfDay.toISOString(),
            },
          },
        }),
      ]);

      const membershipRev = payments.reduce(
        (sum, p) => sum + parseFloat(p.amount),
        0
      );
      const salesRev = sales.reduce(
        (sum, s) => sum + parseFloat(s.total),
        0
      );

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      chartData.push({
        date: `${month}/${day}`,
        memberships: membershipRev,
        sales: salesRev,
        total: membershipRev + salesRev,
      });
    }

    return chartData;
  },
};
