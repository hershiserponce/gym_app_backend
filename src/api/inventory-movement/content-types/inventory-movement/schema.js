module.exports = {
  collectionName: 'inventory_movements',
  info: {
    singularName: 'inventory-movement',
    pluralName: 'inventory-movements',
    displayName: 'Inventory Movement',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    product: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::product.product',
      inversedBy: 'movements',
      required: true,
    },
    type: {
      type: 'enumeration',
      enum: ['in', 'out', 'adjustment'],
      required: true,
    },
    quantity: {
      type: 'integer',
      required: true,
    },
    referenceType: {
      type: 'enumeration',
      enum: ['purchase', 'sale', 'adjustment', 'expiration'],
    },
    referenceId: {
      type: 'string',
    },
    unitCost: {
      type: 'decimal',
      min: 0,
    },
    notes: {
      type: 'richtext',
    },
    movementDate: {
      type: 'datetime',
      default: () => new Date(),
    },
  },
}
