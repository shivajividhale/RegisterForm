/**
 * Created by Shivaji on 10/23/2015.
 */
var expect    = require("chai").expect;
var register = require("./app.js");

describe("Check String Length", function() {
    it("checks the lenght of the sting", function(){
        var length1 = register.checkStringLength("Abc");
        expect(length1).to.equal(1);
    });
});