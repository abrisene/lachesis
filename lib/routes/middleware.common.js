/*
 # middleware.common.js
 # Common Middleware
 */

/*
 # Middleware
 */

const asyncRoute = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

const cors = url => (req, res, next) => {
  if (url) {
    const urls = Array.isArray(url) ? url : [url];
    urls.forEach(u => res.header('Access-Control-Allow-Origin', `${u}`));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
};

const injectConfig = (key, value) => (req, res, next) => {
  req[key] = req[key] ? { ...req[key], ...value } : value;
  next();
};

/*
 # Module Exports
 */

module.exports = {
  asyncRoute,
  cors,
  injectConfig,
};
