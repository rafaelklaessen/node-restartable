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

module.exports = RestartableWrapper;
