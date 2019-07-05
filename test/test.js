import test from 'tape'
import domReporter from 'tape-dom'
domReporter(test) // setup DOM reporter

import { loadImage, loadSound, loadFont } from  '../index.js'
import { createBase64Image } from '../utils.js';
import { blankImage, defaultImage } from '../placeholders.js';

// random string
const rand = () => Math.random().toString(16).slice(2)

// test list loader
test('list loader', (t) => {
    t.plan(2)

    // loader is a function that returns a thenable
    t.comment('returns a promise')
    t.equal(typeof loadImage, 'function', 'is a function');
    t.equal(typeof loadImage([]).then, 'function', 'returns a promise');
})

// test image loader
test('image loader', (t) => {
    t.plan(12)

    // setup  image
    const key = `imageKey!${rand()}`
    const url = `https://i.imgur.com/JchtoH4.png`
    const img = new Image()
    img.src = url

    // expected
    const expected = {
        type: 'image',
        key: key,
        value: img
    }

    // fallbacks
    const blankFallback = createBase64Image(blankImage)
    const noImageFallback = createBase64Image(defaultImage)

    // loader is a function that returns a thenable
    t.comment('returns a promise')
    t.equal(typeof loadImage, 'function', 'is a function');
    t.equal(typeof loadImage(key, url).then, 'function', 'returns a promise');

    // has correct type, key, and value
    loadImage(key, url).then(actual => {

        t.comment('resolves with { type, key, value }')
        t.deepEqual(actual, expected, 'resolves correct { type, key, value }')
        t.equal(actual.value.src, expected.value.src, 'url and src match')
    })

    // throws error for required args
    loadImage(undefined, url).then().catch(error => {
        t.comment('rejects with error for missing key')
        t.equal(error instanceof Error, true, '!key rejects with error')
        t.equal(error.message, 'key required', '!key rejects with error message')
    })

    // resolves fallbacks
    loadImage(key, undefined).then(actual => {
        t.comment('resolves with no-image fallback (blank urls)')
        t.equal(actual.value.src, noImageFallback.src, 'resolves no-image fallback for invalid urls 1')
    })
    loadImage(key, '').then(actual => {
        t.equal(actual.value.src, noImageFallback.src, 'resolves no-image fallback for invalid urls 2')
    })

    // resolves with "no image" fallback for
    // invalid urls
    loadImage(key, 'https://8.8.8.8/none.png').then(actual => {
        t.comment('resolves with no-image fallback (invalid urls)')
        t.equal(actual.value.src, noImageFallback.src, 'resolves no-image fallback for invalid urls 3')
    })
    loadImage(key, 'https://8.8.8.8/none.png', { optional: true }).then(actual => {
        t.equal(actual.value.src, noImageFallback.src, 'resolves no-image fallback for invalid urls 4')
    })

    // optional images can have url = ""
    loadImage(key, '', { optional: true }).then(actual => {
        t.comment('resolves with blank fallback for optional images')

        t.deepEqual(actual, { type: 'image', key: key, value: img }, 'when optional=true resolves correct { type, key, value }')
        t.equal(actual.value.src, blankFallback.src, 'when optional=true resolves with blank image')
    })

})

// test sound loader
test('sound loader', (t) => {
    t.plan(14)
    
    // setup  image
    const audioCtx = new AudioContext()

    const key = `imageKey!${rand()}`
    const url = `https://objects.koji-cdn.com/e5d1d25b-29a1-4df7-b9b7-534ae82f7bc2/buttonHeroSuccess2.mp3`
    let audioBuffer = audioCtx.createBuffer(1, 1, 22050)

    // expected
    const expected = {
        type: 'sound',
        key: key,
        value: audioBuffer
    }

    // loader is a function that returns a thenable
    t.comment('returns a promise')
    t.equal(typeof loadSound, 'function', 'is a function');
    t.equal(typeof loadSound(key, url).then, 'function', 'returns a promise');

    // throws error for required args
    loadSound(undefined, url).then().catch(error => {
        t.comment('rejects with an error for missing key')
        t.equal(error instanceof Error, true, '!key rejects with error')
        t.equal(error.message, 'key required', '!key rejects with error message')
    })

    // has correct type, key, and value
    loadSound(key, url).then(actual => {

        t.comment('resolves with { type, key, value }')
        t.deepEqual(actual, expected, 'resolves correct { type, key, value }')
    })

    // they should be audio buffers
    loadSound(key, url).then(actual => {
        // should be an audio buffer
        t.comment('value is an audio buffer')
        t.ok(actual.value.length, 'value has length')
        t.ok(actual.value.duration, 'value has duration')
        t.ok(actual.value.sampleRate, 'value has sampleRate')
        t.ok(actual.value.numberOfChannels, 'value has numberOfChannels')
    })

    // invalid urls resolve with a silent sound
    loadSound(key, '').then(actual => {
        // should be silent buffer
        t.comment('invalid urls resolve with silent audio buffer')
        t.equal(actual.value.length, 1, 'value has length 1')
        t.equal(actual.value.duration, 0.000125, 'value has duration 0.000125')
        t.equal(actual.value.sampleRate, 8000, 'value has sampleRate 8000')
        t.equal(actual.value.sampleRate, 8000, 'value has sampleRate 8000')
        t.equal(actual.value.numberOfChannels, 1, 'value has numberOfChannels 1')
    })

})

// test font loader
test('font loader', (t) => {
    t.plan(8)

    const key = `fontKey!${rand()}`
    const fontName = `Lobster`

    // loader is a function that returns a thenable
    t.comment('returns a promise')
    t.equal(typeof loadFont, 'function', 'is a function');
    t.equal(typeof loadFont(key, fontName).then, 'function', 'returns a promise');

    // throws error for required args
    loadFont(undefined, fontName).then().catch(error => {
        t.comment('rejects with an error for missing key')
        t.equal(error instanceof Error, true, '!key rejects with error')
        t.equal(error.message, 'key required', '!key rejects with error message')
    })

    // has correct type, key, and value
    loadFont(key, fontName).then(actual => {

        t.comment('resolves with { type, key, value }')
        t.deepEqual(actual, { type: 'font', key: key, value: fontName }, 'resolves correct { type, key, value }')
    })

    // resolves with fallback value
    // for invalid fontName
    loadFont(key, `fontName!${rand()}`).then(actual => {

        t.comment('resolves with fallback')
        t.deepEqual(actual, { type: 'font', key: key, value: 'Arial'}, 'resolves with fallback Arial for invalid url')
    })

    loadFont(key, '').then(actual => {

        t.comment('resolves with fallback')
        t.deepEqual(actual, { type: 'font', key: key, value: 'Arial'}, 'resolves with fallback Arial for blank url')
    })

    loadFont(key, '', { fallback: 'Bungee' }).then(actual => {

        t.comment('resolves with fallback')
        t.deepEqual(actual, { type: 'font', key: key, value: 'Bungee'}, 'resolves with selected fallback')
    })
})
