const { Schema } = require('mongoose');

class BaseSchema extends Schema {
  constructor(schema) {
    super(schema, { timestamps: true });
    this.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      }
    });
  }
}

module.exports = BaseSchema;
