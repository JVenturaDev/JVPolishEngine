import Complex from "complex.js";
import type { Step } from "./polish-evaluator.js";

export type RawValue = number | Complex;

export type NormalizedValue =
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

export class ResultNormalizer {
    normalize(value: RawValue): NormalizedValue {
        if (value instanceof Complex) {
            if (value.im === 0) {
                return {
                    type: "real",
                    value: value.re,
                    display: String(value.re)
                };
            }

            return {
                type: "complex",
                re: value.re,
                im: value.im,
                display: this.formatComplex(value)
            };
        }

        return {
            type: "real",
            value,
            display: String(value)
        };
    }
    normalizeStep(step: Step) {
        return {
            ...step,
            operands: step.operands.map(v => this.normalize(v)),
            result: this.normalize(step.result),
            stackBefore: step.stackBefore.map(v => this.normalize(v)),
            stackAfter: step.stackAfter.map(v => this.normalize(v))
        };
    }

    normalizeSteps(steps: Step[]) {
        return steps.map(step => this.normalizeStep(step));
    }
    simplify(value: RawValue): RawValue {
        if (value instanceof Complex && value.im === 0) {
            return value.re;
        }

        return value;
    }

    private formatComplex(value: Complex): string {
        if (value.re === 0) return `${value.im}i`;
        return `${value.re}${value.im >= 0 ? "+" : ""}${value.im}i`;
    }
}
