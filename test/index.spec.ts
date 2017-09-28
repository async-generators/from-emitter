import equal from '@async-generators/equal';
import terminator from '../src';
import { expect } from 'chai';

describe("@async-generator/terminator", () => {
  it("should throw error if source is not iterable", async () => {
    let source = {} as any;
    let error;
    try {
      terminator(source);
    } catch (err) { error = err; }

    expect(error.message).to.be.eq("source is not iterable!");
  })

  it("should not callback if async iterator completes normally", async () => {
    let result;
    let source = async function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
      result = false;
    }

    for await (let item of terminator(source())) { }

    expect(result).to.not.be.undefined;
    expect(result).to.be.false;
  })

  it("should not callback if iterator completes normally", async () => {
    let result;
    let source = function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
      result = false;
    }

    for (let item of terminator(source())) { }

    expect(result).to.not.be.undefined;
    expect(result).to.be.false;
  })

  it("should return terminated Symbol if iterator breaks out", async () => {
    let result = false;
    let source = function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
    }

    for (let item of terminator(source())) {
      if (item > 4)
        break;
    }

    expect(result).to.be.true;
  })

  it("should return terminated Symbol if async iterator breaks out", async () => {
    let result = false;
    let source = async function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
    }

    for await (let item of terminator(source())) {
      if (item > 4)
        break;
    }

    expect(result).to.be.true;
  })

  it("should return terminated Symbol if iterator throws", async () => {
    let result = false;
    let source = function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
    }

    try {
      for (let item of terminator(source())) {
        if (item > 4)
          throw Error("");
      }
    } catch (err) { }

    expect(result).to.be.true;
  })

  it("should return terminated Symbol if async iterator throws", async () => {
    let result = false;
    let source = async function* () {
      for (let i = 0; i < 10; i++) {
        if ((yield i) === Symbol.for("terminated")) {
          result = true;
          break;
        }
      }
    }

    try {
      for await (let item of terminator(source())) {
        if (item > 4)
          throw Error("");
      }
    } catch (err) { }

    expect(result).to.be.true;
  })

  it("should cascade return", async () => {
    class Foo {
      jam = "tart";
      *[Symbol.iterator]() {
        if ((yield "hello") == Symbol.for("terminated")) {
          this.jam = "sandwich";
        }
        yield "world";
      }
    }

    function* chain(source) {
      for (let item of source)
        if ((yield item) == Symbol.for("terminated")) {
          break;
        }
    }

    let foo = new Foo();

    expect(foo.jam).to.be.eq("tart");

    for await (let item of chain(terminator(chain(terminator(foo))))) {
      break;
    }
    expect(foo.jam).to.be.eq("sandwich");
  })
})
