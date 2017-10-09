var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
    ];

    var interpreter = null;

    before(function () {
        // runs before all tests in this block
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    afterEach(function () {
        // runs after each test in this block
    });


    describe('Interpreter Facts', function () {

        it('varon(juan) should be null', function () {
            assert(interpreter.checkQuery('varon(juan)') === null);
        });

        it('varon(maria) should be null', function () {
            assert(interpreter.checkQuery('varon(maria)') === null);
        });


    });

    describe('Interpreter Rules', function () {

        it('hijo(pepe, juan) should be null', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)') === null);
        });
        it('hija(maria, roberto) should be null', function () {
            assert(interpreter.checkQuery('hija(maria, roberto)') === null);
        });
    });


});


