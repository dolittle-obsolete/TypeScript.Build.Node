/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {TaskFunction} from 'undertaker';
import gulp from 'gulp';
import { GulpContext, getCleanTasks, getBuildTasks } from '../../internal';
import { YarnWorkspace } from '@dolittle/typescript.build';

class GulpTasks {
    static gulpTask: GulpTasks
    
    constructor(private _context: GulpContext) {}

    get cleanTasks() {
        return getCleanTasks(this._context);
    }

    get buildTasks() {
        return getBuildTasks(this._context);
    }

    get allTasks() {
        return [...this.cleanTasks.allTasks, ...this.buildTasks.allTasks];
    }
}

export function getGulpTasks(context: GulpContext) {
    if (GulpTasks.gulpTask === undefined) GulpTasks.gulpTask = new GulpTasks(context);
    return GulpTasks.gulpTask
}

export function createTask(context: GulpContext, taskName: string, createTaskCallback: (workspace?: YarnWorkspace) => TaskFunction) {
    let task: TaskFunction
    if (context.project.workspaces.length > 0) {
        let workspaceTasks: TaskFunction[] = [];
        context.project.workspaces.forEach(_ => {
            let workspaceTask = createTaskCallback(_);
            workspaceTask.displayName = `${taskName}:${_.workspacePackage.packageObject.name}`;
            workspaceTasks.push(workspaceTask);
        });
        task = gulp.parallel(workspaceTasks);
    }
    else {
        task = createTaskCallback();
        task.displayName = taskName;
    }

    return task;
}