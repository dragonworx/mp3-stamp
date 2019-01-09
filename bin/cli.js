#!/usr/bin/env node
const cli = require('cli-color');
const commandLineArgs = require('command-line-args');
const mp3Stamp = require('../lib/index.js');
const optionDefinitions = [
    { name: 'create', alias: 'c', type: Boolean },
    { name: 'basePath', type: String, multiple: false, defaultOption: true },
  ];
try {
    const options = commandLineArgs(optionDefinitions);
    mp3Stamp(options.basePath, options.create);
} catch (e) {
    console.log(cli.bold.red('Invalid options, pass basePath and/or --create.'));
    console.log(cli.cyan('Usage examples:\n> mp3stamp "../../some-basePath"\n> mp3stamp --create\n> mp3stamp "../../some-basePath" --create'));
    process.exit(-1);
}