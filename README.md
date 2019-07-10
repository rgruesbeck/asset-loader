# Game Asset Loader
Game asset loader for HTML5 games.
## Install
```sh
npm install --save game-asset-loader
```
## Usage
### Load an image
```js
    loadImage('myImage', 'myImageURL')
    .then(image => {
        // loaded image object { type: 'image', key: 'myImage', value: imgNode }
    })
```
### Load a sound
returns an audio buffer
```js
    loadSound('mySound', 'mySoundURL')
    .then(sound => {
        // loaded sound object { type: 'image', key: 'myImage', value: audioBuffer }
    })
```
### Load a font
loads a google font
```js
    loadFont('myFont', 'GoogleFontName')
    .then(font => {
        // loaded sound object { type: 'image', key: 'myImage', value: audioBuffer }
    })
```
### Load List
```js
 loadList(
    [
        loadImage('myImage', 'myImageURL'),
        loadSound('mySound', 'mySoundURL'),
        loadFont('myFont', 'GoogleFontName')
    ],
    (progress) => {
        // progress { percent: number, loaded: { type: type, key: key } }
        console.log(`${progress}% Loading...`);
    })
    .then((assets) => {
        // loaded assets { image: [images], sound: [sounds], font: [fonts] }
    })
    .catch(err => console.error(err));
```
## Fallbacks
Images (optional): transparent image placeholder (game code can remain unchanged)
Images (required): image not found image (visual feedback that an image is missing)
Sound: silent sound & console error

## Develop
Run ```npm start``` and open localhost:1234 in a browser.
[tape](https://github.com/substack/tape) + [tape-dom](https://github.com/gritzko/tape-dom) are used for easy testing on various mobile devices.


## Change Log
- 0.0.3 fix audio buffer fallback for safari
- 0.0.2 add flag for browsers not supporting image.decode
- 0.0.1 initial version