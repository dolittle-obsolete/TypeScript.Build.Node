This project represents a base build package for TypeScript Node and Library projects which projects can depend on for providing pre-configured setups for their TypeScript node environment including Gulp Tasks, testing using Mocha and a pre-configured configuration for wallaby tailored for the project.

## Using it

The project is published as an NPM package and can be used by adding a dev reference to it:

```shell
$ npm install @dolittle/typescript.build.node --save-dev
```

or with Yarn:

```shell
$ yarn add -D @dolittle/typescript.build.node
```

The idea is that this package serves as a foundation for setting up environments for building TypeScript Node applications and libraries.


### Required Structure and Recommended Setup
We are strongly recommending to follow one of [these examples](https://github.com/dolittle-tools/TypeScript.Build.Node/tree/master/Examples) that fits your project's needs.


### Tsconfig.json
This package also distributes a base configuration for the TypeScript compiler that can be found under '@dolittle/typescript.build.node/TSConfig/tsconfig.base.json'. And in your project you could simply depend on extending this configuration and it should cover most developer's needs.


## Dependencies

This project has all its dependencies as regular dependencies, which is why it is important to add a reference to
this package as a dev dependency. The reason for this is to be able to get all the packages down that the
build pipeline need onto your developer box.

## Tests

This package also provides every dependency you'd need to perform tests using the [Mocha](https://mochajs.org/) framework. It also exposes Gulp tasks that builds and runs the tests.

## Gulp

Included in the package is a [Gulp](https://gulpjs.com) based build pipeline. The purpose of the build is to enable an
easy way to build and output what is needed for a deployable package that is widely supported in any JavaScript and or TypeScript environment. It outputs by default the CJS module format

### Task

The tasks is context sensitive and will understand wether or not to build the current **package** or all the **packages**
discovered in the `workspaces` property - based on a yarn workspaces setup. For instance, by just using the `build` task provided from our Gulpfile,
it will build correct according to the context.

### Setup
There are two ways to utilize these features. Firstly you can either have your own 'Gulpfile.js' file in the root of your project that looks like this:

Gulpfile.js (This file is optional)
```js
const build = require('@dolittle/typescript.build.node');
build.setupGulp(exports);
// export additional tasks...
```

Then you would need to have a couple of scripts in your package.json (all you package.json files if you're using yarn workspaces) depending on whether or not you decided to have your own Gulpfile or not:

If you don't have your own Gulpfile.js
```json
{
  "scripts": {
    "tasks": "gulp --tasks --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js",
    "clean": "gulp clean --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js",
    "build": "gulp build --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js",
    "test": "gulp test --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js",
    "test:run": "gulp test-run --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js",
    "test:clean": "gulp test-clean --gulpfile node_modules/@dolittle/typescript.build.node/Gulpfile.js"
}
```

and if you have your own Gulpfile.js
```json
{
  "scripts": {
    "tasks": "gulp --tasks",
    "clean": "gulp clean",
    "build": "gulp build",
    "test": "gulp test",
    "test:run": "gulp test-run",
    "test:clean": "gulp test-clean"
}
```
NOTICE:
You don't need to have all these scripts, unless you're using the Dolittle Azure DevOps pipeline for TypeScript then you need all of these with those exact names.

NOTICE:
--gulpfile must point to the Gulpfile.js file in the @dolittle/typescript.build.node package.


### Wallaby

If you want to be using [Wallaby](https://wallabyjs.com), there is a pre-defined setup for it that will
work right out of the box.

To get started, all you need is to add a `wallaby.js` file into your project and add the following:

```javascript
const build = require('@dolittle/typescript.build.node');

module.exports = build.wallaby();
```
