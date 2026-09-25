const { tenantController } = require('../../../utils/tenant')
const { expireOverdueMemberships } = require('../../../utils/subscriptions')

module.exports = tenantController('api::client-membership.client-membership', {
  beforeFind: async ({ gym }) => {
    await expireOverdueMemberships(gym.id)
  },
})
