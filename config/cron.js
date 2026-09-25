module.exports = {
  expireMemberships: {
    task: async () => {
      const { expireOverdueMemberships } = require('../src/utils/subscriptions')
      await expireOverdueMemberships()
    },
    options: {
      rule: '0 * * * *',
    },
  },
}
