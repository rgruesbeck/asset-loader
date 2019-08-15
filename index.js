/**
 * 
 *   Asset loading functions
 * 
 */

import audioContext from 'audio-context';
import audioBufferLoader from 'audio-loader';
import WebFont from 'webfontloader'

import { createBase64Image } from './utils.js';
import { blankImage, defaultImage } from './placeholders.js';

const loadList = (list, progress) => {
    // calculate loading progress
    let i = 0;
    progress({ percent: 0, loaded: null });
    for (let i = 0; i < list.length; i += 1) {
        list[i].then((asset) => {
            i++;
            progress({
                percent: Math.floor(i * 100 / list.length),
                loaded: { type: asset.type, key: asset.key }
            })
        });
    }

    return Promise.all(list)
        .then((assets) => {
            return assets.reduce((collection, asset) => {
                // separate assets by type
                // add them to the collection

                const { type, key, value } = asset;

                const collectionIncludes = Object.keys(collection).includes(type);
                if (!collectionIncludes) { collection[type] = {} }

                collection[type][key] = value;
                return collection;
            }, {});
        })
}

const loadImage = (key, url, opts = {}) => {
    return new Promise((resolve, reject) => {
        let { optional, params } = opts;

        // reject with error for missing key or url
        if (!key) { reject(new Error('key required')) }

        let image = new Image;
        image.crossOrigin = "Anonymous";
        image.src = [url, params].filter(i => i).join('?')

        // loaded
        image.onload = () => {
            // pre-decode so decoding will not block main thread
            // especially for large background images
            if (image.decode) {
                image.decode()
                .then(() => {
                    resolve({
                        type: 'image',
                        key: key,
                        value: image
                    });
                })
                .catch((err) => {
                    // decode error
                    console.warn(`Warning: could not pre-decode image '${key}' from '${url}'.`, err.path, `resolving with fallback`);
                    resolve({
                        type: 'image',
                        key: key,
                        value: optional && url === '' ?
                        createBase64Image(blankImage) :
                        createBase64Image(defaultImage)
                    });
                });
            } else {
                resolve({
                    type: 'image',
                    key: key,
                    value: image
                });
            }
        };

        // load error
        image.onerror = (err) => {
            if (!optional) {
                console.warn(`Warning: could not load image '${key}' from '${url}'.`, err.path, `resolving with fallback`);
            }

            resolve({
                type: 'image',
                key: key,
                value: optional && url === '' ?
                createBase64Image(blankImage) :
                createBase64Image(defaultImage)
            });
        };
    });

}

const loadSound = (key, url) => {
    let result = { type: 'sound', key: key, value: null };

    return new Promise((resolve, reject) => {
        // reject with error for missing key or url
        if (!key) { reject(new Error('key required')) }

        audioBufferLoader(url)
            .then((sound) => {
                resolve({
                    type: 'sound',
                    key: key,
                    value: sound
                });
            })
            .catch((err) => {
                // log an warning and resolve a silent audio buffer
                // previously created with new AudioBuffer (unsupported on safari)
                // note: sampleRate must also be 22050 to work on safari
                // value: new AudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: 8000 })
                console.warn(`Warning: could not load sound '${key}' from '${url}'.`, err, `resolving with fallback`);

                const audioCtx = audioContext()
                resolve({
                    type: 'sound',
                    key: key,
                    value: audioCtx.createBuffer(1, 1, 22050)
                })
                
            })
    });
}

const loadFont = (key, fontName, opts = {}) => {
    return new Promise((resolve, reject) => {
        let { fallback } = opts;

        // reject with error for missing key or url
        if (!key) { reject(new Error('key required')) }

        if (!fontName) { resolve({
            type: 'font',
            key: key,
            value: fallback || 'Arial'
        })}

        WebFont.load({
            google: {
                families: [fontName]
            },
            fontactive: familyName => {
                resolve({
                    type: 'font',
                    key: key,
                    value: familyName
                });
            },
            fontinactive: () => {
                resolve({
                    type: 'font',
                    key: key,
                    value: fallback || 'Arial'
                });
            }
        });
    });
}

export { loadList, loadImage, loadSound, loadFont };
