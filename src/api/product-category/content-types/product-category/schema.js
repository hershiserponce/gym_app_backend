module.exports = {
  collectionName: 'product_categories',
  info: {
    singularName: 'product-category',
    pluralName: 'product-categories',
    displayName: 'Product Category',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    description: {
      type: 'richtext',
    },
    sortOrder: {
      type: 'integer',
    },
    products: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::product.product',
      mappedBy: 'category',
    },
  },
}
