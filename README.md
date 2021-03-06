# MP3 Stamp

> Simple command-line utility to automate applying tags and covers to mp3 files

For music content creators, generating new mp3 files is a common routine. Opening those fresh files in iTunes or any other media applications simply to edit tags and apply a cover can be a tedious and repeditive task. Especially if you are regenerating the file after changes.

mp3-stamp lets you create a small `.mp3.json` file which contains all the tag info you want to write (including specifying cover images). Keep that file next to your audio file and just run this tool (globally) to apply the tags quickly and easily.

## Use Case

Imagine we have an audio project folder called `my-audio-project` and inside is a new mp3 file called `my-song.mp3` that we generated from our favourite audio software (DAW). We want to add this to our music library, or share it but first we need tags and a cover. It may be ok to edit these tags and apply a cover in iTunes (or similar media app or tag editor), but if we overwrite this file (eg. making an updated version) we have to repeat this process through a UI over and over again. Instead, let's use a small `.mp3.json` file which lives in the same folder where we generate our mp3 file, and use that config file to specify the tags and cover, similar to a preset or defaults. Then every time we recreate the file, we just run this command line tool and apply the metadata.

Noice! Much quicker, less friction to our creation process. Just write those tags and set that cover like a boss.

## Installation

Install the tool globally to be able to use the `mp3stamp` command from the terminal at any location *.

```
npm install mp3-stamp -g
```

*\* you may need to restart your terminal to be able to use the `mp3stamp` command from any path after first install. If you get "Command not found..." type errors, this is likely the case.*

# Usage

To use this tool, just open up a terminal and run the `mp3stamp` command. The next few sections describe the options available.

![](img/mp3stamp-usage.jpg)

### **basePath**

By default this tool looks in the current working directory for `*.mp3` and `*.mp3.json` files.
If you wish to run the tool from a different directory, specify the base path as a relative or absolute path.

```
mp3-stamp ../../my-audio-project
```

### **--create**

If you want to create a config file for an mp3, just pass the `--create` option.
You can also use this argument with or without the basePath argument (eg. if you wish to create a config file in a different location to the current working directory).

```
mp3stamp --create
```

![](img/mp3stamp-create.gif)

This will ask you to pick an mp3 file from the current working (or base) path, and will ask some basic questions to prefill the most common tags. 
You can also pick a cover file if any are present. It will then create a template config from the same mp3 filename. 
You can open the file for edit to refine the tag data, and delete any unused tags you, or just leave them `null`.

You also have the option of applying the new data straight to mp3 file, if you don't need anymore editing.

You can of course manually create and edit the file and write the data you need (according to the schema described later).

**NOTE: If you are manually creating the config file then you must ensure the filename is the same as the mp3, but with a `.json` extension. The tool uses this convention to find files.**

### **--batch**

Passing this option will *stamp* (write info from `.json` file to `.mp3` file) all the `.mp3` files in the current directory. 
This is useful if you keep your mp3s in a common folder, such as a mixdowns folder. You can keep all your config files next to them and just overwrite the mp3 and run `mp3stamp --batch` to update all files at once.

```
mp3stamp --batch
```

## Stamping Tags

Given our example of a folder with an mp3 inside called `my-song.mp3` and a config file called `my-song.mp3.json`, open up a terminal and run the `mp3stamp` command.

```
mp3-stamp
```

You will be asked to select the mp3 file, and the config file matching the same mp3 filename plus `.json` will be selected for your tags and covers to be applied.

![](img/mp3stamp-stamp.gif)


#### Mp3 file naming convention

The tool supports the `<artist> - <title>.mp3` format. If files are named this way, the artist and title info will be prefilled when using the `--create` option.

## Tag Configuration

The `.json` configuration file is just a simple json file with some top level keys, and other grouped keys. The grouped keys are `song`, `album`, `webpage`, and `cover`. This helps organise tags by context.

Here is a list of all the supported tags and their expected types *- **Note** you can just specify `null` for any tags you don't want to specify, but want to leave in the file for reference (eg. you are copying a base template to make new configuration files).*

