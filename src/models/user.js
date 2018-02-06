import bookshelf from '../db';
import Batches from './batches';
import _ from 'lodash';

const TABLE_NAME = 'users';

/**
 * User model.
 */
let User = bookshelf.Model.extend({
  tableName: TABLE_NAME,
  hasTimestamps: true,

  permittedAttributes: ['id', 'name', 'emailId', 'roles'],

  parse: function(attrs) {
    return _.pick(attrs, this.permittedAttributes);
  },

  batches: function() {
    return this.belongsToMany(Batches);
  }
});

export default User;
