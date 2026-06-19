import { polishEngine } from "./dist/polish-engine.js";

const engine = new polishEngine();

function test(label: string, expression: string, options: any = {}) {
    console.log(`\n--- ${label} ---`);
    console.dir(engine.evaluate(expression, options), { depth: null });
}

test("without explicit steps / normalized", "2 + 3 * 4");

test("with steps / normalized", "2 + 3 * 4", {
    steps: true
});

test("normalized complex result", "sqrt(-4)");

test("raw complex result", "sqrt(-4)", {
    normalize: false
});

test("complex result with steps", "sqrt(-4)", {
    steps: true
});

test("legacy variables API", "2x + 1", {
    x: 3
});

test("options variables API with steps", "2x + 1", {
    variables: { x: 3 },
    steps: true
});

test("implicit multiplication", "(2 + 3)4", {
    steps: true
});

test("unary function", "sin(0)", {
    steps: true
});

test("multi-argument mod function", "mod(10, 3)", {
    steps: true
});
test("raw values with steps", "2 + 3 * 4", {
    steps: true, normalize: false
});

console.log("4 cases")
console.dir(engine.evaluate("2+3"), { depth: null });

console.dir(engine.evaluate("2+3", {
  steps: false
}), { depth: null });

console.dir(engine.evaluate("sqrt(-4)"), { depth: null });

console.dir(engine.evaluate("sqrt(-4)", {
  normalize: false
}), { depth: null });
