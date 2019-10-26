/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import yargs from 'yargs';
import path from 'path';

/**
 * Represents the configuration for the build
 */
export class GulpConfig {

    /**
     * Initializes a new instance of {GulpConfig}
     * @param {string} rootFolder 
     */
    constructor(private _rootFolder: string) {
        this._rootFolder = path.resolve(this._rootFolder);
        console.log(`Using root : '${this._rootFolder}'`);       
    }
    /**
     * Get the root folder in which we're building
     */
    get rootFolder() {
        return this._rootFolder;
    }

    /**
     * Get the lib folder that will serve as output from the build
     */
    get libFolder() {
        return `${this.rootFolder}/lib`;
    }


    /**
     * Get {Config} - if not root is specified, it will try to resolve it from CLI arguments
     * @param {string|undefined|null} [root] Optional root
     */
    static get(root?: string ) {
        if (!root) return GulpConfig.fromArguments();
        else return new GulpConfig(root);
    }

    /**
     * Create an instance of {Config} based on CLI arguments
     */
    static fromArguments(): GulpConfig {
        let root = yargs.argv.root as string;
            
        if (!root || root == '') {
            console.info("Missing root - run 'gulp' with --root [relative folder]");
            process.exit(0);
        }
        return new GulpConfig(root);
    }
}