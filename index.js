const Restartable = require('./Restartable');
const createInstance = require('./createInstance');

class MyClass extends Restartable {
  static start(...params) {
    return new MyClass(...params);
  }

  constructor() {
    super();
    this.random = Math.random();
  }

  foo() {
    console.log(this)
    if (Math.round(this.random * 10) === 7) return 8;
    throw new Error('Fantastic');
  }
}

const instance = createInstance(MyClass, true)('foo', 'bar');

console.log(instance.foo)
console.log(instance.foo());
