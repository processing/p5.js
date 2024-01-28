const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

const converted = {
  project: {}, // TODO
  files: {}, // TODO
  modules: {}, // TODO
  classes: {}, // TODO
  classitems: [], // TODO
  warnings: [], // TODO
  consts: {} // TODO
};

function descriptionString(node) {
  if (!node) {
    return '';
  } else if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph') {
    return '<p>' + node.children.map(n => descriptionString(n)).join('') + '</p>';
  } else if (node.type === 'includeCode') {
    return '<code>' + node.value + '</code>';
  } else if (node.value) {
    return node.value;
  } else if (node.children) {
    return node.children.map(n => descriptionString(n)).join('');
  } else {
    return '';
  }
}

function typeObject(node) {
  if (!node) return {};

  if (node.type === 'OptionalType') {
    return { optional: true, ...typeObject(node.expression) };
  } else {
    return { type: node.name };
  }
}

for (const entry of data) {
  if (entry.kind === 'function' && entry.properties.length === 0) {
    const item = {
      name: entry.name,
      itemtype: 'method',
      chainable: entry.tags.some(tag => tag.title === 'chainable'),
      description: descriptionString(entry.description),
      example: entry.examples.map(e => e.description),
      overloads: [
        {
          params: entry.params.map(p => {
            return {
              name: p.name,
              description: p.description && descriptionString(p.description),
              ...typeObject(p.type)
            };
          })
        }
        // TODO add other overloads
      ],
      return: entry.returns[0] && {
        description: descriptionString(entry.returns[0].description),
        ...typeObject(entry.returns[0].type).name
      },
      class: entry.memberof, // TODO
      module: undefined, // TODO
      submodule: undefined // TODO
    };

    converted.classitems.push(item);
  }
}

fs.writeFileSync(path.join(__dirname, '../docs/converted.json'), JSON.stringify(converted, null, 2));