* **song.title** `string`
* **song.artists** `string[]`
* **song.composers** `string[]`
* **song.genres** `string[]`
* **song.number** `string`
* **song.duration** `integer` - (ms)
* **album.title** `string`
* **album.artist** `string`
* **album.disc** `string` - ("1" or "1/3")
* **album.release-date** `string` - (DDMM)
* **album.release-year** `integer` - (YYYY)
* **conductor** `string` (conductor/performer refinement)
* **remixed-by** `string` (interpreted, remixed, or otherwise modified by)
* **key** `string` - (eg. "Dm", "Eb")
* **media-type** `string`
* **isrc** `string` (international standard recording code)
* **copyright** `string` (copyright message)
* **commercial** `string` (commercial information)
* **legal** `string` (copyright/Legal information)
* **bpm** `integer` (beats per minute)
* **payment** `string`
* **webpage.artist** `string` (official artist/performer webpage)
* **webpage.audio-file** `string` (official audio file webpage)
* **webpage.audio-source** `string` (official audio source webpage)
* **webpage.internet-radio** `string` (official internet radio station homepage)
* **webpage.publisher** `string` (publishers official webpage)
* **cover.other**`string`
* **cover.icon-file** `string` - (32x32 pixels 'file icon' PNG only)
* **cover.icon-other** `string` - (Other file icon)
* **cover.front** `string` - (main cover image used by most media applications like iTunes etc)
* **cover.back** `string`
* **cover.leaflet** `string`
* **cover.media** `string` - (e.g. lable side of CD)
* **cover.soloist** `string` - (Lead artist/lead performer/soloist)
* **cover.artist** `string` - (Artist/performer)
* **cover.conductor** `string`
* **cover.group** `string` - (Band/Orchestra)
* **cover.composer** `string`
* **cover.lyricist** `string` - (Lyricist/text writer)
* **cover.location** `string` - (Recording Location)
* **cover.recording** `string` - (During recording)
* **cover.performance** `string` - (During performance)
* **cover.video-capture** `string` - (Movie/video screen capture)
* **cover.fish** `string` - (A bright coloured fish)
* **cover.illustration** `string`
* **cover.logo-artist** `string` - (Band/artist logotype)
* **cover.logo-publisher** `string` - (Publisher/Studio logotype)

Covers can be relative or absolute jpg file path (except for **cover.icon-file** which is PNG only).

Here is an example of a `*.mp3.json` config file:

```
{
    "song": {
        "title": "song-title",
        "artists": ["song-artist-1", "song-artist-2"],
        "composers": ["song-composer-1", "song-composer-2"],
        "genres": ["song-genre-1", "song-genre-2"],
        "number": "1/6",
        "duration": 1000
    },
    "album": {
        "title": "album-title",
        "artist": "album-artist",
        "disc": "1/1",
        "release-date": 1012,
        "release-year": 2019
    },
    "conductor": "conductor",
    "remixed-by": "remixed-by",
    "publisher": "publisher",
    "key": "Dm",
    "media-type": "media-type",
    "isrc": "isrc",
    "copyright": "copyright",
    "commercial": "commercial",
    "legal": "legal",
    "bpm": 100,
    "payment": "payment",
    "webpage": {
        "artist": "webpage-artist",
        "audio-file": "webpage-audio-file",
        "audio-source": "webpage-audio-source",
        "internet-radio": "webpage-internet-radio",
        "publisher": "webpage-publisher"
    },
    "cover": {
        "other": null,
        "icon-file": null,
        "icon-other": null,
        "front": "cover.jpg",
        "back": null,
        "leaflet": null,
        "media": null,
        "soloist": null,
        "artist": null,
        "conductor": null,
        "group": null,
        "composer": null,
        "lyricist": null,
        "location": null,
        "recording": null,
        "performance": null,
        "video-capture": null,
        "fish": null,
        "illustration": null,
        "logo-artist": null,
        "logo-publisher": null
    }
}
```
