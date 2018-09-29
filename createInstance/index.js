const RestartableWrapper = require('./RestartableWrapper');
const wrapInProxy = require('./wrapInProxy');

const createInstance = (Class, autoRestart = false) => (...params) => {
  if (!Class.__IS_RESTARTABLE__) {
    throw new TypeError('Class is not a Restartable!');
  }

  const instance = Class.start(...params);
  const wrapper = new RestartableWrapper(Class, autoRestart, params, instance);
  return wrapInProxy(wrapper);
};

module.exports = createInstance;
