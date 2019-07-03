import test from 'tape'
import domReporter from 'tape-dom'
domReporter(test) // setup DOM reporter

import { loadFont, loadImage } from  '../index.js'

// random string
const rand = () => Math.random().toString(16).slice(2)

// test image loader
test('image loader', (t) => {
    t.plan(9)

    // setup  image
    const key = `imageKey!${rand()}`
    const url = `https://i.imgur.com/JchtoH4.png`
    const img = new Image()
    img.src = url

    const expected = {
        type: 'image',
        key: key,
        value: img
    };

    // loader is a function that returns a thenable
    t.equal(typeof loadImage, 'function', 'is a function');
    t.equal(typeof loadImage(key, url).then, 'function', 'returns a promise');

    // has correct type, key, and value
    loadImage(key, url).then(actual => {

        t.deepEqual(actual, expected, 'resolves correct { type, key, value }')
        t.equal(actual.value.src, expected.value.src, 'url and src match')
    })

    // throws error for required args
    loadImage(undefined, url).then().catch(error => {
        t.equal(error instanceof Error, true, 'missing key returns error')
        t.equal(error.message, 'key required', 'missing key returns error message')
    })
    loadImage(key, undefined).then().catch(error => {
        t.equal(error instanceof Error, true, 'missing url returns error')
        t.equal(error.message, 'url required', 'missing url returns error message')
    })

    // optional images can have url = ""
    loadImage(key, '', { optional: true }).then(actual => {

        t.deepEqual(actual, { type: 'image', key: key, value: img }, 'resolves correct { type, key, value }')
    })

    // resolves with fallback value
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
    loadFont(key, fontName).then(actual => {

        t.deepEqual(actual, expected, 'resolves { type, key, value }')
    })

    // resolves with fallback value
    // for invalid fontName
    loadFont(key, `fontName!${rand()}`).then(actual => {

        t.deepEqual(actual, {...expected, ...{ value: 'Arial' }}, 'resolves with fallback')
    })
})
