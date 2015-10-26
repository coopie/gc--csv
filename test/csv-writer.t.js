var assert = require('assert');
var path = require('path');
var moduleName = path.basename(__filename).split('.')[0];

var csvWriter = require('../src/csv-writer');
var shouldReturn = 'should return: ';

describe(moduleName, function() {
    describe('writeLine', function() {
        describe('writes line of csv correctly', function() {
            it(shouldReturn + '1, 2, 3\n', function() {
                var keys = ['the', 'test', 'works'];
                var obj = {
                    the: 1,
                    test: 2,
                    works: 3
                };

                assert.equal(csvWriter.writeLine(keys, obj), '1,2,3\n');
            });
        });
    });
    describe('toCSV', function() {
        describe('Empty array', function() {
            it(shouldReturn + '', function() {
                assert.equal(csvWriter.toCSV([]), '');
            });
        });
        describe('not array', function() {
            it('should throw', function() {
                assert.throws(csvWriter.toCSV, TypeError);
            });
        });
        describe('Consistent data', function() {
            it(shouldReturn + 'name and adress info for some people\n', function() {
                var data = [
                    {
                        name: 'alan',
                        age: 13,
                        residence: 'London'
                    },
                    {
                        name: 'Brian',
                        age: 99,
                        residence: 'Leamington'
                    },
                    {
                        name: 'Sam',
                        age: 20,
                        residence: 'Bromsgrove'
                    },
                    {
                        name: 'Timotej',
                        age: 'unknown',
                        residence: 'Slovenia'
                    }
                ];

                var expected =
                    'name,age,residence\n' +
                    'alan,13,London\n' +
                    'Brian,99,Leamington\n' +
                    'Sam,20,Bromsgrove\n' +
                    'Timotej,unknown,Slovenia\n';

                assert.equal(csvWriter.toCSV(data), expected);
            });
        });
    });

});
