!function(e,r){for(var t in r)e[t]=r[t]}(exports,function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=18)}({18:function(e,r){r.formatName=e=>{if(!e||0==e.length)return"";var r=e.trim().split(" ",3),t="";if(r.length>2);else if(1==r.length);else{var n=r[0];n=n.substring(0,n.length-1),t=r[1]+" "+n}return console.log("Name formatted from "+e+" to "+t),t},r.formatCollege=e=>{var r=e.indexOf("Coll of"),t=e.indexOf("]",r),n=e.substring(r,t);return console.log("Course Info formatted from: "+e+" to college name:  "+n),n},r.formatPercent=e=>{var r=e;return"00%"===r?"100%":"N/A"===r?"N/A":(r.replace(/[^0-9.]/g,"").length<2&&(r=r.substring(1)),r)}}}));