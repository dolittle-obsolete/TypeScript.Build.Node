/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import gulpMocha from 'gulp-mocha';
import {TaskFunction} from 'undertaker';
import {GulpContext, createTask, getBuildTasks} from '../../internal'

export class TestTasks {
    static testTasks: TestTasks

    private _runTestsTask!: TaskFunction
    private _testTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get runTestsTask() {
        if (this._runTestsTask === undefined) {
            this._runTestsTask = createTask(this._context, 'test-run', false, workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => gulp.src(projectSources.compiledTestsGlobs.includes.concat(projectSources.sourceFileGlobs.excludes.map(_ => '!' + _)), {read: false})
                                .pipe(gulpMocha({reporter: 'spec', require: ['@dolittle/typescript.build/mocha.opts']}))
                                .on('end', done);
            });
        }
        return this._runTestsTask;
    }
    get testTask() {
        if (this._testTask === undefined) {
            this._testTask = gulp.series(
                getBuildTasks(this._context).buildTask, 
                this.runTestsTask
            );
            this._testTask.displayName = 'test';
        }
        return this._testTask;
    }

    get allTasks() {
        return [this.testTask, this.runTestsTask];
    }

}

export function getTestTasks(context: GulpContext) {
    if (TestTasks.testTasks === undefined) TestTasks.testTasks = new TestTasks(context);
    return TestTasks.testTasks;
}