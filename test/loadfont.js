// test font loading
var test = require('tape')
require('tape-dom')(tape)
// import { loadFont } from  '../index.js'
var loader = require('../index.js')


test('fist test', function(t) {
    t.plan(1)
    t.equal(typeof Date.now, 'function');
})
// console.log('loader', loader)
// t.isa(loader.loadFont, 'function')
// font loader rejects
//tap.rejects(loadFont("testKey", "Lobster"), "test", "fontLoader rejects")

// font loader resolves