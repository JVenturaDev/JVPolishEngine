import { describe, expect, test } from "vitest";
import Complex from "complex.js";
import { polishEngine } from "../src/polish-engine";

type NormalizedReal = {
    type: "real";
    value: number;
    display: string;
};

type NormalizedComplex = {
    type: "complex";
    re: number;
    im: number;
    display: string;
};

type NormalizedStep = {
    type: "Operator" | "Function";
    name: string;
    operands: Array<NormalizedReal | NormalizedComplex>;
    result: NormalizedReal | NormalizedComplex;
    stackBefore: Array<NormalizedReal | NormalizedComplex>;
    stackAfter: Array<NormalizedReal | NormalizedComplex>;
};

type EvaluationWithSteps = {
    result: NormalizedReal | NormalizedComplex;
    steps: NormalizedStep[];
};

function expectEvaluationWithSteps(value: unknown): asserts value is EvaluationWithSteps {
    expect(value).toEqual({
        result: expect.any(Object),
        steps: expect.any(Array)
    });
}

describe("polishEngine", () => {
    const engine = new polishEngine();

    test("returns a normalized result and evaluation steps by default", () => {
        const output = engine.evaluate("2+3");

        expectEvaluationWithSteps(output);
        expect(output.result).toEqual({ type: "real", value: 5, display: "5" });
        expect(output.steps).toHaveLength(1);
        expect(output.steps[0]).toMatchObject({
            type: "Operator",
            name: "+",
            operands: [
                { type: "real", value: 2, display: "2" },
                { type: "real", value: 3, display: "3" }
            ],
            result: { type: "real", value: 5, display: "5" }
        });
    });

    test("returns only the normalized result when steps are disabled", () => {
        const output = engine.evaluate("2+3", { steps: false });

        expect(output).toEqual({ type: "real", value: 5, display: "5" });
    });

    test("returns raw values when normalization is disabled", () => {
        const output = engine.evaluate("2+3", {
            steps: false,
            normalize: false
        });

        expect(output).toBe(5);
    });

    test("normalizes sqrt of a negative number as a complex result", () => {
        const output = engine.evaluate("sqrt(-4)");

        expectEvaluationWithSteps(output);
        expect(output.result).toEqual({
            type: "complex",
            re: 0,
            im: 2,
            display: "2i"
        });
    });

    test("supports the legacy variables input", () => {
        const output = engine.evaluate("2x+1", { x: 3 });

        expectEvaluationWithSteps(output);
        expect(output.result).toEqual({ type: "real", value: 7, display: "7" });
    });

    test("supports the options variables input", () => {
        const output = engine.evaluate("2x+1", {
            variables: { x: 3 },
            steps: true
        });

        expectEvaluationWithSteps(output);
        expect(output.result).toEqual({ type: "real", value: 7, display: "7" });
    });

    test("includes stackBefore in each evaluation step", () => {
        const output = engine.evaluate("2+3");

        expectEvaluationWithSteps(output);
        expect(output.steps[0].stackBefore).toEqual([
            { type: "real", value: 2, display: "2" },
            { type: "real", value: 3, display: "3" }
        ]);
    });

    test("includes stackAfter in each evaluation step", () => {
        const output = engine.evaluate("2+3");

        expectEvaluationWithSteps(output);
        expect(output.steps[0].stackAfter).toEqual([
            { type: "real", value: 5, display: "5" }
        ]);
    });

    test("normalizes operands, result, stackBefore, and stackAfter inside steps", () => {
        const output = engine.evaluate("2+3");

        expectEvaluationWithSteps(output);
        const step = output.steps[0];

        expect(step.operands.every(value => value.type === "real")).toBe(true);
        expect(step.result).toEqual({ type: "real", value: 5, display: "5" });
        expect(step.stackBefore.every(value => value.type === "real")).toBe(true);
        expect(step.stackAfter.every(value => value.type === "real")).toBe(true);
    });

    test("normalizes complex values inside steps", () => {
        const output = engine.evaluate("sqrt(-4)");

        expectEvaluationWithSteps(output);
        expect(output.steps[0].result).toEqual({
            type: "complex",
            re: 0,
            im: 2,
            display: "2i"
        });
        expect(output.steps[0].stackAfter).toEqual([
            { type: "complex", re: 0, im: 2, display: "2i" }
        ]);
    });

    test("returns raw complex.js values when complex normalization is disabled", () => {
        const output = engine.evaluate("sqrt(-4)", {
            steps: false,
            normalize: false
        });

        expect(output).toBeInstanceOf(Complex);
        expect((output as Complex).re).toBeCloseTo(0);
        expect((output as Complex).im).toBeCloseTo(2);
    });

    test("keeps raw complex.js values inside steps when normalization is disabled", () => {
        const output = engine.evaluate("sqrt(-4)", {
            normalize: false
        });

        expect(output).toEqual({
            result: expect.any(Complex),
            steps: expect.any(Array)
        });

        const step = (output as { result: Complex; steps: Array<{ result: Complex; stackAfter: Complex[] }> }).steps[0];
        expect(step.result).toBeInstanceOf(Complex);
        expect(step.result.re).toBeCloseTo(0);
        expect(step.result.im).toBeCloseTo(2);
        expect(step.stackAfter[0]).toBeInstanceOf(Complex);
    });

    test("evaluates common arithmetic with steps disabled", () => {
        expect(engine.evaluate("2+3*5", { steps: false })).toEqual({
            type: "real",
            value: 17,
            display: "17"
        });
        expect(engine.evaluate("(2+3)*5", { steps: false })).toEqual({
            type: "real",
            value: 25,
            display: "25"
        });
        expect(engine.evaluate("2^3", { steps: false })).toEqual({
            type: "real",
            value: 8,
            display: "8"
        });
        expect(engine.evaluate("4!", { steps: false })).toEqual({
            type: "real",
            value: 24,
            display: "24"
        });
    });

    test("throws clear errors for malformed expressions", () => {
        expect(() => engine.evaluate("")).toThrow("Error: malformed expression");
        expect(() => engine.evaluate("2+3)")).toThrow("Invalid parentheses");
    });
});
