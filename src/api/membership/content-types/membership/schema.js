module.exports = {
  collectionName: 'memberships',
  info: {
    singularName: 'membership',
    pluralName: 'memberships',
    displayName: 'Membership',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'memberships', required: true },
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    description: {
      type: 'richtext',
    },
    price: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    duration: {
      type: 'integer',
      required: true,
      min: 1,
    },
    benefits: {
      type: 'richtext',
    },
    color: {
      type: 'string',
    },
    sortOrder: {
      type: 'integer',
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    clientMemberships: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::client-membership.client-membership',
      mappedBy: 'membership',
    },
    payments: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::payment.payment',
      mappedBy: 'membership',
    },
  },
}
