import { Tokenizer } from "./tokenizer.js";
import { parser } from "./polish-parser.js";
import { evaluator } from "./polish-evaluator.js";
import { preprocessExpression } from "./preprocessModule.js";
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

