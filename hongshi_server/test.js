var g = function (a, b, c) {
    console.log("a = " + a + "\nb = " + b + "\nc = " + c + "\n");
};
var f = function (a, b, c) {
    g(arguments);
};
var f2 = function (a, b) {
    g(arguments);
};
f(1, 2, 5);
f2(3, 4, 6);