// Shared helper functions used by both convert.mjs and typescript.mjs

function getEntries(entry) {
  return [
    entry,
    ...getAllEntries(entry.members?.global || []),
    ...getAllEntries(entry.members?.inner || []),
    ...getAllEntries(entry.members?.instance || []),
    ...getAllEntries(entry.members?.events || []),
    ...getAllEntries(entry.members?.static || [])
  ];
}

export function getAllEntries(arr = []) {
  return arr.flatMap(entry => entry ? getEntries(entry) : []);
}

export function descriptionString(node, parent) {
  if (!node) {
    return '';
  } else if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph') {
    const content = node.children.map(n => descriptionString(n, node)).join('');
    if (parent && parent.children.length === 1) return content;
    return '<p>' + content + '</p>\n';
  } else if (node.type === 'code') {
    let classes = [];
    let attrs = '';
    if (node.lang) {
      classes.push(`language-${node.lang}`);
    }
    if (node.meta) {
      classes.push(node.meta);
    }
    if (classes.length > 0) {
      attrs=` class="${classes.join(' ')}"`;
    }
    return `<pre><code${attrs}>${node.value}</code></pre>`;
  } else if (node.type === 'inlineCode') {
    return '<code>' + node.value + '</code>';
  } else if (node.type === 'list') {
    const tag = node.type === 'ordered' ? 'ol' : 'ul';
    return `<${tag}>` + node.children.map(n => descriptionString(n, node)).join('') + `</${tag}>`;
  } else if (node.type === 'listItem') {
    return '<li>' + node.children.map(n => descriptionString(n, node)).join('') + '</li>';
  } else if (node.value) {
    return node.value;
  } else if (node.children) {
    return node.children.map(n => descriptionString(n, node)).join('');
  } else {
    return '';
  }
}

// TypeScript-specific version without HTML tags
export function descriptionStringForTypeScript(node, parent) {
  if (!node) {
    return '';
  } else if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph') {
    const content = node.children.map(n => descriptionStringForTypeScript(n, node)).join('');
    return content + '\n\n'; // Skip HTML tags for TypeScript
  } else if (node.type === 'code') {
    return `\`${node.value}\``;
  } else if (node.type === 'inlineCode') {
    return `\`${node.value}\``;
  } else if (node.type === 'list') {
    return node.children.map(n => descriptionStringForTypeScript(n, node)).join('') + '\n';
  } else if (node.type === 'listItem') {
    return '- ' + node.children.map(n => descriptionStringForTypeScript(n, node)).join('') + '\n';
  } else if (node.value) {
    return node.value;
  } else if (node.children) {
    return node.children.map(n => descriptionStringForTypeScript(n, node)).join('');
  } else {
    return '';
  }
}

export function typeObject(node) {
  if (!node) return {};

  if (node.type === 'OptionalType') {
    return { optional: 1, ...typeObject(node.expression) };
  } else if (node.type === 'UnionType') {
    const names = node.elements.map(n => typeObject(n).type);
    return {
      type: names.join('|')
    };
  } else if (node.type === 'TypeApplication') {
    const { type: typeName } = typeObject(node.expression);
    if (
      typeName === 'Array' &&
      node.applications.length === 1
    ) {
      return {
        type: `${typeObject(node.applications[0]).type}[]`
      };
    }
    const args = node.applications.map(n => typeObject(n).type);
    return {
      type: `${typeName}<${args.join(', ')}>`
    };
  } else if (node.type === 'UndefinedLiteral') {
    return { type: 'undefined' };
  } else if (node.type === 'FunctionType') {
    let signature = `function(${node.params.map(p => typeObject(p).type).join(', ')})`;
    if (node.result) {
      signature += `: ${typeObject(node.result).type}`;
    }
    return { type: signature };
  } else if (node.type === 'ArrayType') {
    return { type: `[${node.elements.map(e => typeObject(e).type).join(', ')}]` };
  } else if (node.type === 'RestType') {
    return { type: typeObject(node.expression).type, rest: true };
  } else {
    // TODO
    // - handle record types
    return { type: node.name };
  }
}

export function getParams(entry) {
  // Documentation.js seems to try to grab params from the function itself in
  // the code if we don't document all the parameters. This messes with our
  // manually-documented overloads. Instead of using the provided entry.params
  // array, we'll instead only rely on manually included @param tags.
  //
  // However, the tags don't include a tree-structured description field, and
  // instead convert it to a string. We want a slightly different conversion to
  // string, so we match these params to the Documentation.js-provided `params`
  // array and grab the description from those.
  return (entry.tags || [])

    // Filter out the nested parameters (eg. options.extrude),
    // to be treated as part of parent parameters (eg. options)
    // and not separate entries
    .filter(t => t.title === 'param' && !t.name.includes('.'))
    .map(node => {
      const param = (entry.params || [])
        .find(param => param.name === node.name);
      return {
        ...node,
        description: param?.description || {
          type: 'html',
          value: node.description
        },
        properties: param?.properties // Preserve properties array for nested object parameters
      };
    });
}