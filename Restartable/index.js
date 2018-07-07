class Restartable {
  static start() {
    return Promise.reject(new Error('No start method defined!'));
  }
}

Restartable.__IS_RESTARTABLE__ = true;

module.exports = Restartable;
