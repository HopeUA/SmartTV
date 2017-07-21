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
        await fs.emptyDir(dir);
    }
});

/**
 * Task: Build
 * Subtask: Vendor
 *
 * Copy vendor libraries to platforms
 */
gulp.task('build:vendor', async () => {
    const libs = [
        {
            source: 'node_modules/tal/static/script/',
            dest: 'tal'
        },
        {
            source: 'node_modules/requirejs/require.js',
            dest: 'require.js'
        },
        {
            source: 'node_modules/i18n/i18n.js',
            dest: 'i18n.js'
        }
    ];

    const dirs = platforms.map((platform) => {
        return path.join(platformsRoot, platform, 'vendor');
    });

    for (const dir of dirs) {
        for (const lib of libs) {
            await fs.copy(
                path.resolve(__dirname, lib.source),
                path.join(dir, lib.dest)
            );
        }
    }
});

/**
 * Task: Build
 * Subtask: Src
 *
 * Copy application files.
 * Process css.
 * Inject config.
 */
gulp.task('build:src', async () => {

});
