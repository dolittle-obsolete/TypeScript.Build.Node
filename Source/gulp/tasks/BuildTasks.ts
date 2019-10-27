/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import notify from 'gulp-notify';
import {TaskFunction} from 'undertaker';
import {GulpContext, Sources, createTask} from '../../internal'


export class BuildTasks {
    static buildTasks: BuildTasks

    private _buildTask!: TaskFunction
    private _typeDefsTask!: TaskFunction

    constructor(private _context: GulpContext, sources: Sources) {}

    get buildTask() {
    
        let compileSourcesTask: gulp.TaskFunction = (done: any) => {
            sources.sourceFiles(context.config)
                .on('error', (error: Error) => {
    
                })
                .pipe()
        };
        compileSourcesTask.displayName = 'build';
    
        let buildTask = gulp.series(
            getCleanTask(context),
            compileSourcesTask
        );
        return 
        
    }
    get typeDefsTask() {
        if (this._typeDefsTask === undefined) {
            this._typeDefsTask = createTask(this._context, 'ts-typedefs', workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                
            });
        }
    }
    get allTasks() {
        return [this.buildTask];
    }
    
}

export function getBuildTasks(context: GulpContext, sources: Sources) {
    if (BuildTasks.buildTasks === undefined) BuildTasks.buildTasks = new BuildTasks(context, sources);
    return BuildTasks.buildTasks;
}