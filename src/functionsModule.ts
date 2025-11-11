import Complex from "complex.js";
export const ButtonFunctions = {
    factorial,
    DEG: Math.DEG,
    DMS: Math.DMS,
    raizCompleja: Math.raizCompleja,
    raizCubicaCompleja: Math.raizCubicaCompleja,
    mod: Math.mod,
    EXPT: Math.EXPT,
    logxy: Math.logxy,
    sec: Math.sec,
    cot: Math.cot,
    csc: Math.csc,
    asec: Math.asec,
    acot: Math.acot,
    acsc: Math.acsc,
    sech: Math.sech,
    coth: Math.coth,
    csch: Math.csch,
    acoth: Math.acoth,
    asech: Math.asech,
    acsch: Math.acsch,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    ln: Math.log,
    sqrt: Math.sqrt,
    abs: Math.abs,
    PI: Math.PI,
    E: Math.E
};
declare global {
    interface Math {
        ln: (x: number) => number;
        sec: (x: number) => number;
        cot: (x: number) => number;
        csc: (x: number) => number;
        asec: (x: number) => number;
        acot: (x: number) => number;
        acsc: (x: number) => number;
        sech: (x: number) => number;
        coth: (x: number) => number;
        csch: (x: number) => number;
        acoth: (x: number) => number;
        asech: (x: number) => number;
        acsch: (x: number) => number;
        logxy: (x: number, y: number) => number;
        EXPT: (a: number, b: number) => number;
        mod: (a: number, b: number) => number;
        DMS: (x: number) => number;
        DEG: (g: number, m: number, s: number) => number;
        raizCompleja: (x: number) => number | Complex;
        raizCubicaCompleja: (x: number) => number | Complex;
    }
}
Math.sec = (x: number) => 1 / Math.cos(x);
Math.cot = (x: number) => 1 / Math.tan(x);
Math.csc = (x: number) => 1 / Math.sin(x);

Math.asec = (x: number) => Math.acos(1 / x);
Math.acot = (x: number) => Math.atan(1 / x);
Math.acsc = (x: number) => Math.asin(1 / x);

Math.sech = (x: number) => 1 / Math.cosh(x);
Math.coth = (x: number) => 1 / Math.tanh(x);
Math.csch = (x: number) => 1 / Math.sinh(x);

Math.acoth = (x: number) => 0.5 * Math.log((x + 1) / (x - 1));
Math.asech = (x: number) => Math.log((1 + Math.sqrt(1 - x * x)) / x);
Math.acsch = (x: number) => Math.log((1 / x) + Math.sqrt(1 + 1 / (x * x)));

Math.logxy = (x: number, y: number) => Math.log(x) / Math.log(y);
Math.EXPT = (a: number, b: number) => a * Math.pow(10, b);
Math.mod = (a: number, b: number) => ((a % b) + b) % b;
Math.DEG = (g: number, m: number, s: number): number => g + m / 60 + s / 3600;
Math.DMS = (x: number): number => {
    const grados = Math.floor(x);
    const minutosDecimal = (x - grados) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = (minutosDecimal - minutos) * 60;
    return grados + minutos / 60 + segundos / 3600;
};
if (typeof Math.ln !== "function") {
    Math.ln = (x: number) => Math.log(x);
}
Math.raizCompleja = (x: number) => (x >= 0 ? x ** 0.5 : new Complex(0, Math.sqrt(-x)));
Math.raizCubicaCompleja = (x: number) => (x >= 0 ? Math.cbrt(x) : new Complex(x, 0).pow(1 / 3));
export function factorial(n: number): number {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
