# Polish Engine 

A lightweight, TypeScript-based math expression evaluator that uses **Reverse Polish Notation (RPN)** for accurate and extensible computation.

##  Features

- Converts infix expressions to **Reverse Polish Notation (RPN)**.
- Evaluates real and **complex numbers** using [`complex.js`](https://github.com/infusion/Complex.js).
- Supports **custom functions**, **variables**, and **operator precedence**.
- Written entirely in **TypeScript** for strong typing and easy integration.
- Unit tested with **Jest**.

---

##  Installation

### From npm

```bash
npm install polish-engine
```
### Or from GitHub repository
```bash
git clone https://github.com/JVenturaDev/JVPolishEngine.git
cd polish-engine
npm install
```

---

##  Usage

### Example 1: Basic Arithmetic

```ts
import { polishEngine } from "polish-engine";

const engine = new polishEngine();

console.log(engine.evaluate("2 + 3 * 4")); // 14
console.log(engine.evaluate("(2 + 3) * 4")); // 20
```

### Example 2: Using Variables

```ts
console.log(engine.evaluate("a^2 + b^2", { a: 3, b: 4 })); // 25
```

### Example 3: Complex Numbers

```ts
console.log(engine.evaluate("sqrt(-9)")); //3i
```

---

## Architecture Overview

The project is modularized into independent components:

| Module | Description |
|--------|--------------|
| `tokenizer.ts` | Splits expressions into tokens. |
| `polish-parser.ts` | Converts tokens from infix to postfix (RPN). |
| `PreprocessModule.ts` | Normalizes and transforms mathematical expressions — replaces symbols, standardizes syntax, and prepares input for tokenization..|
| `polish-evaluator.ts` | Evaluates the postfix expressions. |
| `functionsModule.ts` | Handles built-in and custom functions. |
| `polish-engine.ts` | High-level API for developers. |

### Class Diagram 

```
polish-engine/
├── src/
│   ├── polish-engine.ts     # Main class that ties everything together
│   ├── tokenizer.ts         # Expression tokenizer
│   ├── polish-parser.ts     # Converts infix expressions to RPN
│   ├── polish-evaluator.ts  # Evaluates RPN and functions
│   ├── PreprocessModule.ts  # Normalizes and transforms expressions (symbols → functions)
│   └── functionsModule.ts   # Custom mathematical functions
│
├── tests/
│   ├── tokenizer.test.ts
│   ├── parser.test.ts
│   ├── evaluator.test.ts
│   └── polish-engine.test.ts
│
├── package.json
├── tsconfig.json
├── jest.config.js
├── LICENCE
└── README.md

```

---

##  Example Integration

You can easily integrate `polishEngine` into your calculator, educational, or simulation projects.

```ts
const result = engine.evaluate("sin(pi / 2) + sqrt(16)");
console.log(result); // 5
```

---

##  Running Tests

Run all unit tests using Jest:

```bash
npx jest --verbose
```

Example output:

```
 PASS  tests/polish-engine.test.ts
  polishEngine
    ✓ should evaluate a simple expression
    ✓ should handle parentheses correctly
    ✓ should calculate factorial
```

---

##  Tech Stack

- **Language:** TypeScript
- **Testing:** Jest
- **Math Library:** complex.js
- **Module Format:** ES Modules

---

##  Example File: `polish-engine.ts`

```ts
import { Tokenizer } from "./tokenizer";
import { parser } from "./polish-parser";
import { evaluator } from "./polish-evaluator";
import { preprocessExpression } from "./PreprocessModule";
import Complex from "complex.js";

export class polishEngine {
    private tokenizer = new Tokenizer();
    private Parser = new parser(this.tokenizer);
    private Evaluator = new evaluator();

    evaluate(expression: string, variables?: Record<string, number>) {
        const preprocessed = preprocessExpression(expression);
        const tokens = this.tokenizer.tokenize(preprocessed);
        const rpn = this.Parser.toPostFix(tokens);
        const result = this.Evaluator.evaluatePostFix(rpn, variables);

        if (result instanceof Complex) {
            if (result.im === 0) return result.re;
            return result;
        }
        return result;
    }
}
```
---
## Author

**Jonathan Ventura**
GitHub: [JVenturaDev](https://github.com/JVenturaDev)

---

**License**

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** — see the [LICENSE](LICENSE) file for full details.

© 2025 Jonathan Ventura.
You are free to use, modify, and distribute this software under the same license terms, provided that proper attribution and a copy of the GPL v3 are included.

---

## Contributing

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/new-feature`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Create a Pull Request.

Contributions are welcome! 
