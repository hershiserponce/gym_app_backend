module.exports = {
  collectionName: 'client_memberships',
  info: {
    singularName: 'client-membership',
    pluralName: 'client-memberships',
    displayName: 'Client Membership',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'clientMemberships', required: true },
    client: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::client.client',
      inversedBy: 'memberships',
      required: true,
    },
    membership: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::membership.membership',
      inversedBy: 'clientMemberships',
      required: true,
    },
    startDate: {
      type: 'date',
      required: true,
    },
    endDate: {
      type: 'date',
      required: true,
    },
    status: {
      type: 'enumeration',
      enum: ['active', 'expired', 'frozen', 'cancelled'],
      default: 'active',
    },
    autoRenew: {
      type: 'boolean',
      default: false,
    },
    frozenDays: {
      type: 'integer',
      default: 0,
    },
    notes: {
      type: 'richtext',
    },
    payments: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::payment.payment',
      mappedBy: 'clientMembership',
    },
  },
}
