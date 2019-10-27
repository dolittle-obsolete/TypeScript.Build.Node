/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Project } from '@dolittle/typescript.build';
import yargs from 'yargs';
import fs from 'fs';
import log from 'fancy-log';

/**
 * Build context
 */
export class GulpContext {
    private _project: Project
    /**
     * Create an instance of {GulpContext} based on CLI arguments
     */
    static fromArguments() {
        let root = yargs.argv.root as string;
        return new GulpContext(root);
    }

    /**
     * Initializes a new instance of {GulpContext}
     * @param {Project} [_project] Optional root folder
     */
    constructor(rootFolder?: string) {
        if (rootFolder !== undefined) {
            if (!fs.existsSync(rootFolder) || !fs.statSync(rootFolder).isDirectory()) {
                throw new Error(`'${rootFolder}' is not a directory`); 
            }

            process.chdir(rootFolder);
            this._project = new Project(rootFolder);

        } else {

            process.chdir(process.env.PWD!);
            this._project = new Project(process.env.PWD);
        }
    }

    /**
     * Gets the {Project} that holds all the meta data for the current project
     *
     * @readonly
     */
    get project() {
        return this._project;
    }
}
