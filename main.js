var esprima = require("esprima");
var Chance = require("chance")
var chance = new Chance()
var options = {
	tokens: true,
	tolerant: true,
	loc: true,
	range: true
};
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');

function main() {
	var args = process.argv.slice(2);

	if (args.length == 0) {
		args = ["subject.js"];
	}
	var filePath = args[0];

	constraints(filePath);

	generateTestCases()

}

var engine = Random.engines.mt19937().autoSeed();

function Constraint(properties) {
	this.ident = properties.ident;
	this.expression = properties.expression;
	this.operator = properties.operator;
	this.value = properties.value;
	this.funcName = properties.funcName;
	// Supported kinds: "fileWithContent","fileExists"
	// integer, string, phoneNumber
	this.kind = properties.kind;
}

function fakeDemo() {
	console.log(faker.phone.phoneNumber());
	console.log(faker.phone.phoneNumberFormat());
	console.log(faker.phone.phoneFormats());
}
fakeDemo()
var functionConstraints = {}

function generateTestCases() {

	var content = "var subject = require('./subject.js')\nvar mock = require('mock-fs');\n";
	for (var funcName in functionConstraints) {
		var params = {};

		// initialize params
		for (var i = 0; i < functionConstraints[funcName].params.length; i++) {
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			params[paramName] = '\'\'';
		}

		//console.log( params );

		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		// Handle global constraints...
		var fileWithContent = _.some(constraints, {
			kind: 'fileWithContent'
		});
		var pathExists = _.some(constraints, {
			kind: 'fileExists'
		});
		var argsList = []
		argsList.push(Object.keys(params).map(function(k) {
				return params[k]
			}).join(","))
			// plug-in values for parameters
			//
		console.log(constraints)
		for (var c = 0; c < 100 && constraints.length != 0; c++) {

			var rdm = Math.floor(Math.random() * constraints.length)
			var constraint = constraints[rdm];
			if (params.hasOwnProperty(constraint.ident)) {
				params[constraint.ident] = constraint.value;
			}
			var arg = Object.keys(params).map(function(k) {
				return params[k]
			}).join(",");
			if (argsList.indexOf(arg) < 0)
				argsList.push(arg)
		}
		// Prepare function arguments.
		//var args = Object.keys(params).map( function(k) {return (typeof params[k] == 'string')?"'"+params[k]+"'":params[k] }).join(",");
		for (var j = 0; j < argsList.length; j++) {
			var args = argsList[j]
			content += "subject.{0}({1});\n".format(funcName, args);
		}

	}


	fs.writeFileSync('test.js', content, "utf8");

}

function constraints(filePath) {
	var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function(node) {
		if (node.type === 'FunctionDeclaration') {
			var funcName = functionName(node);
			//console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {
				return p.name
			});

			functionConstraints[funcName] = {
				constraints: [],
				params: params
			};

			// Check for expressions using argument.
			traverse(node, function(child) {
				if (child.type === 'BinaryExpression') {
					if (child.left.type == 'Identifier' && params.indexOf(child.left.name) > -1) {
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])
						if (child.right.type == 'Literal') {
							rightHand = child.right.raw
						}
						var incorrect = "\"\""
						switch (child.operator) {
							case '==': //do nothing to rightHand
							case '===':incorrect  = chance.string()
								break
							case '>':
								incorrect = rightHand - 10
								rightHand++
								break
							case '<':
								incorrect = rightHand + 10
								rightHand--
								break
							default:
								return
						}

						functionConstraints[funcName].constraints.push(
							new Constraint({
								ident: child.left.name,
								value: incorrect,
								funcName: funcName,
								kind: "integer",
								operator: child.operator,
								expression: expression
							}));
						functionConstraints[funcName].constraints.push(
							new Constraint({
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "integer",
								operator: child.operator,
								expression: expression
							}));
					}
				}
				if (child.type == "CallExpression" &&
					child.callee.property &&
					child.callee.property.name == "indexOf") {
					functionConstraints[funcName].constraints.push(
						new Constraint({
							ident: child.callee.object.name,
							// A fake path to a file
							value: child.arguments[0].raw,
							funcName: funcName,
							kind: "string",
							operator: child.operator,
							expression: expression
						}));
				}
			});

			//console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) {
	var key, child;

	visitor.call(null, object);
	for (key in object) {
		if (object.hasOwnProperty(key)) {
			child = object[key];
			if (typeof child === 'object' && child !== null) {
				traverse(child, visitor);
			}
		}
	}
}

function traverseWithCancel(object, visitor) {
	var key, child;

	if (visitor.call(null, object)) {
		for (key in object) {
			if (object.hasOwnProperty(key)) {
				child = object[key];
				if (typeof child === 'object' && child !== null) {
					traverseWithCancel(child, visitor);
				}
			}
		}
	}
}

function functionName(node) {
	if (node.id) {
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

main();
