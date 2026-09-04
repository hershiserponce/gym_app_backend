module.exports = {
  collectionName: 'audit_logs',
  info: {
    singularName: 'audit-log',
    pluralName: 'audit-logs',
    displayName: 'Audit Log',
    description: '',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    gym: { type: 'relation', relation: 'manyToOne', target: 'api::gym.gym', inversedBy: 'auditLogs', required: true },
    action: {
      type: 'string',
      required: true,
    },
    entity: {
      type: 'string',
      required: true,
    },
    entityId: {
      type: 'integer',
    },
    user: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::users-permissions.user',
    },
    details: {
      type: 'json',
    },
    ipAddress: {
      type: 'string',
    },
    userAgent: {
      type: 'string',
    },
  },
}
