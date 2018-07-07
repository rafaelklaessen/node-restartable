class RestartableWrapper {
  constructor(Class, autoRestart, params, instance) {
    this.__INTERNAL__store = {
      Class,
      autoRestart,
      params,
      instance
    };
  }

  restart() {
    this.__INTERNAL__restartInstance();
    return this;
  }

  __INTERNAL__restartInstance() {
    const { Class, autoRestart, params } = this.__INTERNAL__store;
    console.warn(`Restarting ${Class.name}...`);

    const instance = Class.start(...params);

    this.__INTERNAL__store = {
      Class,
      autoRestart,
      instance,
      params
    };
    return instance;
  }

  __INTERNAL__wrapMethod(methodName, handler) {
    const instance = this.__INTERNAL__store.instance;
    return function forwardWrappedMethodCall(...params) {
      try {
        return instance[methodName].bind(instance)(...params);
      } catch (e) {
        const newInstance = this.__INTERNAL__restartInstance();
        return handler.get(this, methodName).bind(newInstance)(...params);
      }
    }
  }
}

const wrapInProxy = wrapperInstance => new Proxy(wrapperInstance, {
  get(obj, prop) {
    if (prop.startsWith('__INTERNAL__')) return obj[prop];
    if (prop === 'restart') return obj[prop];
    const { autoRestart, instance } = obj.__INTERNAL__store;

    if (!autoRestart) {
      return instance[prop];
    }

    try {
      const value = instance[prop];
      if (typeof value !== 'function') return value;
      return obj.__INTERNAL__wrapMethod(prop, this).bind(obj);
    } catch (e) {
      obj.__INTERNAL__restartInstance();
      return this.get(obj, prop);
    }
  },
  set(obj, prop, value) {
    if (!obj.__INTERNAL__store.autoRestart) {
      obj[prop] = value;
      return true;
    }

    try {
      obj[prop] = value;
      return true;
    } catch (e) {
      obj.__INTERNAL__restartInstance();
      return this.set(obj, prop, value);
    }
  }
});

const createInstance = (Class, autoRestart = false) => (...params) => {
  if (!Class.__IS_RESTARTABLE__) {
    throw new Error('Class is not a Restartable!');
  }

  const instance = Class.start(...params);
  const wrapper = new RestartableWrapper(Class, autoRestart, params, instance);
  return wrapInProxy(wrapper);
};

module.exports = createInstance;
