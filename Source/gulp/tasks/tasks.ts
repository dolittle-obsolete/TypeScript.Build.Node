/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { GulpContext } from '../../internal'

class GulpTasks {
    static gulpTask: GulpTasks
    
    constructor(private _gulpContext: GulpContext) {
                
    }
}

export function getGulpTasks(gulpContext: GulpContext) {
    if (!GulpTasks.gulpTask) GulpTasks.gulpTask = new GulpTasks(gulpContext);
    return GulpTasks.gulpTask
}