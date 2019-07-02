import test from 'tape'
import domReporter from 'tape-dom'
domReporter(test) // setup DOM reporter

import { loadFont, loadImage } from  '../index.js'

// random string
const rand = () => Math.random().toString(16).slice(2)

// test image loader
test('image loader', (t) => {
    t.plan(4)

    const key = `imageKey!${rand()}`
    const url = `https://i.imgur.com/JchtoH4.png`
    const expected = {
        type: 'image',
        key: key,
        value: 
    };


    // loader is a function that returns a thenable
    t.equal(typeof loadImage, 'function', 'is a function');
    t.equal(typeof loadImage(key, url).then, 'function', 'returns a promise');

    // has correct type, key, and value
    loadImage(key, url)
    .then(actual => {
        t.deepEqual(actual, expected, 'resolves { type, key, value }')
    })

    // resolves with fallback value
    // for invalid fontName
})

// test font loader
test('font loader', (t) => {
    t.plan(4)

    const key = `fontKey!${rand()}`
    const fontName = `Lobster`
    const expected = {
        type: 'font',
        key: key,
        value: fontName
    };


    // loader is a function that returns a thenable
    t.equal(typeof loadFont, 'function', 'is a function');
    t.equal(typeof loadFont(key, fontName).then, 'function', 'returns a promise');

    // has correct type, key, and value
    loadFont(key, fontName)
    .then(actual => {
        t.deepEqual(actual, expected, 'resolves { type, key, value }')
    })

    // resolves with fallback value
    // for invalid fontName
    loadFont(key, `fontName!${rand()}`)
    .then(actual => {
        t.deepEqual(actual, {...expected, ...{ value: 'Arial' }}, 'resolves with fallback')
    })
})
