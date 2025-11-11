import { evaluator } from '../src/polish-evaluator';
import { Token } from '../src/tokenizer';
import { Tokenizer } from '../src/tokenizer';
import { parser } from '../src/polish-parser';
import { Complex } from 'complex.js';

describe('evaluator', () => {
    const tokenizer = new Tokenizer();
    const Parser = new parser(tokenizer);
    const Evalr = new evaluator();

    function evalExpr(expr: string, variables: Record<string, number> = {}): number | Complex {
        const tokens = tokenizer.tokenize(expr);
        const postfix = Parser.toPostFix(tokens);
        const result = Evalr.evaluatePostFix(postfix, variables);
        if (result instanceof Complex) {
            if (result.im === 0) return result.re;
            return result;
        }

        return result;
    }

    test('evaluates simple numbers', () => {
        expect(evalExpr('2')).toBe(2);
        expect(evalExpr('3.5')).toBe(3.5);
        console.log(evalExpr("sqrt(-9)"));
    });

    test('evaluates constants', () => {
        expect(evalExpr('π')).toBeCloseTo(Math.PI);
        expect(evalExpr('e')).toBeCloseTo(Math.E);
    });

    test('evaluates variables', () => {
        expect(evalExpr('x', { x: 10 })).toBe(10);
        expect(() => evalExpr('y')).toThrow('Variable no definida: y');
    });

    test('evaluates basic operators', () => {
        expect(evalExpr('2+3')).toBe(5);
        expect(evalExpr('5-2')).toBe(3);
        expect(evalExpr('4*2')).toBe(8);
        expect(evalExpr('8/2')).toBe(4);
        expect(evalExpr('2^3')).toBe(8);
    });

    test('evaluates comparisons', () => {
        expect(evalExpr('2<3')).toBe(1);
        expect(evalExpr('5>10')).toBe(0);
        expect(evalExpr('5≤5')).toBe(1);
        expect(evalExpr('5≥5')).toBe(1);
        expect(evalExpr('3⩵3')).toBe(1);
        expect(evalExpr('3≠4')).toBe(1);
    });

    test('evaluates single-arg functions', () => {
        expect(evalExpr('sin(0)')).toBeCloseTo(0);
        expect(evalExpr('cos(0)')).toBeCloseTo(1);
        expect(evalExpr('sqrt(4)')).toBe(2);
        expect(evalExpr('cbrt(27)')).toBe(3);
        expect(evalExpr('abs(-5)')).toBe(5);
        expect(evalExpr('factorial(4)')).toBe(24);
        expect(evalExpr('%(50)')).toBe(0.5);
    });

    test('evaluates multi-arg functions', () => {
        const tokens: Token[] = [
            { type: 'number', value: '8' },
            { type: 'number', value: '2' },
            { type: 'function', value: 'logxy' },
        ];
        const result = Evalr.evaluatePostFix(tokens);
        expect(result).toBe(3);

        const modTokens: Token[] = [
            { type: 'number', value: '10' },
            { type: 'number', value: '3' },
            { type: 'function', value: 'mod' },
        ];

        expect(Evalr.evaluatePostFix(modTokens)).toBe(1);
    });

    test('evaluates negative bases with fractional powers (complex)', () => {
        const res = evalExpr('-8^0.5');

        if (typeof res === 'number') {
            expect(res).toBeCloseTo(2.82842712474619);
        } else {
            expect(res.re).toBeCloseTo(0);
            expect(res.im).toBeCloseTo(2.82842712474619);
        }

    });

    test('throws on insufficient operands', () => {
        expect(() => evalExpr('+')).toThrow('Error: operandos insuficientes');
        expect(() => evalExpr('2 +')).toThrow('Error: operandos insuficientes');
    });

    test('throws on missing function arguments', () => {
        const tokens: Token[] = [{ type: 'function', value: 'sin' }];
        expect(() => Evalr.evaluatePostFix(tokens)).toThrow('Argumento faltante para sin');
    });

    test('throws on unknown function', () => {
        const tokens: Token[] = [{ type: 'number', value: '2' }, { type: 'function', value: 'unknown' }];
        expect(() => Evalr.evaluatePostFix(tokens)).toThrow('Función desconocida: unknown');
    });

    test('throws on malformed expression', () => {
        const tokens: Token[] = [
            { type: 'number', value: '2' },
            { type: 'operator', value: '+' },
            { type: 'number', value: '3' },
            { type: 'number', value: '4' }
        ];
        expect(() => Evalr.evaluatePostFix(tokens)).toThrow('Error: operandos insuficientes');
    });
});
