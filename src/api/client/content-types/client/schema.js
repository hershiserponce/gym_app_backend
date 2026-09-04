module.exports = {
  collectionName: 'clients',
  info: {
    singularName: 'client',
    pluralName: 'clients',
    displayName: 'Client',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'clients', required: true },
    fullName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'email',
      unique: true,
    },
    phone: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'date',
    },
    gender: {
      type: 'enumeration',
      enum: ['male', 'female', 'other'],
    },
    photo: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    notes: {
      type: 'richtext',
    },
    status: {
      type: 'enumeration',
      enum: ['active', 'inactive'],
      default: 'active',
    },
    registrationDate: {
      type: 'datetime',
      default: () => new Date(),
    },
    address: {
      type: 'string',
    },
    memberships: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::client-membership.client-membership',
      mappedBy: 'client',
    },
    sales: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::sale.sale',
      mappedBy: 'client',
    },
    payments: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::payment.payment',
      mappedBy: 'client',
    },
  },
}
