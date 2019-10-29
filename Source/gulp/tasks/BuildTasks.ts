/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import {TaskFunction} from 'undertaker';
import {GulpContext, createTask, getCleanTasks} from '../../internal'
import { Readable } from 'stream';


export class BuildTasks {
    static buildTasks: BuildTasks

    private _buildTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get buildTask() {
        if (this._buildTask === undefined) {
            // DOES NOT WORK WHEN BUILDING IN PARALLELL, PROBABLY BECAUSE OF FILE OUTPUT
            // this._buildTask = gulp.series(getCleanTasks(this._context).cleanTask, 
            //     createTask(this._context, 'ts-build', true, workspace => {
            //         let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
            //         let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
            //         return done => {
            //             let tsResult = tsProject.src()
            //                 .pipe(gulpSourcemaps.init())
            //                 .pipe(tsProject());
            //             tsResult.dts
            //                 .pipe(gulp.dest(projectSources.outputFolder!));
            //             return tsResult.js
            //                 .pipe(gulpSourcemaps.write())
            //                 .pipe(gulp.dest(projectSources.outputFolder!))
            //                 .on('end', done);
            //         };
            //     })
            // );
            this._buildTask = this.createBuildTask();
        }

        return this._buildTask;
    }


    get allTasks() {
        return [this.buildTask];
    }
    
    private createBuildTask() {
        let task: TaskFunction
        if (this._context.project.workspaces.length > 0) {
            task = gulp.series(getCleanTasks(this._context).cleanTask, this.createWorkspacesBuildTask());
        }
        else {
            let projectSources = this._context.project.sources;
            let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
            let taskFunction: TaskFunction = done => {
                let tsResult = tsProject.src()
                    .pipe(gulpSourcemaps.init())
                    .pipe(tsProject());
                tsResult.dts
                    .pipe(gulp.dest(projectSources.outputFolder!));
                return tsResult.js
                    .pipe(gulpSourcemaps.write())
                    .pipe(gulp.dest(projectSources.outputFolder!))
                    .on('end', _ => done())
                    .on('error', err => done(err));
            };
            task = gulp.series(getCleanTasks(this._context).cleanTask, taskFunction);
                
        }
        task.displayName = 'build';
        return task;
    }

    private createWorkspacesBuildTask() {
        let tasks: TaskFunction[] = [];
        let streams: {stream: Readable, dest: string}[] = [];

        this._context.project.workspaces.forEach(workspace => {
            let projectSources = workspace.sources;
            let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
            let taskFunction: TaskFunction = done => {
                let tsResult = tsProject.src()
                    .pipe(gulpSourcemaps.init())
                    .pipe(tsProject());
                    
                streams.push({stream: tsResult.js, dest: projectSources.outputFolder!});
                streams.push({stream: tsResult.dts, dest: projectSources.outputFolder!});
                tsResult
                    .on('end', _ => done())
                    .on('error', err => done(err));
                return tsResult;
            };
            taskFunction.displayName = `build:${workspace.workspacePackage.packageObject.name}`;
            tasks.push(taskFunction);
        });
        let writeFilesTask: TaskFunction = done => {
            let counter = 0;
            for (let _ of streams) {
                let stream = _.stream
                    .pipe(gulp.dest(_.dest))
                    .on('end', _ => {
                        counter += 1;
                        if (counter === streams.length) done();
                    })
                    .on('error', err => done(err));
            }
        };
        writeFilesTask.displayName = 'build-write-files';
        let task = gulp.series(gulp.parallel(tasks), writeFilesTask);
        return task;
    }
}

export function getBuildTasks(context: GulpContext) {
    if (BuildTasks.buildTasks === undefined) BuildTasks.buildTasks = new BuildTasks(context);
    return BuildTasks.buildTasks;
}