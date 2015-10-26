// A very simple CSV writer, it assumes that the elements in the array are of
// uniform structure, and so takes the keys of the first object in the array as
// the schema for the csv

// For example [{x: 1, y:2}, {x: 6, y: -1, z: 'hello'}]
//
//  x, y
//  1, 2
//  6, -1
//

var _ = require('lodash');

// returns a string of the CSV version of the data.
function toCSV(data) {
    if (!_.isArray(data)) {
        throw new TypeError('CSVWRITER: Data input must be an array');
    }
    if (!data[0]) {
        return '';
    }
    var csvString = '';
    var keys = Object.keys(data[0]);

    csvString = keys.reduce(function(str, key) {
        return str += key + ', ';
    }, csvString).slice(0, -2) + '\n';

    return data.reduce(function(str, datum) {
        return str + writeLine(keys, datum);
    }, csvString);

}

function writeLine(keys, obj) {
    return keys.reduce(function(str, key) {
        return str + obj[key] + ', ';
    }, '').slice(0, -2) + '\n';
}

module.exports = {
    toCSV: toCSV,
    writeLine: writeLine
};
