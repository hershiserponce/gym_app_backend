module.exports = {
  collectionName: 'payments',
  info: {
    singularName: 'payment',
    pluralName: 'payments',
    displayName: 'Payment',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'payments', required: true },
    client: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::client.client',
      inversedBy: 'payments',
      required: true,
    },
    membership: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::membership.membership',
      inversedBy: 'payments',
      required: true,
    },
    clientMembership: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::client-membership.client-membership',
      inversedBy: 'payments',
    },
    amount: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: 'enumeration',
      enum: ['cash', 'card', 'transfer', 'other'],
      required: true,
    },
    paymentDate: {
      type: 'datetime',
      default: () => new Date(),
    },
    notes: {
      type: 'richtext',
    },
    receiptNumber: {
      type: 'string',
      unique: true,
    },
  },
}
