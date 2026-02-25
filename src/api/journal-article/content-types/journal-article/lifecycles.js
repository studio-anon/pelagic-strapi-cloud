'use strict';

// @ts-ignore - @strapi/utils is a Strapi dependency, available at runtime
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
  async beforeCreate(event) {
    await validateExternalLink(event.params.data);
  },

  async beforeUpdate(event) {
    const data = event.params.data || {};
    const existing = await findExistingEntry(event.params.where);
    await validateExternalLink(data, existing);
  },
};

async function findExistingEntry(where) {
  if (!where || typeof where !== 'object') {
    return null;
  }

  const queryWhere = {};

  if (where.id) {
    queryWhere.id = where.id;
  } else if (where.documentId) {
    queryWhere.documentId = where.documentId;
  } else {
    return null;
  }

  return strapi.db.query('api::journal-article.journal-article').findOne({
    where: queryWhere,
  });
}

async function validateExternalLink(data = {}, existing = null) {
  const resolvedIsExternal =
    typeof data.isExternal === 'boolean'
      ? data.isExternal
      : Boolean(existing?.isExternal);

  const resolvedExternalUrl =
    typeof data.externalUrl === 'string'
      ? data.externalUrl.trim()
      : typeof existing?.externalUrl === 'string'
        ? existing.externalUrl.trim()
        : '';

  if (resolvedIsExternal && !resolvedExternalUrl) {
    throw new ApplicationError(
      'External URL is required when "isExternal" is enabled.'
    );
  }
}
