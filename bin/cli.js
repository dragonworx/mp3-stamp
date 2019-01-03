#!/usr/bin/env node

const mp3Stamp = require('../lib/index.js');
const cli = require('cli-color');
const mp3Path = process.argv[2];
if (typeof mp3Path !== 'string') {
    console.error(cli.bold.red('❌  mp3 stamp requires path to mp3, with expected .json file in same location'));
    process.exit(-1);
}
mp3Stamp(mp3Path);