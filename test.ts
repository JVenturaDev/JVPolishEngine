
import { polishEngine } from "./dist/polish-engine.js";
const engine = new polishEngine();

console.log("2 + 3 * 4 =", engine.evaluate("2 + 3 * 4"));
console.log("(2 + 3) * 4 =", engine.evaluate("(2 + 3)4"));