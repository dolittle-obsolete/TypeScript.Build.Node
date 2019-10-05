/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';

type Workspace = {
  name: string,
  directory: string,
  package: any
}
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
export function wallaby(wallabyBabelConfig: any, settingsCallback?: (w: any) => any, setupCallback?: (w: any) => void) {
  return (w: any) => {
    
    let workspaces = getWorkspaces();
    
    process.env.NODE_PATH = path.join(w.projectCacheDir, 'Source');
    
    let packagesGlob = workspaces.length > 0? `@(${workspaces.map(_ => _.name).join('|')})/` : '';
  
    let compilers: any= {};
    compilers[`Source/${packagesGlob}/**/*.@(ts|js)`] = w.compilers.babel(wallabyBabelConfig);

    let settings = {
      files: [
        { pattern: 'package.json', instrument: false},
        { pattern: `Source/**/package.json`, instrument: false} ,
        { pattern: `Source/**/node_modules/**/*`, instrument: false},
        { pattern: 'node_modules/chai', instrument: false},
        { pattern: 'node_modules/chai-as-promised', instrument: false },
        { pattern: 'node_modules/sinon/pkg', instrument: false },
        { pattern: 'node_modules/sinon-chai', instrument: false },
        { pattern: `Source/**/*.d.ts`, ignore: true },
        { pattern: `Source/${packagesGlob}lib/**`, ignore: true },
        { pattern: `Source/${packagesGlob}**/for_*/**/!(given)/*.@(ts|js)`, ignore: true },
        { pattern: `Source/${packagesGlob}**/for_*/*.@(ts|js)`, ignore: true },
        { pattern: `Source/${packagesGlob}**/for_*/**/given/**/*.@(ts|js)`},
        { pattern: `Source/${packagesGlob}**/*.@(ts|js)`}
      ],
      tests: [
        { pattern: `Source/${packagesGlob}**/for_*/**/given/**/*.@(ts|js)`, ignore: true },
        { pattern: `Source/${packagesGlob}**/for_*/**/!(given)/*.@(ts|js)`},
        { pattern: `Source/${packagesGlob}**/for_*/*.@(ts|js)`}
      ],
      
      testFramework: 'mocha',
      env: {
        type: 'node',
        runner: 'node'
      },
      compilers,
      setup: getSetupFunction(setupCallback)
    };
    
    if (typeof settingsCallback === 'function') settingsCallback(settings);

    return settings;
  };
}

function getFunctionBody(func: Function) {
  var entire = func.toString();
  var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
  return body;
}

function getSetupFunction(setupCallback?: (w: any) => void) {
  let setup = function (w: any) {
    // COPY OF getWorkspaces() FUNCTION!
    const fs = require('fs');
    const path = require('path');
    
    let workspaces: Workspace[] = [];
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));

    if (packageJson.workspaces !== undefined) {
      let dirs = fs.readdirSync('Source');
      dirs.forEach((workspace: string) => {

        let packageJsonPath = path.join(process.cwd(), 'Source', workspace, 'package.json');
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
        workspaces.push({
          name: workspace,
          directory: path.dirname(packageJsonPath),
          package: packageJson
        })
      });
    }

    if (workspaces.length > 0) {
      let aliases: any = {};
      workspaces.forEach((_: Workspace) => {
        aliases[_.package.name] = _.directory;
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

function getWorkspaces(): Workspace[] {
    const fs = require('fs');
    const path = require('path');
    
    let workspaces: Workspace[] = [];
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));

    if (packageJson.workspaces !== undefined) {
      let dirs = fs.readdirSync('Source');
      dirs.forEach((workspace: string) => {

        let packageJsonPath = path.join(process.cwd(), 'Source', workspace, 'package.json');
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
        workspaces.push({
          name: workspace,
          directory: path.dirname(packageJsonPath),
          package: packageJson
        })
      });

    }
    return workspaces;
}