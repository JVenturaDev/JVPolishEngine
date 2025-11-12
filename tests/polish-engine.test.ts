import { polishEngine } from "../src/polish-engine";
describe('polishEngine', () => {
    const engine = new polishEngine();

    test("should evaluate a simple expression", () => {
        const result = engine.evaluate("2+3*5");
        expect(result).toBe(17);
    })
    test("should handle parentheses correctly", () => {
        const result = engine.evaluate("(2+3)*5");
        expect(result).toBe(25);

    });
    test("You must manage the elevation correctly", () => {
        const result = engine.evaluate("2^3");
        expect(result).toBe(8);

    });
    test("You must manage the elevation correctly", () => {
        const result = engine.evaluate("'-8^0.5");
        if (typeof result === 'number') {
            expect(result).toBeCloseTo(2.82842712474619);
        } else {
            expect(result.re).toBeCloseTo(0, 12);
            expect(result.im).toBeCloseTo(2.82842712474619, 12);
        }

    });
    test("should calculate factorial", () => {
        const result = engine.evaluate("4!");
        expect(result).toBe(24);

    });
    test("should calculate factorial elevation", () => {
        const result = engine.evaluate("3^2!");
        expect(result).toBe(9);

    });
    test("pi", () => {
        const result = engine.evaluate("π");
        expect(result).toBe(3.141592653589793);

    });
    test("should use variables correctly", () => {
        const result = engine.evaluate("a+b*2", { a: 3, b: 4 });
        expect(result).toBe(11);

    });
    expect(() => engine.evaluate("")).toThrow("expresión mal formada");
    expect(() => engine.evaluate("2+3)")).toThrow("Paréntesis incorrectos");

});
