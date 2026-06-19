import { Tokenizer } from "./tokenizer.js";
import { parser } from "./polish-parser.js";
import { evaluator } from "./polish-evaluator.js";
import { PreprocessModule } from "./preprocessModule.js";
import { ResultNormalizer } from "./result-normalizer.js";
import { EvaluateInput, EvaluateOptionsResolver } from "./evaluate-options-resolver.js";


export class polishEngine {
    private tokenizer = new Tokenizer();
    private Parser = new parser(this.tokenizer);
    private Evaluator = new evaluator();
    private preprocessModule = new PreprocessModule();
    private normalizer = new ResultNormalizer();
    private optionsResolver = new EvaluateOptionsResolver();
    private normalizeOutput(value: Parameters<ResultNormalizer["normalize"]>[0], enabled: boolean) {
        return enabled
            ? this.normalizer.normalize(value)
            : this.normalizer.simplify(value);
    }

    evaluate(expression: string, input: EvaluateInput = {}) {
        const options = this.optionsResolver.resolve(input);
        const preprocessed = this.preprocessModule.preprocessExpression(expression);
        const tokens = this.tokenizer.tokenize(preprocessed);
        const rpn = this.Parser.toPostFix(tokens);
        const evaluation = this.Evaluator.evaluatePostFix(rpn, options.variables, options.steps);
        if (
            typeof evaluation === "object" &&
            "result" in evaluation &&
            "steps" in evaluation
        ) {
            return {
                result: this.normalizeOutput(evaluation.result, options.normalize),
                steps: options.normalize
                    ? this.normalizer.normalizeSteps(evaluation.steps)
                    : evaluation.steps
            };
        }
        return this.normalizeOutput(evaluation, options.normalize);
    }

}