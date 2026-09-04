module.exports = {
  collectionName: 'products',
  info: {
    singularName: 'product',
    pluralName: 'products',
    displayName: 'Product',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'products', required: true },
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'richtext',
    },
    category: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::product-category.product-category',
      inversedBy: 'products',
    },
    barcode: {
      type: 'string',
      unique: true,
    },
    cost: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    price: {
      type: 'decimal',
      required: true,
      min: 0,
    },
    stock: {
      type: 'integer',
      required: true,
      default: 0,
      min: 0,
    },
    minStock: {
      type: 'integer',
      default: 0,
      min: 0,
    },
    supplier: {
      type: 'string',
    },
    image: {
      type: 'media',
      multiple: false,
      allowedTypes: ['images'],
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    movements: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::inventory-movement.inventory-movement',
      mappedBy: 'product',
    },
    saleItems: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::sale-item.sale-item',
      mappedBy: 'product',
    },
  },
}
