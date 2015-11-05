Uber-naive CommonJS->ES6 converter. **Will break on multi-line import/export declarations.** Works by string replacement, regexes, and hope.

### Usage

This *rewrites files in place*, so back up your files/commit them before continuing.

```
cjs-convert path/to/file_one.js path/to/file_two.js
```

### Supported syntax

<table>
  <tr>
    <th>Before</th>
    <th>After</th>
  </tr>
  <tr>
    <td>
      <code>
        module.exports = Foo
      </code>
    </td>
    <td>
      <code>
        export default Foo
      </code>
    </td>
  </tr>
  <tr>
    <td>
      <code>
        var foo = require('foo')
      </code>
    </td>
    <td>
      <code>
        import foo from 'foo'
      </code>
    </td>
  </tr>
  <tr>
    <td>
      <code>
        var bar = require('foo').bar
      </code>
    </td>
    <td>
      <code>
        import {bar} from 'foo'
      </code>
    </td>
  </tr>
  <tr>
    <td>
      <code>
        var baz = require('foo').bar
      </code>
    </td>
    <td>
      <code>
        import {bar as baz} from 'foo'
      </code>
    </td>
  </tr>
</table>

### Unhandled syntax

This converter will log a warning on a line like:

```
var baz = require('foo').bar();
```

since it can't rewrite anything beyond basic property access.

