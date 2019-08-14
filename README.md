# Game Asset Loader
Game asset loader for HTML5 games with gracefull fallbacks.

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
```js
    loadSound('mySound', 'mySoundURL')
    .then(sound => {
        // loaded sound object { type: 'sound', key: 'mySound', value: audioBuffer }
    })
```
### Load a font
```js
    loadFont('myFont', 'GoogleFontName')
    .then(font => {
        // loaded sound object { type: 'font', key: 'myFont', value: fontFamilyName }
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

Sound: silent sound & console warning

## Develop
Run ```npm start``` and open localhost:1234 in a browser.

[tape](https://github.com/substack/tape) + [tape-dom](https://github.com/gritzko/tape-dom) are used for easy testing on various mobile devices.