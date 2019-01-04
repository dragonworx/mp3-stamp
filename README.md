# MP3 Stamp

A small command-line utility to automate writing mp3 tags to mp3 audio files.

For music content creators, generating new mp3 files is a common routine. Opening those fresh files in iTunes or any other media applications simply to edit tags and apply a cover can be a tedious and repeditive task. Especially if you are regenerating the file after changes.

mp3-stamp lets you create a small `.json` file which contains all the tag info you want to write. Keep that file next to your audio file and just run this tool (globally) to apply the tags easily.

## Usage

Image we have an audio project folder called `my-audio-project` and inside is a new mp3 file called `my-song.mp3`.

Install the tool globally to be able to use the `mp3-stamp` command via the terminal from any location *.

```
npm install mp3-stamp -g
```

*\* you may need to restart the terminal to be able to use the new global `mp3-stamp` global command from your path*

Now in the same folder as your mp3 audio file, create a new  file with the same mp3 filename, but with `.json` added to end.

```
cd my-audio-project
touch my-song.mp3.json
```

Configure the tags you need *(See "Tag Configuration" section below)* then run the `mp3-stamp` tool and select the mp3 file and json file when prompted.

```
mp3-stamp
```

You will be asked to select the mp3 file, and the json configuration file in the current path.

If you wish to specify the base path from a different folder, you can pass it as an argument to the `mp3-stamp` command.

```
mp3-stamp ../../my-other-audio-project
```

The mp3 file will then be overwritten with a new mp3 file containing all configured tags (including cover if given).

## Tag Configuration

The `.json` configuration file is just a simple json file with some top level keys, and other grouped keys. The grouped keys are `song`, `album`, `webpage`, and `cover`. This helps organise tags by context.

Here is a list of all the supported tags and their expected types *- **Note** you can just specify `null` for any tags you don't want to specify, but want to leave in the file for reference (eg. you are copying a base template to make new configuration files).*

* `song.artists` *string[]*
* `song.composers` *string[]*
* `song.genres` *string[]*
* `song.title` *string*
* `song.number` *string*
* `song.duration` *integer* - (ms)
* `album.title` *string*
* `album.artist` *string*
* `album.disc` *string* - ("1" or "1/3")
* `album.release-date` *string* - (DDMM)
* `album.release-year` *integer* - (YYYY)
* `conductor` *string* (conductor/performer refinement)
* `remixed-by` *string* (interpreted, remixed, or otherwise modified by)
* `key` *string* - (eg. "Dm", "Eb")
* `media-type` *string*
* `isrc` *string* (international standard recording code)
* `copyright` *string* (copyright message)
* `commercial` *string* (commercial information)
* `legal` *string* (copyright/Legal information)
* `bpm` *integer* (beats per minute)
* `payment` *string*
* `webpage.artist` *string* (official artist/performer webpage)
* `webpage.audio-file` *string* (official audio file webpage)
* `webpage.audio-source` *string* (official audio source webpage)
* `webpage.internet-radio` *string* (official internet radio station homepage)
* `webpage.publisher` *string* (publishers official webpage)
* `cover.*` *string* - (relative or absolute jpg file path)
* `cover.other`
* `cover.icon-file` - (32x32 pixels 'file icon' PNG only)
* `cover.icon-other` - (Other file icon)
* `cover.front` - (main cover image used by most media applications like iTunes etc)
* `cover.back`
* `cover.leaflet`
* `cover.media` - (e.g. lable side of CD)
* `cover.soloist` - (Lead artist/lead performer/soloist)
* `cover.artist` - (Artist/performer)
* `cover.conductor`
* `cover.group` - (Band/Orchestra)
* `cover.composer`
* `cover.lyricist` - (Lyricist/text writer)
* `cover.location` - (Recording Location)
* `cover.recording` - (During recording)
* `cover.performance` - (During performance)
* `cover.video-capture` - (Movie/video screen capture)
* `cover.fish` - (A bright coloured fish)
* `cover.illustration`
* `cover.logo-artist` - (Band/artist logotype)
* `cover.logo-publisher` - (Publisher/Studio logotype)

This npm package contains a file in the root named `template.mp3.json`. It contains all available tags for reference and has example values for the most common. It also assumes you have `cover.jpg` in the same folder as the mp3 and config. You can delete any unused tags you, or just leave them `null`.

Here is an example:

```
{
    "song": {
        "artists": ["song-artist-1", "song-artist-2"],
        "composers": ["song-composer-1", "song-composer-2"],
        "genres": ["song-genre-1", "song-genre-2"],
        "title": "song-title",
        "number": "1/6",
        "duration": 1000
    },
    "album": {
        "title": "album-title",
        "artist": "albumn-artist",
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