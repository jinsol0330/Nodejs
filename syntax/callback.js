// function a() {
//     console.log('A');
// }

const { callbackify } = require("util");

var a = function () {
    console.log('A');
}

function slowfunc(callback) {
    callback();
}

slowfunc(a);