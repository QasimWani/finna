'use strict';


module.exports = function dent(obj) {
  if (obj === undefined) {
    return dent.o[dent.idx++];
  }

  dent.o = obj;
  dent.idx = 0;
  return dent;
};
