module.exports = {
  collectionName: 'sales',
  info: {
    singularName: 'sale',
    pluralName: 'sales',
    displayName: 'Sale',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    receiptNumber: {
      type: 'string',
      unique: true,
    },
    client: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::client.client',
      inversedBy: 'sales',
    },
    total: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    discount: {
      type: 'decimal',
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: 'enumeration',
      enum: ['cash', 'card', 'transfer', 'other'],
      required: true,
    },
    saleDate: {
      type: 'datetime',
      default: () => new Date(),
    },
    notes: {
      type: 'richtext',
    },
    items: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::sale-item.sale-item',
      mappedBy: 'sale',
    },
  },
}
