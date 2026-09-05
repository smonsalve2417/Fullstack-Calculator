package http

import (
	"errors"

	"go_backend/internal/domain/calculator"
)

type expressionRequest struct {
	Type     string             `json:"type"`
	Value    *float64           `json:"value,omitempty"`
	Operator string             `json:"operator,omitempty"`
	Left     *expressionRequest `json:"left,omitempty"`
	Right    *expressionRequest `json:"right,omitempty"`
	Operand  *expressionRequest `json:"operand,omitempty"`
}

func (request expressionRequest) toDomain() (calculator.Expression, error) {
	switch request.Type {
	case "literal":
		if request.Value == nil {
			return nil, errors.New("literal value is required")
		}
		return calculator.Literal{Value: *request.Value}, nil
	case "binary":
		if request.Left == nil || request.Right == nil {
			return nil, errors.New("binary expression requires left and right")
		}
		left, err := request.Left.toDomain()
		if err != nil {
			return nil, err
		}
		right, err := request.Right.toDomain()
		if err != nil {
			return nil, err
		}
		return calculator.Binary{Operator: request.Operator, Left: left, Right: right}, nil
	case "unary":
		if request.Operand == nil {
			return nil, errors.New("unary expression requires operand")
		}
		operand, err := request.Operand.toDomain()
		if err != nil {
			return nil, err
		}
		return calculator.Unary{Operator: request.Operator, Operand: operand}, nil
	default:
		return nil, errors.New("type must be literal, binary or unary")
	}
}
