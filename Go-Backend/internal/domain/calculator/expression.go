package calculator

import "errors"

var (
	ErrInvalidOperation = errors.New("invalid operation")
	ErrDivisionByZero   = errors.New("division by zero")
	ErrNegativeRoot     = errors.New("square root of a negative number")
)

type Expression interface {
	isExpression()
}

type Literal struct {
	Value float64
}

func (Literal) isExpression() {}

type Binary struct {
	Operator string
	Left     Expression
	Right    Expression
}

func (Binary) isExpression() {}

type Unary struct {
	Operator string
	Operand  Expression
}

func (Unary) isExpression() {}

func Evaluate(expression Expression) (float64, error) {
	switch node := expression.(type) {
	case Literal:
		return node.Value, nil
	case Binary:
		return evaluateBinary(node)
	case Unary:
		return evaluateUnary(node)
	default:
		return 0, ErrInvalidOperation
	}
}

func evaluateBinary(node Binary) (float64, error) {
	left, err := Evaluate(node.Left)
	if err != nil {
		return 0, err
	}
	right, err := Evaluate(node.Right)
	if err != nil {
		return 0, err
	}

	switch node.Operator {
	case "add":
		return left + right, nil
	case "subtract":
		return left - right, nil
	case "multiply":
		return left * right, nil
	case "divide":
		if right == 0 {
			return 0, ErrDivisionByZero
		}
		return left / right, nil
	case "power":
		return power(left, right), nil
	default:
		return 0, ErrInvalidOperation
	}
}

func evaluateUnary(node Unary) (float64, error) {
	operand, err := Evaluate(node.Operand)
	if err != nil {
		return 0, err
	}

	switch node.Operator {
	case "root", "sqrt":
		if operand < 0 {
			return 0, ErrNegativeRoot
		}
		return sqrt(operand), nil
	case "percentage":
		return operand / 100, nil
	default:
		return 0, ErrInvalidOperation
	}
}
