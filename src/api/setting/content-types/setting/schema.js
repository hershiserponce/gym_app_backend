module.exports = {
  kind: 'collectionType',
  collectionName: 'settings',
  info: {
    singularName: 'setting',
    pluralName: 'settings',
    displayName: 'Setting',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    gym: {
      type: 'relation',
      relation: 'oneToOne',
      target: 'api::gym.gym',
      inversedBy: 'settings',
      required: true,
      unique: true,
    },
    gymName: {
      type: 'string',
      required: true,
    },
    address: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    email: {
      type: 'email',
    },
    logo: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    currency: {
      type: 'string',
      default: 'MXN',
    },
    receiptFooter: {
      type: 'richtext',
    },
    defaultMembershipDuration: {
      type: 'integer',
      default: 30,
    },
    lowStockThreshold: {
      type: 'integer',
      default: 5,
    },
  },
}
