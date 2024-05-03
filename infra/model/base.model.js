const mongoose = require("mongoose");

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

function makeSchema(definition, options) {
  const schema = new mongoose.Schema(
    {
      ...definition,
      deleted_at: {
        type: Date,
        required: false,
        default: null,
      },
    },
    {
      ...options,
      ...schemaOptions,
      strict: true,
      toJSON: {
        virtuals: true,
        versionKey: false,
        ...options?.toJSON,
        transform(_, ret) {
          ret["metadata"] = {
            id: ret._id,
            created_at: ret?.created_at,
            updated_at: ret?.updated_at,
            deleted_at: ret?.deleted_at,
          };

          delete ret._id;
          delete ret?.deleted_at;
          delete ret?.created_at;
          delete ret?.updated_at;
          delete ret?.id;

          options?.toJSON?.transform?.(_, ret);
        },
      },
    }
  );

  schema.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true,
  });

  return schema;
}

module.exports = { makeSchema };
