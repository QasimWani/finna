# dent [![Dependency Status][david-badge]][david] [![DevDependency Status][david-dev-badge]][david-dev]

[![npm](https://nodei.co/npm/dent.png)](https://nodei.co/npm/dent/)

[david-badge]: https://david-dm.org/eush77/dent.png
[david]: https://david-dm.org/eush77/dent
[david-dev-badge]: https://david-dm.org/eush77/dent/dev-status.png
[david-dev]: https://david-dm.org/eush77/dent#info=devDependencies

The closest you can get to DEstructuring assignmeNT with good old ES5's objects and functions.

## Example

`dent` for arrays:

```js
> var tuple = ['first', 'second', 'third']

> dent(tuple)
> var a = dent() // Or in a single statement: dent(tuple)()
> var b = dent()
> var c = dent()

> dent.idx
3 // Next element's index.

> [a, b, c]
[ 'first', 'second', 'third' ]
```

`dent` for objects:

```js
> var pair = { first: 'foo', second: 'bar' }

> dent(pair)
> var a = dent.o.first // Or in a single statement: dent(pair).o.first
> var b = dent.o.second

> [a, b]
[ 'foo', 'bar' ]
```

## API

### dent(obj)

Save reference to `obj` in `dent.o`. Return the `dent` itself.

### dent.o

Object passed to `dent` the last time.

### dent()

Return the next element (with index `dent.idx`) and increment `dent.idx` by 1.

### dent.idx

Next element's index (as would be accessed by `dent()`).

## Warning

`dent` storage is **temporary**. Drop your object in, take it apart, but don't assume that it will sit in `dent.o` or `dent.idx` will be the same next time you check.

## Install

```shell
npm install dent
```

## License

MIT
