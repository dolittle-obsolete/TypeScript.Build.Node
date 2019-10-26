/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import {sources, GulpContext, getCleanTask} from '../../internal'

import notify from 'gulp-notify';

function getBuildTask(root: string) {
    let context = new GulpContext(root);

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

function getBuildTasksForAllWorkspaces(workspaces: string[]) {
    let workspacesTasks: gulp.TaskFunction[] = [];
    workspaces.forEach(workspace => {       
        let workspaceRoot = path.join(process.cwd(), workspace);
        let task = getBuildTask(workspaceRoot);
        task.displayName = `build:${workspace}`;
        workspacesTasks.push(task);
    });
    let task = gulp.parallel(workspacesTasks);
    task.displayName = 'build';
    return task;
}


function getBuildTasksForCurrentContext() {   
    let currentDirectory: string = process.env.PWD as string; // We want the actual startup directory. process.cwd() seems to be altered by Gulp and we get the directory for the gulpfile location, not where we started
    let currentPackagePath = path.join(currentDirectory, 'package.json');
    if( !fs.existsSync(currentPackagePath)) {
        console.error(`Couldn't find a 'package.json' in the current folder`);
        process.exit();
        return;
    }

    let pkg = JSON.parse(fs.readFileSync(currentPackagePath) as any);
    if( pkg.workspaces ) {
        console.info(`Building the following workspaces`);
        pkg.workspaces.forEach((workspace: string) => console.info(`==> ${workspace}`));
        return getBuildTasksForAllWorkspaces(pkg.workspaces);
    } else { 
        console.info(`Building based on package in current directory`);
        return getBuildTask(currentDirectory);
    }
}

export const build = getBuildTasksForCurrentContext();