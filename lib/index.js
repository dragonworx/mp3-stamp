// const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const cli = require('cli-color');
const ID3Writer = require('browser-id3-writer');
const { version } = require('../package.json')
const { labelToTag, tagTypes } = require('./mappings');
const state = {
    writer: null,
    mp3Path: null,
    mp3Buffer: null,
};

function error(message) {
    console.error(cli.bold.red(`❌  ${message}`));
    process.exit(-1);
}

function loadConfig() {
    if (!fs.existsSync(state.mp3Path)) {
        error(`mp3 path not found "${state.mp3Path}"`);
    }
    state.mp3Buffer = fs.readFileSync(path.resolve(state.mp3Path));
    state.writer = new ID3Writer(state.mp3Buffer);
    const configPath = state.mp3Path + '.json';
    let config = null;
    try {
        const data = fs.readFileSync(path.resolve(configPath)).toString();
        config = JSON.parse(data);
    } catch (e) {
        error(`Could not load mp3 config file: "${configPath}"`);
    }
    processConfig(config);
}

function processConfig(config) {
    processConfigGroup(config, 'song');
    processConfigGroup(config, 'album');
    processConfigGroup(config, 'webpage');
    Object.keys(labelToTag).forEach(key => {
        if (typeof labelToTag[key] === 'string') {
            processTag(null, key, config[key]);
        }
    });
    processCovers(config);
    writeFile();
}

function processConfigGroup(config, groupName) {
    const group = config[groupName];
    if (group) {
        Object.keys(group).forEach(key => {
            processTag(groupName, key, group[key]);
        });
    }
}

function processCovers(config) {
    if (config.cover) {
        Object.keys(config.cover).forEach(key => {
            const expectedCoverType = labelToTag.cover[key];
            if (typeof expectedCoverType !== 'number') {
                error(`Invalid cover type "${key}"`);
            }
            if (typeof config.cover[key] === 'string') {
                const coverTypeValue = config.cover[key];
                const coverBuffer = fs.readFileSync(path.resolve(coverTypeValue));
                state.writer.setFrame('APIC', {
                    type: expectedCoverType,
                    data: coverBuffer,
                    description: `${key} cover`
                });
                console.log(cli.cyan(`✔️  Writing "${key}" cover -> ${coverTypeValue}`));
            }
        });
    }
}

function processTag(prefix, key, value) {
    const defObj = prefix ? labelToTag[prefix] : labelToTag;
    const tagName = defObj[key];
    const tagLabel = prefix ? prefix + '.' + key : key;
    const tagType = tagTypes[tagName];
    const valueType = getType(value);
    if (valueType !== 'empty') {
        if (tagType === valueType) {
            try {
                state.writer.setFrame(tagName, value);
                console.log(cli.cyan(`✔️  Writing ${tagType} tag "${tagName}" (${tagLabel}) -> ${JSON.stringify(value)}`));
            } catch (e) {
                error(`Failed to write tag "${tagLabel} - "${e.message}"`);
            }
        } else {
            error(`Invalid value for tag "${tagName}" (${tagLabel}) - expects ${tagType} but ${valueType} given`)
        }
    }
}

function getType(value) {
    if (value === null || value === undefined) {
        return 'empty';
    } else if (Array.isArray(value)) {
        return 'array';
    } else {
        return typeof value;
    }
}

function writeFile() {
    try {
        state.writer.addTag();
    } catch (e) {
        error(`Cannot add tag: "${e.message}`);
    }
    try {
        const taggedSongBuffer = Buffer.from(state.writer.arrayBuffer);
        fs.writeFileSync(state.mp3Path, taggedSongBuffer);
        console.log(cli.bold.green(`File written successfully -> ${state.mp3Path}`));
    } catch (e) {
        error(`Cannot write file "${state.mp3Path}" (${e.message})`);
    }
}

console.clear();

module.exports = function mp3Stamp(mp3Path) {
    state.mp3Path = mp3Path + (mp3Path.match(/\.mp3$/) ? '' : '.mp3');
    console.log(cli.magenta(`mp3 stamp v${version} 💽`))
    console.log(cli.white(`reading file "${state.mp3Path}"`))
    loadConfig();
};