import { Tokenizer } from "./tokenizer";
import { parser } from "./polish-parser";
import { evaluator } from "./polish-evaluator";
import { ButtonFunctions } from "./functionsModule";
import Complex from "complex.js";
export class polishEngine {
    private tokenizer = new Tokenizer();
    private Parser = new parser(this.tokenizer);
    private Evaluator = new evaluator();

    evaluate(expression: string, variables?: Record<string, number>) {
        const preprocessed = this.tokenizer.preprocessExpression(expression);
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
const engine = new polishEngine;
console.log(engine.evaluate("6*10-20*9"));