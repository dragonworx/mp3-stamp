#!/usr/bin/env node
const cli = require('cli-color');
const commandLineArgs = require('command-line-args');
const emojic = require('emojic');
const { version } = require('../package.json')
const mp3Stamp = require('../lib/index.js');

const optionDefinitions = [
  { name: 'create', alias: 'c', type: Boolean },
  { name: 'batch', alias: 'b', type: Boolean },
  { name: 'basePath', type: String, multiple: false, defaultOption: true },
];

console.log(cli.magenta(`\nmp3 stamp v${version} ${emojic.dvd}\n`));

try {
    const options = commandLineArgs(optionDefinitions);
    mp3Stamp(options.basePath, options);
} catch (e) {
    console.log(cli.bold.red('Invalid options.\n'));
    console.log(cli.bold.cyan('Usage:\n'));
    console.log(cli.cyan('> mp3stamp [basePath] [--create | --batch]\n'));
    console.log(cli.whiteBright('basePath\t') + cli.blackBright('relative or absolute path to working folder of mp3s and configs'));
    console.log(cli.whiteBright('--create (-c)\t') + cli.blackBright('create a new config file and pre-populate with given data'));
    console.log(cli.whiteBright('--batch  (-b)\t') + cli.blackBright('stamp all config files in current folder (looks for mp3 with same name)\n'));
    process.exit(-1);
}