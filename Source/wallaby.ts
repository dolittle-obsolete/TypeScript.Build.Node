/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';

type PackageObject = {
  /**
   * The name of the package
   *
   * @type {string}
   */
  name: string,
  /**
   * Any prefix of the package name (scope, etc...)
   *
   * @type {string}
   */
  prefix?: string
}
export function wallaby(sourceRoot: string, packages: PackageObject[],
    settingsCallback: (w: any) => any, setupCallback: (w: any) => void) {

  if (sourceRoot === undefined) throw 'sourceRoot is required. The relative path to the root of the source files';

  return (w: any) => {
    process.env.NODE_PATH = path.join(w.projectCacheDir, sourceRoot);
    
    let packagesGlob = packages? `@(${packages.join('|')})` : '.';
  
    let compilers: any= {};
    compilers[`${sourceRoot}/${packagesGlob}/**/*.@(ts|js)`] = w.compilers.babel(JSON.parse(fs.readFileSync('.babelrc') as any));

    let settings = {
      files: [
        { pattern: `${sourceRoot}/**/package.json`, instrument: false} ,
        { pattern: `${sourceRoot}/**/node_modules/**/*`, instrument: false},
        { pattern: 'node_modules/chai', instrument: false},
        { pattern: 'node_modules/chai-as-promised', instrument: false },
        { pattern: 'node_modules/sinon/pkg', instrument: false },
        { pattern: 'node_modules/sinon-chai', instrument: false },
        { pattern: `${sourceRoot}/**/*.d.ts`, ignore: true },
        { pattern: `${sourceRoot}/${packagesGlob}/lib/**`, ignore: true },
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/**/!(given)/*.@(ts|js)`, ignore: true },
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/*.@(ts|js)`, ignore: true },
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/**/given/**/*.@(ts|js)`},
        { pattern: `${sourceRoot}/${packagesGlob}/**/*.@(ts|js)`}
      ],
      tests: [
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/**/given/**/*.@(ts|js)`, ignore: true },
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/**/!(given)/*.@(ts|js)`},
        { pattern: `${sourceRoot}/${packagesGlob}/**/for_*/*.@(ts|js)`}
      ],
      
      testFramework: 'mocha',
      env: {
        type: 'node',
        runner: 'node'
      },
      compilers,
      setup: getSetupFunction(sourceRoot, packages, setupCallback)
    };
    
    if (typeof settingsCallback === 'function') settingsCallback(settings);

    return settings;
  }
}

function getFunctionBody(func: Function) {
  var entire = func.toString();
  var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
  return body;
}

function getSetupFunction(sourceRoot: string, packages: PackageObject[], setupCallback: (w: any) => void) {
  let setup = function (w: any) {
    if (packages !== undefined) {
      if (!Array.isArray(packages)) throw 'packages has to be an array of the yarn packages'
      let aliases: any = {};
      packages.forEach(_ => {
        aliases[`${_.prefix? _.prefix : ''}${_.name}`] = `${w.projectCacheDir}/${sourceRoot}/${_.name}`;
      });
      require('module-alias').addAliases(aliases);
    }
    
    process.env.WALLABY_TESTING = true as any;
    (global as any).expect = chai.expect;
    let should = chai.should();
    (global as any).sinon = require('sinon');
    let sinonChai = require('sinon-chai');
    let chaiAsPromised = require('chai-as-promised');
    chai.use(sinonChai);
    chai.use(chaiAsPromised);

    (global as any).mock = require('@fluffy-spoon/substitute').Substitute;
  };

  if (typeof setupCallback === 'function') {
      var setupBody = getFunctionBody(setup);
      var setupCallbackBody = getFunctionBody(setupCallback);
      var combined = setupBody + '\n' + setupCallbackBody;
      var newFunction = new Function(combined);
      return newFunction;
  }

  return setup;
}