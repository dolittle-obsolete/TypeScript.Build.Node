/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Project } from "@dolittle/typescript.build";
import tsconfig from 'tsconfig';
import { WallabySetup } from "../../internal";

type WallabyFilePattern = string | {
    pattern: string, 
    instrument?: boolean, 
    ignore?: boolean
};

export type WallabySettingsCallback = (wallaby: any, settings: any) => void;

export class WallabySettings {
    private _files!: WallabyFilePattern[]
    private _tests!: WallabyFilePattern[]
    private _compilers!: any

    constructor(private _wallaby: any, private _project: Project, private _setup: WallabySetup, private  _settingsCallback?: WallabySettingsCallback) {
        this.createFiles();
        this.createTests();
        this.createCompilers();
    }

    get settings() {
        let settings = {
            files: this.files,
            tests: this.tests,
            compilers: this.compilers,
            setup: this._setup.setup,
            
            testFramework: 'mocha',
            env: {
                type: 'node',
                runner: 'node'
            },
        };
        if (typeof this._settingsCallback  === 'function') this._settingsCallback(this._wallaby, settings);
        return settings;
    }

    get files() {
        if (this._files === undefined) this.createFiles();
        return this._files;
    }

    get tests() {
        if (this._tests === undefined) this.createTests();
        return this._tests;
    }

    get compilers() {
        if (this._compilers === undefined) this.createCompilers();
        return this._compilers;
    }

    private createFiles() {
        this._files = [];
        this._files.push(...this.getBaseFiles());
        this._project.sources.declarationFilesGlobs.forEach(glob => this._files.push({pattern: glob, ignore: true}));
        this._project.sources.compiledFilesGlobs.forEach(glob => this._files.push({pattern: glob, ignore: true}));
        this._project.sources.testFileGlobs.forEach(glob => this._files.push({pattern: glob, ignore: true}));
        this._project.sources.testSetupFileGlobs.forEach(glob => this._files.push({pattern: glob, instrument: false}))
        this._project.sources.sourceFileGlobs.forEach(glob => this._files.push({pattern: glob}));
    }

    private createTests() {
        this._tests = [];

        this._project.sources.compiledFilesGlobs.forEach(glob => this._tests.push({pattern: glob, ignore: true}));
        this._project.sources.testSetupFileGlobs.forEach(glob => this._tests.push({pattern: glob, ignore: true}));
        this._project.sources.testFileGlobs.forEach(glob => this._tests.push({pattern: glob}));
    }

    private createCompilers() {
        this._compilers = {};
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(workspace => {
                workspace.sources.sourceFileGlobs.forEach(glob => {
                this._compilers[glob] = this._wallaby.compilers.typescript(tsconfig.loadSync(workspace.sources.tsConfig!).config);
                });  
            });
        } else {
            this._project.sources.sourceFileGlobs.forEach(glob => {
                this._compilers[glob] = this._wallaby.compilers.typescript(tsconfig.loadSync(this._project.sources.tsConfig!).config);
            });
        }
    }

    private getBaseFiles() {
        return [
            { pattern: '**/package.json', instrument: false},
            { pattern: `*/node_modules/**/*`, instrument: false},
            { pattern: 'node_modules/chai', instrument: false},
            { pattern: 'node_modules/chai-as-promised', instrument: false },
            { pattern: 'node_modules/sinon/pkg', instrument: false },
            { pattern: 'node_modules/sinon-chai', instrument: false },
            { pattern: 'node_modules/@dolittle/typescript.build', instrument: false }
        ];
    }
}