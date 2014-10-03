var disallowed = [
  'iit',
  'ddescribe',
  'describe.only',
  'it.only',
  'xit',
  'xdescribe'
];

// TODO - have this return the indices
function getDisallowedIndices(largeString, disallowedString) {
  var notFunctionName = '[^A-Za-z0-9$_]';
  var regex = new RegExp('(^|' + notFunctionName + ')(' + disallowedString + ')' + notFunctionName + '*\\(', 'gm');
  var matches = [];
  var match = null;
  while(match = regex.exec(largeString)) {
    matches.push({
      index: match.index,
      length: match[1].length
    });
  }
  return matches;
}

// returns undefined || obj
module.exports = function (fileContents, options) {

  var res;
  options = options || {};

  if (options.disallowed) {
    disallowed = options.disallowed;
  }

  var indices = [];

  disallowed.forEach(function (str) {
    indices = getDisallowedIndices(fileContents, str);
    indices.forEach(function (disallowedMatch) {
      res = res || [];
      res.push({
        str: str,
        line: fileContents.substr(0, disallowedMatch.index+disallowedMatch.length).split('\n').length
      });
    });
  });

  if (res) {
    res.sort(function(a, b) {
      return a.line - b.line;
    });
  }

  return res;
};
