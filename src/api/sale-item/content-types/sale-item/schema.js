module.exports = {
  collectionName: 'sale_items',
  info: {
    singularName: 'sale-item',
    pluralName: 'sale-items',
    displayName: 'Sale Item',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    sale: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::sale.sale',
      inversedBy: 'items',
      required: true,
    },
    product: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::product.product',
      inversedBy: 'saleItems',
      required: true,
    },
    quantity: {
      type: 'integer',
      required: true,
      min: 1,
    },
    unitPrice: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    subtotal: {
      type: 'decimal',
      required: true,
      min: 0,
    },
  },
}
