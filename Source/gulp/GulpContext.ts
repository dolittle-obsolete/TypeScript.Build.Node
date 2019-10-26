/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { GulpConfig } from '../internal';


/**
 * Build context
 */
export class GulpContext {
    private _config!: GulpConfig;

    /**
     * Initializes a new instance of {Context}
     * @param {string|undefined|null} [root] Optional root
     */
    constructor(private _root?: string) {
    }

    /**
     * Get the current config object for the context
     * @returns {Config} The config object associated with the build context
     */
    get config() {
        if (!this._config ) this._config = GulpConfig.get(this._root);
        return this._config;
    }
}