# Game Asset Loader
Game asset loader for HTML5 games.
## Install
```sh
npm install --save game-asset-loader
```
## Usage
### Load an image
```js
    loadImage('myImage', 'myImageURL'),
```
### Load a sound
```js
    loadSound('mySound', 'mySoundURL'),
```
### Load a font
```js
    loadFont('myFont', 'GoogleFontName')
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
        console.log(`${progress}% Loading...`);
    })
    .then((assets) => {
        // loaded assets
    })
    .catch(err => console.error(err));
```
## Develop
Run ```npm start``` and open localhost:1234

## Change Log
- 0.0.2 add flag for browsers not supporting image.decode