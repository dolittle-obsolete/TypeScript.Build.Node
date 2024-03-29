/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import rimraf from 'rimraf';
import {TaskFunction} from 'undertaker';
import toUnixPath from 'slash';
import { GulpContext, createTask } from '../../internal';

export class CleanTasks {
    static cleanTasks: CleanTasks

    private _testsCleanTask!: TaskFunction
    private _cleanTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get cleanTask() {
        if (this._cleanTask === undefined) {
            this._cleanTask = createTask(this._context, 'clean', true,  workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => rimraf(projectSources.outputFolder!, error => done(error));
            });
        }

        return this._cleanTask;
    }


    get testsCleanTask() {
        if (this._testsCleanTask === undefined) {
            this._testsCleanTask = createTask(this._context, 'test-clean', true, workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => rimraf(`${toUnixPath(projectSources.outputFolder!)}/**/for_*`, error => done(error));
            });
        }
    
        return this._testsCleanTask;
    }
    get allTasks() {
        return [this.cleanTask, this.testsCleanTask];
    }
}

export function getCleanTasks(context: GulpContext) {
    if (CleanTasks.cleanTasks === undefined) CleanTasks.cleanTasks = new CleanTasks(context);
    return CleanTasks.cleanTasks;
}