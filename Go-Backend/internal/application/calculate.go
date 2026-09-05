package application

import (
	"context"

	"go_backend/internal/domain/calculator"
)

type CalculateUseCase struct{}

func NewCalculateUseCase() *CalculateUseCase {
	return &CalculateUseCase{}
}

func (CalculateUseCase) Execute(ctx context.Context, expression calculator.Expression) (float64, error) {
	if err := ctx.Err(); err != nil {
		return 0, err
	}
	return calculator.Evaluate(expression)
}
