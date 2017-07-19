'use strict';

import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs-extra';

const $ = gulpLoadPlugins();

const platforms = [
    'samsung-legacy',
    'samsung-tizen'
];
const platformsRoot = path.resolve(__dirname, 'platforms');

/**
 * Task: Clean
 *
 * Cleans the vendor and src directories for each platform.
 * If directory does not exists – create it.
 */
gulp.task('clean', async () => {
    const destDirs = [
        'vendor',
        'src'
    ];
    const dirs = platforms.reduce((dirs, platform) => {
        return dirs.concat(
            destDirs.map((dest) => {
                return path.join(platformsRoot, platform, dest);
            })
        );
    }, []);

    for (const dir of dirs) {
        await fs.ensureDir(dir);
    }
});

/**
 * Task: Build
 * Subtask: Vendor
 *
 * Copy vendor libraries to platforms
 */
gulp.task('build:vendor', () => {

});

/**
 * Task: Build
 * Subtask: Src
 *
 * Copy application files.
 * Process css.
 * Inject config.
 */
gulp.task('build:src', () => {

});
