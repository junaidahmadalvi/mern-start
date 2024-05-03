const {
  findPaginated,
  findOneOrThrow,
  updateById,
  deleteById,
} = require("../utils/db-helper");
const {
  Throw400,
  Throw404,
  Throw422,
} = require("../utils/exceptions/http-exceptions");

/**
 * Creates a new record in the database.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {Object} data - The data to create the new record.
 * @returns {Promise<Object>} - The ID of the created record.
 */
function createRecord(model, data) {
  return model
    .create(data)
    .then((newRecord) => ({ id: newRecord.id }))
    .catch((error) => {
      throw new Throw422("Error while creating record.");
    });
}

/**
 * Finds a record by ID or throws an error if it does not exist.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {string} id - The ID of the record to find.
 * @param {Object} sOptions - Additional search options.
 * @returns {Promise<Object>} - The found record.
 */
function findByIdOrThrow(model, id, sOptions) {
  return findOneOrThrow(model, {
    ...sOptions,
    where: { ...sOptions?.where, _id: id },
  }).catch((error) => {
    throw new Throw404("Record not found by ID.");
  });
}

/**
 * Finds paginated records filtered by user ID.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {string} userId - User ID to filter by.
 * @param {Object} option - Additional search and pagination options.
 * @returns {Promise<Object>} - Paginated list response.
 */
function findPaginatedByUserId(model, userId, option) {
  return findPaginated(model, {
    ...option,
    where: { ...option.where, user_id: userId },
  }).catch((error) => {
    throw new Throw400("Error while finding paginated records by user ID.");
  });
}

/**
 * Generic method to find paginated records.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {Object} sOption - Search and pagination options.
 * @returns {Promise<Object>} - Paginated list response.
 */
function findPaginated(model, sOption) {
  return findPaginated(model, {
    ...sOption,
    where: { ...sOption.where },
  }).catch((error) => {
    throw new Throw400("Error while finding all records.");
  });
}

/**
 * Updates a record by its ID.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {string} id - The ID of the record to update.
 * @param {Object} data - New data for the update.
 * @returns {Promise<Object>} - The updated record.
 */
function updateRecordById(model, id, data) {
  return updateById(model, id, data).catch((error) => {
    throw new Throw422("Error while updating record by ID.");
  });
}

/**
 * Deletes a record by ID.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {string} id - The ID of the record to delete.
 * @param {boolean} soft - Whether to soft delete the record.
 * @returns {Promise<Object>} - Success status.
 */
function deleteRecordById(model, id, soft = true) {
  return deleteById(model, id, soft).catch((error) => {
    throw new Throw404("Error while deleting record by ID.");
  });
}

module.exports = {
  createRecord,
  findByIdOrThrow,
  findPaginatedByUserId,
  findPaginated,
  updateRecordById,
  deleteRecordById,
};
