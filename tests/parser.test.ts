import { Tokenizer } from "../src/tokenizer";
import { parser } from "../src/polish-parser";
import { describe, test, expect } from "vitest";

describe("parser and tokenizer", () => {
    const tokenizer = new Tokenizer;
    const p = new parser(tokenizer);
    function tokensValues(expr: string) {
        const tokens = tokenizer.tokenize(expr);
        return p.toPostFix(tokens).map(t => t.value);
    }
    test("simple addition", () => {
        expect(tokensValues("2+3")).toEqual(["2", "3", "+"]);
    });
    test("operator precedence", () => {
        expect(tokensValues("2+3*4")).toEqual(["2", "3", "4", "*", "+"]);
    });
    test("paren", () => {
        expect(tokensValues("(2+3)*4")).toEqual(["2", "3", "+", "4", "*"]);
    });
    test("functions", () => {
        expect(tokensValues("sin(π/2)")).toEqual(["π", "2", "/", "sin"]);
    });
    test("var", () => {
        expect(tokensValues("x+5")).toEqual(["x", "5", "+"]);
    });
    test("right-associative exponent", () => {
        expect(tokensValues("2^3^2")).toEqual(["2", "3", "2", "^", "^"]);
    });
    test("right-associative exponent2", () => {
        expect(tokensValues("3^2!")).toEqual(["3", "2", "!", "^"]);
    });
    test('subtraction keeps operands in postfix order', () => {
        const tokens = tokenizer.tokenize('5-2');
        const postfix = p.toPostFix(tokens);
        expect(postfix.map(t => t.value)).toEqual(['5', '2', '-']);
    });
});
