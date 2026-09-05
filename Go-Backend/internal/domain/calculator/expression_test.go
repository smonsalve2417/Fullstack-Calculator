package calculator

import (
	"errors"
	"testing"
)

func TestEvaluateBinaryExpression(t *testing.T) {
	expression := Binary{
		Operator: "add",
		Left:     Literal{Value: 2},
		Right: Binary{
			Operator: "multiply",
			Left:     Literal{Value: 3},
			Right:    Literal{Value: 4},
		},
	}

	result, err := Evaluate(expression)
	if err != nil {
		t.Fatalf("Evaluate() error = %v", err)
	}
	if result != 14 {
		t.Fatalf("Evaluate() = %v, want 14", result)
	}
}

func TestEvaluateUnaryExpression(t *testing.T) {
	result, err := Evaluate(Unary{
		Operator: "sqrt",
		Operand:  Literal{Value: 9},
	})
	if err != nil {
		t.Fatalf("Evaluate() error = %v", err)
	}
	if result != 3 {
		t.Fatalf("Evaluate() = %v, want 3", result)
	}
}

func TestEvaluateDivisionByZero(t *testing.T) {
	_, err := Evaluate(Binary{
		Operator: "divide",
		Left:     Literal{Value: 10},
		Right:    Literal{Value: 0},
	})
	if !errors.Is(err, ErrDivisionByZero) {
		t.Fatalf("Evaluate() error = %v, want ErrDivisionByZero", err)
	}
}
