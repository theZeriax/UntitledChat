export const strToNum = function (str) {
  var val = 0;
  for (var i = 0; i < str.length; ++i) {
    val = val << 1; //Shift left one byte, to make room for this byte
    val = val | str.charCodeAt(i); //Bitwise OR them together
  }
  return val;
};
