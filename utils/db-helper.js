const { Throw404 } = require("./exceptions/http-exceptions");

function makePagination(pagination) {
  let { page, size } = pagination;
  const skip = (page - 1) * size;
  return { page, limit: size, skip };
}

function getSoftDeletedFilter(fetchSoftDeleted = false) {
  return fetchSoftDeleted ? {} : { deleted_at: null };
}

async function findPaginated(model, sOptions) {
  try {
    const paginate = makePagination(sOptions.pagination);
    let softDeletedFilter = getSoftDeletedFilter(sOptions.fetchSoftDeleted);

    let total = await model.countDocuments({
      ...sOptions.where,
      ...softDeletedFilter,
    });

    let records = [];

    if (sOptions && sOptions.populateOptions) {
      records = await model
        .find(
          { ...sOptions.where, ...softDeletedFilter },
          sOptions?.projection,
          {
            sort: sOptions?.sort || { created_at: -1 },
          }
        )
        .populate(sOptions.populateOptions)
        .skip(paginate.skip)
        .limit(paginate.limit);
    } else {
      records = await model
        .find(
          { ...sOptions.where, ...softDeletedFilter },
          sOptions?.projection,
          {
            sort: sOptions?.sort || { created_at: -1 },
          }
        )
        .skip(paginate.skip)
        .limit(paginate.limit);
    }

    return {
      page: paginate.page,
      size: records.length,
      total,
      list: records.map((record) => record.toJSON()),
    };
  } catch (error) {
    throw new Error(`Error while finding records: ${error.message}`);
  }
}

async function findOne(model, sOptions) {
  try {
    let softDeletedFilter = getSoftDeletedFilter(sOptions?.fetchSoftDeleted);

    let record = null;
    if (sOptions && sOptions.populateOptions) {
      record = await model
        .findOne(
          { ...sOptions?.where, ...softDeletedFilter },
          sOptions?.projection
        )
        .populate(sOptions.populateOptions);
    } else {
      record = await model.findOne(
        { ...sOptions?.where, ...softDeletedFilter },
        sOptions?.projection
      );
    }

    return record;
  } catch (error) {
    throw new Error(`Error while finding record: ${error.message}`);
  }
}

async function findOneOrThrow(model, sOptions) {
  const record = await findOne(model, sOptions);
  if (!record) throw new Throw404();
  return record;
}

async function updateById(model, id, data) {
  try {
    if (data?.deleted_at) {
      delete data.deleted_at;
    }

    let softDeletedFilter = getSoftDeletedFilter(data.fetchSoftDeleted);

    const obj = await model.findOneAndUpdate(
      { _id: id, ...softDeletedFilter },
      data,
      {
        new: true,
      }
    );

    if (!obj) throw new Throw404();

    return obj;
  } catch (error) {
    throw new Error(`Error while updating record by id: ${error.message}`);
  }
}

async function deleteById(model, id, soft = true) {
  try {
    await findOneOrThrow(model, { where: { _id: id } });

    if (soft) {
      await model.updateOne({ _id: id }, { deleted_at: new Date() });
    } else {
      await model.deleteOne({ _id: id });
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Error while deleting record by id: ${error.message}`);
  }
}

module.exports = {
  makePagination,
  findPaginated,
  findOne,
  findOneOrThrow,
  updateById,
  deleteById,
};
