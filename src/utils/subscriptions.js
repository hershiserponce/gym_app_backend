const CLIENT_MEMBERSHIP_UID = 'api::client-membership.client-membership'
const MEMBERSHIP_UID = 'api::membership.membership'
const PAYMENT_UID = 'api::payment.payment'

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

async function expireOverdueMemberships(gymId) {
  const today = toISODate(new Date())
  const where = { status: 'active', endDate: { $lt: today } }
  if (gymId != null) where.gym = { id: gymId }

  const overdue = await strapi.db.query(CLIENT_MEMBERSHIP_UID).findMany({
    where,
    select: ['id'],
  })

  await Promise.all(
    overdue.map((record) =>
      strapi.db.query(CLIENT_MEMBERSHIP_UID).update({
        where: { id: record.id },
        data: { status: 'expired' },
      })
    )
  )

  return overdue.length
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
  const today = toISODate(new Date())

  const existing = await strapi.db.query(CLIENT_MEMBERSHIP_UID).findOne({
    where: {
      client: client.id,
      membership: membershipRef.id,
      status: 'active',
      gym: gym.id,
    },
    orderBy: { endDate: 'desc' },
  })

  let startDate = toISODate(base)
  if (existing && existing.endDate >= today) {
    const continuation = new Date(existing.endDate)
    continuation.setDate(continuation.getDate() + 1)
    startDate = toISODate(continuation)
  }

  const start = new Date(startDate)
  const endDate = new Date(start)
  endDate.setDate(endDate.getDate() + duration)

  const clientMembership = await strapi.db.query(CLIENT_MEMBERSHIP_UID).create({
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

  if (clientMembership) {
    await strapi.db.query(PAYMENT_UID).update({
      where: { id: payment.id },
      data: { clientMembership: clientMembership.id },
    })
  }

  return clientMembership
}

module.exports = { syncClientMembershipFromPayment, expireOverdueMemberships }