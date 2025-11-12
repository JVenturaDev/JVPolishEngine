import { Tokenizer } from "../src/tokenizer";
describe('Tokenizer', () => {
    const tokenizer = new Tokenizer;
    test('tokenizes simple numbers and operators', () => {
        const tokens = tokenizer.tokenize('2+3');
        expect(tokens).toEqual([
            { type: 'number', value: '2' },
            { type: 'operator', value: '+' },
            { type: 'number', value: '3' },
        ]);
    });
    test('tokenizes parentheses correctly', () => {
        const tokens = tokenizer.tokenize('(2+3)*4');
        expect(tokens.map(t => t.value)).toEqual(['(', '2', '+', '3', ')', '*', '4']);
    });
    test('tokenizes functions', () => {
        const tokens = tokenizer.tokenize('sin(π/2)');
        expect(tokens.map(t => t.value)).toEqual(['sin', '(', 'π', '/', '2', ')']);
    });
    test('tokenizes factorial', () => {
        const tokens = tokenizer.tokenize('4!');
        expect(tokens.map(t => t.value)).toEqual(['4', '!']);
    });
    test('tokenizes factorial2', () => {
        const tokens = tokenizer.tokenize('3^2!');
        expect(tokens.map(t => t.value)).toEqual(['3', '^','2','!']);
    });
    test('tokenizes variables and negative numbers', () => {
        const tokens = tokenizer.tokenize('-x+5');
        expect(tokens.map(t => t.value)).toEqual(['-x', '+', '5']);
    });
    test('tokenizes variables and negative numbers', () => {
        const tokens = tokenizer.tokenize('x-y');
        expect(tokens.map(t => t.value)).toEqual(['x', '-', 'y']);
    });

})