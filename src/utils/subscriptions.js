const CLIENT_MEMBERSHIP_UID = 'api::client-membership.client-membership'
const MEMBERSHIP_UID = 'api::membership.membership'
const PAYMENT_UID = 'api::payment.payment'

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

async function syncClientMembershipFromPayment(payment, gym) {
  if (!payment || !gym) return null

  const fullPayment = await strapi.db.query(PAYMENT_UID).findOne({
    where: { id: payment.id },
    populate: ['client', 'membership'],
  })
  if (!fullPayment) return null

  const client = fullPayment.client
  const membershipRef = fullPayment.membership
  if (!client || !membershipRef) return null

  const membership = await strapi.db.query(MEMBERSHIP_UID).findOne({
    where: { id: membershipRef.id },
  })
  const duration = membership && Number(membership.duration) > 0
    ? Number(membership.duration)
    : 30

  const base = fullPayment.paymentDate ? new Date(fullPayment.paymentDate) : new Date()
  const startDate = toISODate(base)
  const endDate = new Date(base)
  endDate.setDate(endDate.getDate() + duration)

  const today = toISODate(new Date())

  const existing = await strapi.db.query(CLIENT_MEMBERSHIP_UID).findOne({
    where: {
      client: client.id,
      membership: membershipRef.id,
      status: 'active',
      gym: gym.id,
    },
  })

  let clientMembership
  if (existing && existing.endDate >= today) {
    const newEnd = new Date(existing.endDate)
    newEnd.setDate(newEnd.getDate() + duration)
    clientMembership = await strapi.db.query(CLIENT_MEMBERSHIP_UID).update({
      where: { id: existing.id },
      data: { endDate: toISODate(newEnd) },
    })
  } else {
    clientMembership = await strapi.db.query(CLIENT_MEMBERSHIP_UID).create({
      data: {
        gym: gym.id,
        client: client.id,
        membership: membershipRef.id,
        startDate,
        endDate: toISODate(endDate),
        status: 'active',
        autoRenew: false,
        frozenDays: 0,
      },
    })
  }

  if (clientMembership) {
    await strapi.db.query(PAYMENT_UID).update({
      where: { id: payment.id },
      data: { clientMembership: clientMembership.id },
    })
  }

  return clientMembership
}

module.exports = { syncClientMembershipFromPayment }