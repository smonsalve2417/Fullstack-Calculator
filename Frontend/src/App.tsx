import { useMemo, useReducer, useState } from "react";
import { HttpCalculatorApi } from "./adapters/http/calculatorApi";
import { calculate } from "./application/calculate";
import { calculatorReducer } from "./domain/calculator/reducer";
import { initialCalculatorState } from "./domain/calculator/types";
import type { BinaryOperator } from "./domain/calculator/types";
import "./App.css";

const labels: Record<BinaryOperator, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
  power: "xʸ",
};

function App() {
  const [state, dispatch] = useReducer(
    calculatorReducer,
    initialCalculatorState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const api = useMemo(() => new HttpCalculatorApi("http://localhost:8080"), []);
  const expressionLabel = state.tokens
    .map((token) =>
      token.kind === "number" ? token.value : labels[token.value],
    )
    .join(" ");

  async function handleEquals() {
    setIsLoading(true);
    try {
      dispatch({ type: "result", value: await calculate(state, api) });
    } catch (error) {
      dispatch({
        type: "error",
        message: error instanceof Error ? error.message : "No se pudo calcular",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const digit = (value: string) => dispatch({ type: "digit", value });
  const operator = (value: BinaryOperator) =>
    dispatch({ type: "operator", value });

  return (
    <main className="shell">
      <section className="calculator" aria-label="Calculadora">
        <div className="display-panel">
          <span className="expression">{expressionLabel || "0"}</span>
          <output aria-live="polite">
            {isLoading ? "..." : state.currentInput}
          </output>
        </div>
        {state.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
        <div className="keypad">
          <button
            className="utility"
            onClick={() => dispatch({ type: "clear" })}
          >
            AC
          </button>
          <button
            className="utility"
            onClick={() => dispatch({ type: "backspace" })}
            aria-label="Borrar último dígito"
          >
            Del
          </button>
          <button className="operator" onClick={() => operator("power")}>
            xʸ
          </button>
          <button className="operator" onClick={() => operator("divide")}>
            ÷
          </button>
          {["7", "8", "9"].map((value) => (
            <button key={value} onClick={() => digit(value)}>
              {value}
            </button>
          ))}
          <button className="operator" onClick={() => operator("multiply")}>
            ×
          </button>
          {["4", "5", "6"].map((value) => (
            <button key={value} onClick={() => digit(value)}>
              {value}
            </button>
          ))}
          <button className="operator" onClick={() => operator("subtract")}>
            −
          </button>
          {["1", "2", "3"].map((value) => (
            <button key={value} onClick={() => digit(value)}>
              {value}
            </button>
          ))}
          <button className="operator" onClick={() => operator("add")}>
            +
          </button>
          <button className="zero" onClick={() => digit("0")}>
            0
          </button>
          <button onClick={() => dispatch({ type: "decimal" })}>.</button>
          <button
            className="equals"
            onClick={handleEquals}
            disabled={isLoading}
          >
            =
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
