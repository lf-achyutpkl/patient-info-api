import Boom from 'boom';
import User from '../models/user';
import jwt from 'jsonwebtoken';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  return User.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  return new User({ id })
    .fetch({
      withRelated: ['batches']
    })
    .then(user => {
      if (!user) {
        throw new Boom.notFound('User not found');
      }

      return user;
    });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function createUser(user) {
  return new User({ name: user.name }).save().then(user => user.refresh());
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id }).save({ name: user.name }).then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => user.destroy());
}

/**
 * Authenticate a user.
 *
 * @param  {String}  email_id
 * @param  {String}  password
 * @return {Promise}
 */
export function authenticate(emailId, password) {
  return new Promise((resolve, reject) => {
    new User({ emailId: emailId }).fetch().then(user => {
      if (!user) {
        reject(new Boom.notFound('User not found'));
      } else if (user.get('password') !== password) {
        reject(new Boom.notFound('Password does not match'));
      } else {
        let token = jwt.sign(user.toJSON(), 'secretKey', {
          expiresIn: '7d' // expires in 7 days
        });
        resolve(token);
      }
    });
  });
}
