// const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const cli = require('cli-color');
const prompts = require('prompts');
const emojic = require('emojic');
const ID3Writer = require('browser-id3-writer');
const { labelToTag, tagTypes } = require('./mappings');
const state = {
    writer: null,
    mp3Path: null,
    mp3Buffer: null,
    options: {},
    batchFiles: null,
};

function error(message) {
    console.error(cli.bold.red(`\n${emojic.x}  ${message}\n`));
    process.exit(-1);
}

function done() {
  console.log(cli.bold.green(`\n${emojic.whiteCheckMark}  Done.\n`));
  process.exit(0);
}

function abort() {
  console.log(cli.cyan(`\n${emojic.door}  Aborted.\n`));
  process.exit(0);
}

function loadConfig() {
  const mp3Path = state.mp3Path;
  if (!fs.existsSync(mp3Path)) {
      error(`mp3 path not found "${mp3Path}"`);
  }
  state.mp3Buffer = fs.readFileSync(path.resolve(mp3Path));
  try {
    state.writer = new ID3Writer(state.mp3Buffer);
  } catch (e) {
      error(`Could not read mp3 file "${mp3Path}"`);
  }
  const configPath = `${mp3Path}.json`;
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
                const coverPath = path.resolve(state.basePath, config.cover[key]);
                const coverBuffer = fs.readFileSync(coverPath);
                state.writer.setFrame('APIC', {
                    type: expectedCoverType,
                    data: coverBuffer,
                    description: `${key} cover`
                });
                if (!state.batchFiles) {
                  console.log(cli.cyan(`${emojic.sparkles}  Writing "${key}" cover -> ${path.relative('.', coverPath)}`));
                }
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
                if (prefix === 'album' && tagName === 'release-date') {
                    value = parseInt(value);
                }
                state.writer.setFrame(tagName, value);
                if (!state.batchFiles) {
                  console.log(cli.cyan(`${emojic.sparkles}  Writing ${tagType} tag "${tagName}" (${tagLabel}) -> ${JSON.stringify(value)}`));
                }
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
        if (state.options.batch) {
          console.log(cli.cyan(`${emojic.sparkles}  File written successfully -> "${path.relative('.', state.mp3Path)}" written successfully`));
          nextBatchFile();
        } else {
          done();
        }
    } catch (e) {
        error(`Cannot write file "${state.mp3Path}" (${e.message})`);
    }
}

function getFilesByType(basePath, extension) {
  const files = fs.readdirSync(basePath);
  const matchedFiles = [];
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    if (filename.match(`${extension}$`)) {
      matchedFiles.push({ filename: filename, fullPath: path.resolve(state.basePath, filename) });
    }
  }
  return matchedFiles;
}

async function selectFile(label, extension, allowNone) {
    const choices = getFilesByType(state.basePath, extension).map(file => ({ title: file.filename, value: file.fullPath }));
    if (choices.length === 0) {
        if (allowNone) {
            return null;
        }
        console.log(cli.bold.yellow(`No *${extension} files found at path "${path.resolve(state.basePath)}"`));
        console.log(cli.bold.cyan(`Try running from different path or specifying basePath as sole argument:`));
        console.log(cli.cyan(`> mp3stamp "./my-base-path".`));
        process.exit(0);
    }
    const choice = await prompts([
        {
          type: 'select',
          name: 'selection',
          message: `Which ${label}? (*${extension})`,
          choices,
        }
      ]);
    return choice.selection
}

async function create() {
  const { mp3Path } = state;
  const filename = path.basename(mp3Path, '.mp3');
  const artist = filename.match(/(.*) *-/);
  const title = filename.match(/- *(.*)/);
  const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'template.mp3.json')).toString());
  const info = await prompts([
      {
          type: 'text',
          name: 'title-song',
          message: 'Song Title',
          initial: title ? title[1] : filename,
      },
      {
          type: 'text',
          name: 'title-album',
          message: 'Album Title',
          initial: title && artist ? `${title[1]} - ${artist[1]}` : filename,
      },
      {
          type: 'list',
          name: 'artists-song',
          message: '',
          initial: artist ? artist[1] : '',
          onRender (kleur) {
              this.msg = 'Song Artist(s) ' + kleur.cyan('(comma separated if multiple)');
          }
      },
      {
          type: 'text',
          name: 'artist-album',
          message: 'Album Artist',
          initial: (prev, values) => artist ? artist[1] : values['artists-song'].shift(),
      },
      {
          type: 'list',
          name: 'genres',
          message: '',
          initial: '',
          onRender (kleur) {
              this.msg = 'Genres ' + kleur.cyan('(comma separated if multiple)');
          }
      }, 
  ]);

  if (Object.keys(info).length < 5) {
      abort();
  }
  
  const coverPath = await selectFile('cover (front) file', '.jpg', true);
  if (coverPath) {
      config.cover.front = path.basename(coverPath);
  }
  config.song.title = info['title-song'];
  config.song.artists = info['artists-song'];
  config.song.composers = info['artists-song'];
  config.song.genres = info['genres'];
  config.album.title = info['title-album'];
  config.album.artist = info['artist-album'];
  const d = new Date();
  const day = `${d.getDate()}`.padStart(2, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  config.album['release-date'] = `${day}${month}`;
  config.album['release-year'] = d.getFullYear();
  const newConfigPath = path.resolve(state.basePath, `${mp3Path}.json`);
  fs.writeFileSync(newConfigPath, JSON.stringify(config, null, 4));
  console.log(cli.green(`\n"${path.basename(mp3Path)}.json" created successfully.\n`));

  const { apply } = await prompts({
    type: 'confirm',
    name: 'apply',
    message: `Do you want to apply info to mp3 now?`,
    initial: true,
  });

  if (apply) {
    delete state.options.create;
    main(mp3Path)
  } else {
    done();
  }
}

async function batch() {
  const files = getFilesByType(state.basePath, '.mp3.json');
  state.batchFiles = files.map(file => file.fullPath.replace('.json', ''));
  nextBatchFile();
}

function nextBatchFile() {
  const file = state.batchFiles.pop();
  if (!file) {
    done();
  } else {
    state.mp3Path = file;
    loadConfig(); 
  }
}

async function main(mp3Path) {
  if (!mp3Path) {
    mp3Path = await selectFile('mp3 file', '.mp3');
    if (mp3Path === undefined) {
        abort();
    }
  }

  state.mp3Path = mp3Path;
  
  if (state.options.create) {
    create();
    return;
  }
  
  loadConfig();
}

module.exports = function mp3Stamp(basePath, options) {
    state.basePath = basePath || '.';
    state.options = options;

    if (state.options.batch) {
      batch();
    } else {
      main();
    }
};