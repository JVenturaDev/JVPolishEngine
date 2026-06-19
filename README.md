# Polish Engine

Polish Engine is a lightweight TypeScript math engine for evaluating expressions with Reverse Polish Notation (RPN), normalized output, complex number support, and step-by-step evaluation traces.

It is designed for calculators, educational tools, math UIs, and any project that needs predictable expression evaluation in JavaScript or TypeScript.

## Features

- Converts infix expressions to Reverse Polish Notation (RPN).
- Evaluates real and complex numbers with [`complex.js`](https://github.com/infusion/Complex.js).
- Supports variables, implicit multiplication, common math functions, operator precedence, and factorial.
- Returns normalized values by default for stable UI and API output.
- Returns evaluation steps by default for debugging, tracing, and educational experiences.
- Written in TypeScript and tested with Vitest.

## Installation

```bash
npm install polish-engine
```

## Quick Start

```ts
import { polishEngine } from "polish-engine";

const engine = new polishEngine();

engine.evaluate("2 + 3");
// {
//   result: { type: "real", value: 5, display: "5" },
//   steps: [
//     {
//       type: "Operator",
//       name: "+",
//       operands: [
//         { type: "real", value: 2, display: "2" },
//         { type: "real", value: 3, display: "3" }
//       ],
//       result: { type: "real", value: 5, display: "5" },
//       stackBefore: [
//         { type: "real", value: 2, display: "2" },
//         { type: "real", value: 3, display: "3" }
//       ],
//       stackAfter: [
//         { type: "real", value: 5, display: "5" }
//       ]
//     }
//   ]
// }
```

## Breaking Changes in v2

In v1, `evaluate()` returned the evaluated value directly:

```ts
engine.evaluate("2 + 3");
// 5
```

In v2.0.0, `steps` is enabled by default, so `evaluate()` returns an object with both the final result and the evaluation trace:

```ts
engine.evaluate("2 + 3");
// {
//   result: { type: "real", value: 5, display: "5" },
//   steps: [...]
// }
```

To get only the result, pass `{ steps: false }`:

```ts
engine.evaluate("2 + 3", { steps: false });
// { type: "real", value: 5, display: "5" }
```

To get the old direct raw value style, disable both steps and normalization:

```ts
engine.evaluate("2 + 3", {
  steps: false,
  normalize: false
});
// 5
```

## evaluate

`evaluate(expression, options)` evaluates an expression string.

By default:

- `steps` is `true`.
- `normalize` is `true`.
- The return value is `{ result, steps }`.

```ts
engine.evaluate("2 + 3");
// {
//   result: { type: "real", value: 5, display: "5" },
//   steps: [...]
// }
```

Disable steps to return only the final normalized result:

```ts
engine.evaluate("2 + 3", { steps: false });
// { type: "real", value: 5, display: "5" }
```

Disable normalization to return raw evaluation values instead of NormalizedValue objects. If steps are still enabled, the output still includes `{ result, steps }`:

```ts
engine.evaluate("2 + 3", { normalize: false });
// {
//   result: 5,
//   steps: [
//     {
//       type: "Operator",
//       name: "+",
//       operands: [2, 3],
//       result: 5,
//       stackBefore: [2, 3],
//       stackAfter: [5]
//     }
//   ]
// }
```

Disable both steps and normalization to return only the raw result:

```ts
engine.evaluate("2 + 3", {
  steps: false,
  normalize: false
});
// 5
```

## EvaluateOptions

`evaluate` accepts either the legacy variables object or the v2 options object.

```ts
type Variables = Record<string, number>;

interface EvaluateOptions {
  variables?: Variables;
  steps?: boolean;
  normalize?: boolean;
}
```

Options:

- `variables`: Values used when the expression contains variables.
- `steps`: When `true`, return `{ result, steps }`. Defaults to `true`.
- `normalize`: When `true`, convert raw numbers and `Complex` values into `NormalizedValue`. Defaults to `true`.

## NormalizedValue

When normalization is enabled, values use one of these shapes.

**For UI rendering, prefer the `display` property instead of manually formatting `value`, `re`, or `im`.**

```ts
type NormalizedValue =
  | {
      type: "real";
      value: number;
      display: string;
    }
  | {
      type: "complex";
      re: number;
      im: number;
      display: string;
    };
```

Examples:

```ts
engine.evaluate("2 + 3", { steps: false });
// { type: "real", value: 5, display: "5" }

engine.evaluate("sqrt(-4)", { steps: false });
// { type: "complex", re: 0, im: 2, display: "2i" }
```
### Using display

The `display` property is intended for user interfaces and formatted output.

```ts
const result = engine.evaluate("sqrt(-4)", {
  steps: false
});

console.log(result.display);
// "2i"
```

For real numbers:

```ts
const result = engine.evaluate("2 + 3", {
  steps: false
});

console.log(result.display);
// "5"
```

### Getting the display value

```ts
const output = engine.evaluate("sqrt(-4)");

console.log(output.result.display);
// "2i"
```
## Evaluation Steps

Steps describe how the RPN evaluator transforms the stack.

Each step includes:

- `type`: `"Operator"` or `"Function"`.
- `name`: The operator or function name, such as `"+"`, `"*"`, or `"sqrt"`.
- `operands`: Values consumed by the operation.
- `result`: Value produced by the operation.
- `stackBefore`: Stack state before the operation consumed its operands.
- `stackAfter`: Stack state after the operation pushed its result.

When `normalize: true`, `operands`, `result`, `stackBefore`, and `stackAfter` are normalized too.

```ts
engine.evaluate("2 + 3");
// {
//   result: { type: "real", value: 5, display: "5" },
//   steps: [
//     {
//       type: "Operator",
//       name: "+",
//       operands: [
//         { type: "real", value: 2, display: "2" },
//         { type: "real", value: 3, display: "3" }
//       ],
//       result: { type: "real", value: 5, display: "5" },
//       stackBefore: [
//         { type: "real", value: 2, display: "2" },
//         { type: "real", value: 3, display: "3" }
//       ],
//       stackAfter: [
//         { type: "real", value: 5, display: "5" }
//       ]
//     }
//   ]
// }
```

## Variables

The legacy variables API is still supported:

```ts
engine.evaluate("2x + 1", { x: 3 });
// {
//   result: { type: "real", value: 7, display: "7" },
//   steps: [...]
// }
```

The v2 options API is also supported:

```ts
engine.evaluate("2x + 1", {
  variables: { x: 3 },
  steps: true
});
// {
//   result: { type: "real", value: 7, display: "7" },
//   steps: [...]
// }
```

To get only the normalized result with variables:

```ts
engine.evaluate("2x + 1", {
  variables: { x: 3 },
  steps: false
});
// { type: "real", value: 7, display: "7" }
```

## Complex Numbers

Complex results are normalized by default:

```ts
engine.evaluate("sqrt(-4)");
// {
//   result: { type: "complex", re: 0, im: 2, display: "2i" },
//   steps: [...]
// }
```

With `normalize: false`, complex results are returned as raw `complex.js` `Complex` instances. If `steps` is still enabled, raw values also appear inside the evaluation steps:

```ts
engine.evaluate("sqrt(-4)", { normalize: false });
// {
//   result: Complex, // complex.js instance
//   steps: [
//     {
//       type: "Function",
//       name: "sqrt",
//       operands: [-4],
//       result: Complex,
//       stackBefore: [-4],
//       stackAfter: [Complex]
//     }
//   ]
// }
```

When steps are disabled, the raw output is the final value directly. Access `.re` and `.im` only after confirming that the returned value is a `Complex` instance:

```ts
import Complex from "complex.js";

const raw = engine.evaluate("sqrt(-4)", {
  steps: false,
  normalize: false
});

if (raw instanceof Complex) {
  console.log(raw.re); // 0
  console.log(raw.im); // 2
}
```

## Common Examples

```ts
engine.evaluate("2 + 3 * 4", { steps: false });
// { type: "real", value: 14, display: "14" }

engine.evaluate("(2 + 3) * 4", { steps: false });
// { type: "real", value: 20, display: "20" }

engine.evaluate("4!", { steps: false });
// { type: "real", value: 24, display: "24" }

engine.evaluate("sin(0)", { steps: false });
// { type: "real", value: 0, display: "0" }
```

## Project Structure

```text
polish-engine/
|-- src/
|   |-- polish-engine.ts
|   |-- tokenizer.ts
|   |-- polish-parser.ts
|   |-- polish-evaluator.ts
|   |-- preprocessModule.ts
|   |-- result-normalizer.ts
|   |-- evaluate-options-resolver.ts
|   `-- functionsModule.ts
|-- tests/
|   |-- tokenizer.test.ts
|   |-- parser.test.ts
|   |-- evaluator.test.ts
|   `-- polish-engine.test.ts
|-- package.json
|-- tsconfig.json
|-- vitest.config.ts
|-- LICENSE
`-- README.md
```

## Running Tests

```bash
npm test
```

Run the TypeScript compiler:

```bash
npx tsc
```

## Tech Stack

- TypeScript
- Vitest
- complex.js
- ES Modules

## Author

**Jonathan Ventura**  
GitHub: [JVenturaDev](https://github.com/JVenturaDev)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
