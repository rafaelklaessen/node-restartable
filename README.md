# node-restartable
Easily build crash-proof modules!

This package provides a way to automatically restart classes. This is particularly useful when your classes get in wrong states, and simply reconstructing them would make them function again.

## Simple example
```javascript
const { Restartable, createInstance } = require('node-restartable');
// Or
const Restartable = require('node-restartable/Restartable');
const createInstance = require('node-restartable/createInstance');

class MyClass extends Restartable {
  static start(...params) {
    return new MyClass(...params);
  }

  constructor() {
    super();
    this.someState = Math.random();
  }

  calculateSomeComplexThing() {
    const state = this.someState;
    // 50% fail chance
    if (state > .5) {
      throw new InvalidStateError('Nope');
    }
    return state * 4 / 5;
  }
}

const instance = createInstance(MyClass)();

instance.calculateSomeComplexThing(); // Will work
```

## API
`Restartable` is a dummy class that doesn't actually do anything.

`createInstance` is a higher-order function:

`createInstance(class: Restartable, autoRestart: bool = false) => (...params: any[]) => Proxy<RestartableWrapper>`

## Caveats
If a method call or getter/setter *always* fails, `node-restartable` will just keep restarting it forever.

## Advanced example
```javascript
const { Restartable, createInstance } = require('node-restartable');

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
    // Basically, this method fails 9 out of 10 times
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

const instance = createInstance(MyClass)('foo', 'bar');

// None of the method calls below fails
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
```

## License
MIT
