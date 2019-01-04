const array = 'array';
const string = 'string';
const number = 'number';

module.exports = {
    "labelToTag": {
        "song": {
            "artists": "TPE1",
            "composers": "TCOM",
            "genres": "TCON",
            "title": "TIT2",
            "number": "TRCK",
            "duration": "TLEN"
        },
        "album": {
            "title": "TALB",
            "artist": "TPE2",
            "disc": "TPOS",
            "release-date": "TDAT",
            "release-year": "TYER"
        },
        "conductor": "TPE3",
        "remixed-by": "TPE4",
        "publisher": "TPUB",
        "key": "TKEY",
        "media-type": "TMED",
        "isrc": "TSRC",
        "copyright": "TCOP",
        "commercial": "WCOM",
        "legal": "WCOP",
        "bpm": "TBPM",
        "webpage": {
            "artist": "WOAR",
            "audio-file": "WOAF",
            "audio-source": "WOAS",
            "internet-radio": "WORS",
            "publisher": "WPUB"
        },
        "payment": "WPAY",
        "cover": {
            "other": 0,
            "icon-file": 1,
            "icon-other": 2,
            "front": 3,
            "back": 4,
            "leaflet": 5,
            "media": 6,
            "soloist": 7,
            "artist": 8,
            "conductor": 9,
            "group": 10,
            "composer": 11,
            "lyricist": 12,
            "location": 13,
            "recording": 14,
            "performance": 15,
            "video-capture": 16,
            "fish": 17,
            "illustration": 18,
            "logo-artist": 19,
            "logo-publisher": 20
        }
    },
    "tagTypes": {
        "TPE1": array,
        "TCOM": array,
        "TCON": array,
        "TIT2": string,
        "TALB": string,
        "TPE2": string,
        "TPE3": string,
        "TPE4": string,
        "TRCK": string,
        "TPOS": string,
        "TPUB": string,
        "TKEY": string,
        "TMED": string,
        "TSRC": string,
        "TCOP": string,
        "WCOM": string,
        "WCOP": string,
        "WOAF": string,
        "WOAR": string,
        "WOAS": string,
        "WORS": string,
        "WPAY": string,
        "WPUB": string,
        "TDAT": string,
        "TLEN": number,
        "TYER": number,
        "TBPM": number
    }
}