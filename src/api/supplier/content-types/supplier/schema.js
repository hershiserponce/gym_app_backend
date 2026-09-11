module.exports = {
  collectionName: 'suppliers',
  info: {
    singularName: 'supplier',
    pluralName: 'suppliers',
    displayName: 'Supplier',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'suppliers', required: true },
    name: {
      type: 'string',
      required: true,
    },
    contactPerson: {
      type: 'string',
    },
    address: {
      type: 'text',
    },
    notes: {
      type: 'text',
    },
    products: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::product.product',
      mappedBy: 'supplier',
    },
  },
}
