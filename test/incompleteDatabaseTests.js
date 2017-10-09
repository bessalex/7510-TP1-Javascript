var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
        "varon(juan).",
        "mujer(cecilia).",
        "padre(roberto, cecilia).",
        "parejaHetero(X, Y) :- varon(X), mujer(Y).",
        "hija(X, Y) :- mujer(X), padre(Y, X).",
        "varon"
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

        it('varon(juan) should be true', function () {
            assert(interpreter.checkQuery('varon(juan)'));
        });

        it('varon(maria) should be false', function () {
            assert(interpreter.checkQuery('varon(maria)') === false);
        });

        it('mujer(cecilia) should be true', function () {
            assert(interpreter.checkQuery('mujer(cecilia)'));
        });

        it('padre(juan, pepe) should be false', function () {
            assert(interpreter.checkQuery('padre(juan, pepe)') === false);
        });


    });

    describe('Interpreter Rules', function () {

        it('hijo(pepe, juan) should be false', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)') === false);
        });
        it('hija(cecilia, roberto) should be true', function () {
            assert(interpreter.checkQuery('hija(cecilia, roberto)'));
        });
        it('hija(maria, roberto) should be false', function () {
            assert(interpreter.checkQuery('hija(maria, roberto)') === false);
        });

        it('parejaHetero(juan, cecilia) should be true', function () {
            assert(interpreter.checkQuery('parejaHetero(juan, cecilia)'));
        });

        // TODO: Add more tests

    });


});


