/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import {TaskFunction} from 'undertaker';
import {GulpContext, createTask, getCleanTasks} from '../../internal'


export class BuildTasks {
    static buildTasks: BuildTasks

    private _buildTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get buildTask() {
        if (this._buildTask === undefined) {
            this._buildTask = gulp.series(getCleanTasks(this._context).cleanTask, 
                createTask(this._context, 'ts-build', workspace => {
                    let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                    let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
                    return done => {
                        let tsResult = tsProject.src()
                            .pipe(gulpSourcemaps.init())
                            .pipe(tsProject());
                        
                        tsResult.js
                            .pipe(gulpSourcemaps.write())
                            .pipe(gulp.dest(projectSources.outputFolder!));
                        tsResult.dts
                            .pipe(gulp.dest(projectSources.outputFolder!));
                        done();
                    };
                })
            );
            this._buildTask.displayName = 'build';
        }

        return this._buildTask;
    }


    get allTasks() {
        return [this.buildTask];
    }
    
}

export function getBuildTasks(context: GulpContext) {
    if (BuildTasks.buildTasks === undefined) BuildTasks.buildTasks = new BuildTasks(context);
    return BuildTasks.buildTasks;
}