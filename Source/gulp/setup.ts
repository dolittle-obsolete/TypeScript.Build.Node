/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {} from '../internal';
import {Project} from '@dolittle/typescript.build';
/**
 * Setup the tasks from this package
 * @param {any} originalExports The original exports object in the scope of the gulpfile importing this
 */
export default function setup(originalExports: any) {
    let project = new Project();
    for( var task in tasks ) originalExports[task] = tasks[task];
}

module.exports = setup;