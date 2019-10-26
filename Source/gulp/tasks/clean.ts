/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import rimraf from 'rimraf';
import gulp from 'gulp';
import { GulpContext } from '../../internal';
import Undertaker from 'undertaker';

class CleanTasks {
    static cleanTasks: CleanTasks

    private _libCleanTask!: Undertaker.TaskFunction
    private _typeDefsCleanTask!: Undertaker.TaskFunction
    private _testsCleanTask!: Undertaker.TaskFunction
    private _cleanTask!: Undertaker.TaskFunction

    constructor(private _context: GulpContext) {}

    get libCleanTask() {
        if (!this._libCleanTask) {
            let config = this._context.config;
            let task: Undertaker.TaskFunction = (done:any) => {
                rimraf(config.libFolder, (error) => {
                    done(error);
                });
            };
            task.displayName = 'lib-clean'
            this._libCleanTask = task;
        }

        return this._libCleanTask;
    }

    get typeDefsCleanTask() {
        if (!this._typeDefsCleanTask) {
            let config = this._context.config;
            let task: Undertaker.TaskFunction = (done:any) => {
                rimraf(config.rootFolder, (error) => {
                    done(error);
                });
            };
            task.displayName = 'ts-clean'
            this._typeDefsCleanTask = task;
        }
    
        return this._typeDefsCleanTask;
    }

    get testsCleanTask() {
        if (!this._testsCleanTask) {
            let config = this._context.config;
            let task: Undertaker.TaskFunction = (done:any) => {
                rimraf(`${config.libFolder}/**/for_`, (error) => {
                    done(error);
                });
            };
            task.displayName = 'test-clean'
            this._testsCleanTask = task;
        }
    
        return this._testsCleanTask;
    }
    get cleanTask() {
        if (!this._cleanTask) {
            let config = this._context.config;
            let task = gulp.parallel(this.libCleanTask, this.typeDefsCleanTask);
            task.displayName = 'clean'
            this._cleanTask = task;
        }
    
        return this._cleanTask;
    }
}
/**
 * Factory for creating the clean task
 * @param {Context} context Current build context 
 * @returns {Function} The task
 */
export function getCleanTask(context: GulpContext) {
    let config = context.config;
    let task: gulp.TaskFunction = (done:any) => {
        rimraf(config.libFolder, (error) => {
            done(error);
        });
    };
    task.displayName = 'clean'
    return task;
}

export getAllCleanTasks()