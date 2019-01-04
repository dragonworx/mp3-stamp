#!/usr/bin/env node

const mp3Stamp = require('../lib/index.js');
const basePath = process.argv[2];
mp3Stamp(basePath);