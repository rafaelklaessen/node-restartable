const wrapInProxy = wrapperInstance => new Proxy(wrapperInstance, {
  get(obj, prop) {
    if (prop.startsWith('__INTERNAL__')) return obj[prop];
    if (prop === 'restart') return obj[prop];
    const { autoRestart, instance } = obj.__INTERNAL__store;

    if (!autoRestart && typeof instance[prop] === 'function') {
      // NOTE: We don't use destructuring here so that the bound instance
      // will always be the newest instance.
      return instance[prop].bind(obj.__INTERNAL__store.instance);
    }

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

module.exports = wrapInProxy;
