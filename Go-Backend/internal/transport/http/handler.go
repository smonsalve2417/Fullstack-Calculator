package http

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"go_backend/internal/domain/calculator"
)

type Calculator interface {
	Execute(context.Context, calculator.Expression) (float64, error)
}

type Handler struct {
	calculator Calculator
}

func NewHandler(calculator Calculator) *Handler {
	return &Handler{calculator: calculator}
}

func (handler *Handler) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	if request.URL.Path != "/api/v1/calculations" {
		writeError(writer, http.StatusNotFound, "NOT_FOUND", "route not found")
		return
	}
	if request.Method != http.MethodPost {
		writeError(writer, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "method not allowed")
		return
	}

	var requestDTO expressionRequest
	decoder := json.NewDecoder(http.MaxBytesReader(writer, request.Body, 1<<20))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&requestDTO); err != nil {
		writeError(writer, http.StatusBadRequest, "INVALID_REQUEST", "invalid JSON body")
		return
	}

	expression, err := requestDTO.toDomain()
	if err != nil {
		writeError(writer, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		return
	}

	result, err := handler.calculator.Execute(request.Context(), expression)
	if err != nil {
		status, code := domainError(err)
		writeError(writer, status, code, err.Error())
		return
	}

	writeJSON(writer, http.StatusOK, map[string]float64{"result": result})
}

func domainError(err error) (int, string) {
	switch {
	case errors.Is(err, calculator.ErrDivisionByZero):
		return http.StatusUnprocessableEntity, "DIVISION_BY_ZERO"
	case errors.Is(err, calculator.ErrNegativeRoot):
		return http.StatusUnprocessableEntity, "NEGATIVE_ROOT"
	case errors.Is(err, calculator.ErrInvalidOperation):
		return http.StatusUnprocessableEntity, "INVALID_OPERATION"
	default:
		return http.StatusInternalServerError, "INTERNAL_ERROR"
	}
}

func writeError(writer http.ResponseWriter, status int, code, message string) {
	writeJSON(writer, status, map[string]any{
		"error": map[string]string{"code": code, "message": message},
	})
}

func writeJSON(writer http.ResponseWriter, status int, value any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(value)
}
