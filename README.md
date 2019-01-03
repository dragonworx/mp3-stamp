# MP3 Stamp

A small command-line utility to automate writing mp3 tags to mp3 audio files.

For music content creators, generating new mp3 files is a common routine. Opening those fresh files in iTunes or any other media applications simply to edit tags and apply a cover can be a tedious and repeditive task. Especially if you are regenerating the file after changes.

mp3-stamp lets you create a small `.json` file which contains all the tag info you want to write. Keep that file next to your audio file and just run the tool to apply the tags easily.

## Usage

Image we have an audio project folder called `my-audio-project` and inside is a new mp3 file called `my-song.mp3`.

Install the tool globally, to be able to use the `mp3-stamp` command via the terminal from any location *.

```
npm install mp3-stamp -g
```

*\* you may need to restart the terminal to be able to use the new global `mp3-stamp` global command*

Now in the same folder as your mp3 audio file, create a new  file with the same mp3 filename, but with `.json` added to end.

```
cd my-audio-project
touch my-song.mp3.json
```

Configure the tags you need *(See next section)* then run the `mp3-stamp` tool and point it at your mp3 file.

```
mp3-stamp my-song.mp3
```

You can ommit the mp3 extension from the filename if you like, for example:

```
mp3-stamp my-song
```

The mp3 file will be overwritten with a new mp3 file containing all confitured tags (including cover if given).

## Tag Configuration

This package contains a file in the root named `example.json`. It contains all available tags for reference. You can delete tags you are not interested in, however you cannot provide unsupported tags, or use incorrect tag types for values.