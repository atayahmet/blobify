# Blobify
A Javascript automation tool to convert from html file object to blob object and more capabilities with creating custom helper function.

[![npm version](https://badge.fury.io/js/blobify.svg)](https://badge.fury.io/js/blobify)
[![Build Status](https://travis-ci.org/atayahmet/blobify.svg?branch=v0.0.5-beta5)](https://travis-ci.org/atayahmet/blobify)
[![Dependency Status](https://img.shields.io/david/atayahmet/storage-based-queue.svg?style=flat-square)](https://david-dm.org/atayahmet/storage-based-queue)
[![Known Vulnerabilities](https://snyk.io/test/github/atayahmet/blobify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/atayahmet/blobify?targetFile=package.json)
[![GitHub license](https://img.shields.io/github/license/atayahmet/storage-based-queue.svg)](https://github.com/atayahmet/blobify/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/atayahmet/storage-based-queue.svg)](https://github.com/atayahmet/blobify/issues)

## Getting Started

```ts
import { chunk } from '@atayahmet/blobify';

chunk({ chars: stream, slice: 128, type: 'image/jpg' })
```

### Installing

```sh
npm i @atayahmet/blobify --save
```
or

```sh
yarn add @atayahmet/blobify
```

## Running the tests

```ts
npm test
```

### Built-in Helpers

| Name         | Parameter Type | Return                 | Description                             |
|--------------|----------------|------------------------|-----------------------------------------|
| pipe         | Function       | Blobify class instance | Pipe itarator.                          |
| createBlob   | string[]       | Blob                   | Create blob object from chunks.         |
| chunk        | IChunkOptions  | Uint8Array[]           | Chunk generator.                        |
| base64Encode | File           | Promise&lt;string&gt;  | HTML5 File object.                      |
| base64Decode | string         | any                    | Base64 encoded data.                    |
| toStream     | Blob           | Promise&lt;string&gt;  | Convert blob object to readable content.|

### IChunkOptions

| Name   | Type                 | Description                   |
|--------|----------------------|-------------------------------|
| chunks | string or Uint8Array | Data format.                  |
| slice  | number (optional)    | Per chunk size. (Default 512) |
| type   | string               | File content type.            |

## Quick Example

Convert the file to uploadable form.

```ts
import { pipe, chunk, createBlob, base64Encode } from '@atayahmet/blobify';

const file = document.getElementById('image');

pipe(() => base64Encode(file))
  .pipe(stream => chunk({ chars: stream, slice: 128 }))
  .pipe(chunks => createBlob(chunks, "image/jpeg"))
  .catch(console.error)
  .run()
  .then(resul => {
    console.log(result);
  });
```

Vice versa:

```ts
pipe(() => toStream(blob))
  .pipe(stream => base64Decode(stream))
  .pipe(data => {
      // do some maniplation...
      return data;
  })
  .run()
  .then(result => {
    // ...
  });
```

## Built With

* [TypeScript](https://www.typescriptlang.org) 

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* [**Ahmet ATAY**](https://github.com/atayahmet) - *Initial work*

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details