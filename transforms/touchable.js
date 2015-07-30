function getJSXName(value) {
  return value.openingElement.name.name;
}

module.exports = function(file, api) {
  if (file.source.indexOf('<Touchable') === -1) {
    return;
  }

  var j = api.jscodeshift;
  var root = j(file.source);

  var didTransform = false;
  root.find(j.JSXElement).forEach(function(p) {
    var parent = p.value;
    if (getJSXName(parent) !== 'TouchableBounce' &&
        getJSXName(parent) !== 'TouchableOpacity') {
      return;
    }

    if (parent.children.length !== 3) {
      return;
    }

    var child = parent.children[1];
    if (!(child.type === 'JSXElement' &&
        getJSXName(child) === 'View')) {
      return;
    }

    parent.attributes.push(...child.attributes);
    parent.children = child.children;
    didTransform = true;
  });

  return didTransform ? root.toSource() + '\n' : null;
};