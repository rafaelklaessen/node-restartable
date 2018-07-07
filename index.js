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

  set baz(value) {
    console.log(this);
    if (Math.round(this.random * 10) === 7) return this._baz = value;
    throw new Error('Fantastic');
  }

  get bar() {
    console.log(this);
    if (Math.round(this.random * 10) === 7) return 19;
    throw new Error('Fantastic');
  }

  foo() {
    console.log(this);
    if (Math.round(this.random * 10) === 7) return 8;
    throw new Error('Fantastic');
  }
}

const instance = createInstance(MyClass, true)('foo', 'bar');

console.log(instance.foo);
console.log(instance.foo());
instance.restart();
instance.restart();
console.log(instance.bar);
instance.restart();
console.log(instance.baz = 7);
instance.restart();
console.log(instance.seven = 7);
instance.restart();
console.log(instance.random);
