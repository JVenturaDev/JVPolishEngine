import { Complex } from 'complex.js';
import type { Token } from './tokenizer.js';
import { factorial } from './functionsModule.js';
export type Step = {
    type: "Operator" | "Function";
    name: string;
    operands: (number | Complex)[];
    result: number | Complex;
    stackBefore: (number | Complex)[];
    stackAfter: (number | Complex)[];
}
export class evaluator {
    constructor() {
    }
    public evaluatePostFix(tokens: Token[], variables: Record<string, number> = {},
        returnSteps = false): number | Complex | { result: number | Complex; steps: Step[] } {
        const stack: (number | Complex)[] = [];
        const steps: Step[] = [];
        const unaryOps = new Set(['!', 'u-']);
        const toReal = (val: number | Complex): Complex => {
            if (val instanceof Complex) return val;
            return new Complex(val);
        };
        for (const token of tokens) {
            // number if  
            if (token.type === 'number') {
                stack.push(Number(token.value));
            }
            // var if
            else if (token.type === 'variable') {
                if (token.value === 'π') stack.push(Math.PI);
                else if (token.value === 'e') stack.push(Math.E);
                else if (variables && Object.prototype.hasOwnProperty.call(variables, token.value)) {
                    stack.push(variables[token.value]);
                } else {
                    throw new Error(`Undefined variable: ${token.value}`);
                }
            }
            // operator if
            else if (token.type === 'operator') {
                if (unaryOps.has(token.value)) {
                    const stackBefore = [...stack];

                    const a = stack.pop();

                    if (a === undefined)
                        throw new Error('Error: insufficient operands');

                    const result = this.applyOperation(token.value, a);

                    stack.push(result);

                    steps.push({
                        type: 'Operator',
                        name: token.value,
                        operands: [a],
                        result,
                        stackBefore,
                        stackAfter: [...stack]
                    });
                }
                else {
                    const stackBefore = [...stack];

                    const b = stack.pop();
                    const a = stack.pop();

                    if (a === undefined || b === undefined)
                        throw new Error('Error: insufficient operands');

                    const result = this.applyOperation(token.value, a, b);

                    stack.push(result);

                    steps.push({
                        type: 'Operator',
                        name: token.value,
                        operands: [a, b],
                        result,
                        stackBefore,
                        stackAfter: [...stack]
                    });

                }
            }

            // function if
            else if (token.type === 'function') {
                const stackBefore = [...stack];

                const a = stack.pop();
                if (a === undefined) throw new Error(`Missing argument for ${token.value}`);

                let result: number | Complex;

                switch (token.value) {
                    case 'sin': result = Math.sin(toReal(a).re); break;
                    case 'cos': result = Math.cos(toReal(a).re); break;
                    case 'tan': result = Math.tan(toReal(a).re); break;
                    case 'asin': result = Math.asin(toReal(a).re); break;
                    case 'acos': result = Math.acos(toReal(a).re); break;
                    case 'atan': result = Math.atan(toReal(a).re); break;
                    case 'asec': result = Math.asec(toReal(a).re); break;
                    case 'acsc': result = Math.acsc(toReal(a).re); break;
                    case 'acot': result = Math.acot(toReal(a).re); break;
                    case 'sinh': result = Math.sinh(toReal(a).re); break;
                    case 'cosh': result = Math.cosh(toReal(a).re); break;
                    case 'tanh': result = Math.tanh(toReal(a).re); break;
                    case 'sech': result = Math.sech(toReal(a).re); break;
                    case 'csch': result = Math.csch(toReal(a).re); break;
                    case 'coth': result = Math.coth(toReal(a).re); break;
                    case 'asinh': result = Math.asinh(toReal(a).re); break;
                    case 'acosh': result = Math.acosh(toReal(a).re); break;
                    case 'atanh': result = Math.atanh(toReal(a).re); break;
                    case 'asech': result = Math.asech(toReal(a).re); break;
                    case 'acsch': result = Math.acsch(toReal(a).re); break;
                    case 'acoth': result = Math.acoth(toReal(a).re); break;

                    case 'ln': result = Math.log(toReal(a).re); break;
                    case 'log': result = Math.log10(toReal(a).re); break;
                    case 'sqrt': result = toReal(a).sqrt(); break;
                    case 'cbrt': result = toReal(a).pow(new Complex(1 / 3)); break;
                    case 'abs': result = Math.abs(toReal(a).re); break;
                    case '%': result = toReal(a).re * 0.01; break;
                    case 'dms': result = Math.DMS(toReal(a).re); break;

                    case 'logxy': {
                        const y = stack.pop();
                        if (y === undefined) throw new Error("Missing argument for logxy");

                        const operands = [y, a];
                        result = Math.logxy(toReal(y).re, toReal(a).re);

                        stack.push(result);

                        steps.push({
                            type: 'Function',
                            name: 'logxy',
                            operands,
                            result,
                            stackBefore,
                            stackAfter: [...stack]
                        });

                        break;
                    }

                    case 'exp': {
                        const b = stack.pop();
                        if (b === undefined) throw new Error("Missing argument for exp");

                        const operands = [b, a];
                        result = Math.EXPT(toReal(b).re, toReal(a).re);

                        stack.push(result);

                        steps.push({
                            type: 'Function',
                            name: 'exp',
                            operands,
                            result,
                            stackBefore,
                            stackAfter: [...stack]
                        });

                        break;
                    }

                    case 'yroot': {
                        const y = stack.pop();
                        if (y === undefined) throw new Error("Missing argument for yroot");

                        const operands = [y, a];
                        result = Math.pow(toReal(y).re, 1 / toReal(a).re);

                        stack.push(result);

                        steps.push({
                            type: 'Function',
                            name: 'yroot',
                            operands,
                            result,
                            stackBefore,
                            stackAfter: [...stack]
                        });

                        break;
                    }

                    case 'deg': {
                        const s = stack.pop();
                        const m = stack.pop();
                        const g = stack.pop();

                        if (g === undefined || m === undefined || s === undefined)
                            throw new Error("Missing argument for DEG");

                        const operands = [g, m, s];
                        result = Math.DEG(toReal(g).re, toReal(m).re, toReal(s).re);

                        stack.push(result);

                        steps.push({
                            type: 'Function',
                            name: 'deg',
                            operands,
                            result,
                            stackBefore,
                            stackAfter: [...stack]
                        });

                        break;
                    }

                    case 'mod': {
                        const b = stack.pop();
                        if (b === undefined) throw new Error("Missing argument for mod");

                        const operands = [b, a];
                        result = Math.mod(toReal(b).re, toReal(a).re);

                        stack.push(result);

                        steps.push({
                            type: 'Function',
                            name: 'mod',
                            operands,
                            result,
                            stackBefore,
                            stackAfter: [...stack]
                        });

                        break;
                    }

                    default:
                        throw new Error(`Unknown function: ${token.value}`);
                }

                if (!['logxy', 'exp', 'yroot', 'deg', 'mod'].includes(token.value)) {
                    stack.push(result);

                    steps.push({
                        type: 'Function',
                        name: token.value,
                        operands: [a],
                        result,
                        stackBefore,
                        stackAfter: [...stack]
                    });
                }
            }

        }

        if (stack.length !== 1)
            throw new Error('Error: malformed expression');

        if (returnSteps) return { result: stack[0], steps };
        return stack[0];

    }
    private applyOperation(op: string, a: number | Complex, b?: number | Complex): number | Complex {
        const A = a instanceof Complex ? a : new Complex(a);
        const B = b instanceof Complex ? b : b !== undefined ? new Complex(b) : undefined;

        switch (op) {
            // binary operators
            case '+': return A.add(B!);
            case '-': return A.sub(B!);
            case '*': return A.mul(B!);
            case '/': return A.div(B!);
            case '^': return A.pow(B!);

            // unary factorial operator
            case '!':
                if (a instanceof Complex) throw new Error("Cannot calculate the factorial of a complex number");
                return factorial(a);

            // comparisons
            case '<':
            case '>':
            case '≤':
            case '≥':
            case '=':
            case '==':
            case '⩵':
            case '≠':
                if (a instanceof Complex || b instanceof Complex)
                    throw new Error("Cannot compare complex numbers");
                switch (op) {
                    case '<': return a < b! ? 1 : 0;
                    case '>': return a > b! ? 1 : 0;
                    case '≤': return a <= b! ? 1 : 0;
                    case '≥': return a >= b! ? 1 : 0;
                    case '=':
                    case '==':
                    case '⩵': return a === b! ? 1 : 0;
                    case '≠': return a !== b! ? 1 : 0;
                }

            default:
                throw new Error(`Unknown operator: ${op}`);
        }
    }


}
