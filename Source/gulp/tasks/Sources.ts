/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import { GulpConfig } from '../../internal';

class Sources {
    sourceFiles(config: GulpConfig) {
        let stream = gulp.src([
            `${config.rootFolder}/**/*.ts`,
        ], {
            base: config.rootFolder
        });
        return stream;
    }

    tests(config: GulpConfig) {
        let stream = gulp.src([
            `${config.rootFolder}/**/for_*/**/!(given)/*.ts`,
            `!${config.rootFolder}/for_*/*.ts`,
        ], {
            base: config.rootFolder
        });
        return stream;
    }


}
export const sources = new Sources();
