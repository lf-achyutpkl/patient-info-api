import Boom from 'boom';
import jwt from 'jsonwebtoken';

/**
 * Middleware to handle invalid token.
 *
 * @param  {Object}   request
 * @param  {Object}   response
 * @param  {Function} next
 */
export default function auth(request, response, next) {
  // check header or url parameters or post parameters for token
  let token = request.body.token || request.query.token || request.headers['x-access-token'];
  let urls = request.url.split('/');

  if (urls[urls.length - 1] === 'authenticate') {
    return next();
  }

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        throw new Boom.unauthorized('Failed to authenticate token.');
      } else {
        // if everything is good, save to request for use in other routes
        request.decoded = decoded;

        return next();
      }
    });
  } else {
    // if there is no token
    // return an error
    throw new Boom.unauthorized('No Token Provided.');
  }
}
