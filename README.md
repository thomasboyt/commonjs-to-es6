Uber-naive CommonJS->ES6 converter. **Will break on multi-line import/export declarations.** Works by string replacement, regexes, and hope.

Handles use cases:

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

Will log a warning on a line like:

```
var baz = require('foo').bar();
```

since it can't rewrite anything beyond basic property access.
