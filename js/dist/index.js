(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
})(LogLevel || (LogLevel = {}));
function log(level, msg) {
    var logMsg = level + ": " + msg;
    switch (level) {
        case LogLevel.ERROR:
            console.error(logMsg);
            break;
        default:
            console.log(logMsg);
            break;
    }
}
function info(msg) {
    log(LogLevel.INFO, msg);
}
exports.info = info;
function debug(msg) {
    log(LogLevel.DEBUG, msg);
}
exports.debug = debug;
function error(msg) {
    log(LogLevel.ERROR, msg);
}
exports.error = error;

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var logger_1 = require("./core/logger");
logger_1.info('Hello, World!');
logger_1.error('This is a error.');
logger_1.debug("1 + 1 = " + (1 + 1));

},{"./core/logger":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9jb3JlL2xvZ2dlci5qcyIsImJ1aWxkL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtcIkVSUk9SXCJdID0gXCJFUlJPUlwiO1xyXG4gICAgTG9nTGV2ZWxbXCJERUJVR1wiXSA9IFwiREVCVUdcIjtcclxuICAgIExvZ0xldmVsW1wiSU5GT1wiXSA9IFwiSU5GT1wiO1xyXG59KShMb2dMZXZlbCB8fCAoTG9nTGV2ZWwgPSB7fSkpO1xyXG5mdW5jdGlvbiBsb2cobGV2ZWwsIG1zZykge1xyXG4gICAgdmFyIGxvZ01zZyA9IGxldmVsICsgXCI6IFwiICsgbXNnO1xyXG4gICAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRVJST1I6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobG9nTXNnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTXNnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5mbyhtc2cpIHtcclxuICAgIGxvZyhMb2dMZXZlbC5JTkZPLCBtc2cpO1xyXG59XHJcbmV4cG9ydHMuaW5mbyA9IGluZm87XHJcbmZ1bmN0aW9uIGRlYnVnKG1zZykge1xyXG4gICAgbG9nKExvZ0xldmVsLkRFQlVHLCBtc2cpO1xyXG59XHJcbmV4cG9ydHMuZGVidWcgPSBkZWJ1ZztcclxuZnVuY3Rpb24gZXJyb3IobXNnKSB7XHJcbiAgICBsb2coTG9nTGV2ZWwuRVJST1IsIG1zZyk7XHJcbn1cclxuZXhwb3J0cy5lcnJvciA9IGVycm9yO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxudmFyIGxvZ2dlcl8xID0gcmVxdWlyZShcIi4vY29yZS9sb2dnZXJcIik7XHJcbmxvZ2dlcl8xLmluZm8oJ0hlbGxvLCBXb3JsZCEnKTtcclxubG9nZ2VyXzEuZXJyb3IoJ1RoaXMgaXMgYSBlcnJvci4nKTtcclxubG9nZ2VyXzEuZGVidWcoXCIxICsgMSA9IFwiICsgKDEgKyAxKSk7XHJcbiJdfQ==
