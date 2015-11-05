import {readFileSync, writeFileSync} from 'fs';

const REQUIRE_RE = /^(?:var|let|const) ([\d\w]+)\s*=\s*require\(([^)]+)\);?$/;

// ex:
// require('foo').bar
const REQUIRE_PROPERTY_RE = /^(?:var|let|const) ([\d\w]+)\s*=\s*require\((.+)\)\.([^;]+);?$/;

const EXPORT_RE = /^module.exports\s*=\s*(.*)/;

// TODO: there are valid js identifiers that use more than just ASCII here
const PROPERTY_RE = /^[\d\w]+$/;

function transformRequire(ctx, match) {
  const [line, identifier, path] = match;
  return `import ${identifier} from ${path};`;
}

function transformRequireProperty(ctx, match) {
  const [line, identifier, path, property] = match;

  if (!PROPERTY_RE.test(property)) {
    console.log(`Skipping transform of weird property found in ${ctx.file}:${ctx.lineNumber}: ${property}`);
    return line;
  }

  if (property === identifier) {
    return `import {${identifier}} from ${path};`;
  } else {
    return `import {${property} as ${identifier}} from ${path};`;
  }
}

function transformExport(ctx, match) {
  const [line, predicate] = match;
  return `export default ${predicate}`;
}

export function cli() {
  const args = process.argv.slice(2);

  for (const file of args) {
    const content = readFileSync(file, {encoding: 'utf8'});

    const output = content.split('\n').map((line, idx) => {
      let match;

      const ctx = {file, lineNumber: idx + 1};

      if (match = line.match(REQUIRE_RE)) {
        return transformRequire(ctx, match);
      } else if (match = line.match(REQUIRE_PROPERTY_RE)) {
        return transformRequireProperty(ctx, match);
      } else if (match = line.match(EXPORT_RE)) {
        return transformExport(ctx, match);
      } else {
        return line;
      }
    }).join('\n');

    writeFileSync(file, output, {encoding: 'utf8'});
  }
}
