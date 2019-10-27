/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { GulpContext, getGulpTasks } from '../internal';
/**
 * Setup the tasks from this package
 * @param {any} originalExports The original exports object in the scope of the gulpfile importing this
 */
export default function setupGulp(originalExports: any) {
    let context = GulpContext.fromArguments();
    let gulpTasks = getGulpTasks(context);
    for( var task in gulpTasks.allTasks ) originalExports[task] = task;
    originalExports.default = (done: (error?: Error) => void) => {
        console.info('There is no default task');
        done();
        process.exit(0);
    }
}
