const { tenantController } = require('../../../utils/tenant')
const { syncClientMembershipFromPayment } = require('../../../utils/subscriptions')

module.exports = tenantController('api::payment.payment', {
  afterCreate: async (payment, { gym }) => {
    await syncClientMembershipFromPayment(payment, gym)
  },
})