/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import rimraf from 'rimraf';
import gulp from 'gulp';
import {TaskFunction} from 'undertaker';
import { GulpContext, createTask } from '../../internal';

export class CleanTasks {
    static cleanTasks: CleanTasks

    private _distributionCleanTask!: TaskFunction
    private _typeDefsCleanTask!: TaskFunction
    private _testsCleanTask!: TaskFunction
    private _cleanTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get distributionCleanTask() {
        if (this._distributionCleanTask === undefined) {
            this._distributionCleanTask = createTask(this._context, 'distribution-clean', workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => rimraf(projectSources.outputFolder!, error => done(error));
            });
        }

        return this._distributionCleanTask;
    }

    get typeDefsCleanTask() {
        if (this._typeDefsCleanTask === undefined) {
            this._typeDefsCleanTask = createTask(this._context, 'ts-clean', workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => projectSources.declarationFilesGlobs.forEach(glob => rimraf(glob, error => done(error)));
            });
        }
    
        return this._typeDefsCleanTask;
    }

    get testsCleanTask() {
        if (this._testsCleanTask === undefined) {
            this._testsCleanTask = createTask(this._context, 'test-clean', workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => rimraf(projectSources.compiledTestsGlobs!, error => done(error));
            });
        }
    
        return this._testsCleanTask;
    }
    get cleanTask() {
        if (this._cleanTask === undefined) {
            let task = gulp.parallel(this.distributionCleanTask, this.typeDefsCleanTask);
            task.displayName = 'clean'
            this._cleanTask = createTask(this._context, 'clean', workspace => gulp.parallel(this.distributionCleanTask, this.typeDefsCleanTask));
        }
    
        return this._cleanTask;
    }

    get allTasks() {
        return [this.cleanTask, this.testsCleanTask, this.typeDefsCleanTask, this.distributionCleanTask];
    }
}

export function getCleanTasks(context: GulpContext) {
    if (CleanTasks.cleanTasks === undefined) CleanTasks.cleanTasks = new CleanTasks(context);
    return CleanTasks.cleanTasks;
}