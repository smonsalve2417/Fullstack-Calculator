package http

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"go_backend/internal/application"
	"go_backend/internal/domain/calculator"
)

type fakeCalculator struct {
	result float64
	err    error
}

func (fake fakeCalculator) Execute(context.Context, calculator.Expression) (float64, error) {
	return fake.result, fake.err
}

func TestHandlerCalculatesNestedExpression(t *testing.T) {
	requestBody := `{
		"type": "binary",
		"operator": "add",
		"left": {"type": "literal", "value": 2},
		"right": {
			"type": "binary",
			"operator": "multiply",
			"left": {"type": "literal", "value": 3},
			"right": {"type": "literal", "value": 4}
		}
	}`
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", strings.NewReader(requestBody))
	response := httptest.NewRecorder()

	NewHandler(application.NewCalculateUseCase()).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", response.Code, http.StatusOK, response.Body.String())
	}
	if response.Body.String() != "{\"result\":14}\n" {
		t.Fatalf("body = %q, want result 14", response.Body.String())
	}
}

func TestHandlerRejectsUnsupportedMethod(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/api/v1/calculations", nil)
	response := httptest.NewRecorder()

	NewHandler(fakeCalculator{result: 5}).ServeHTTP(response, request)

	if response.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusMethodNotAllowed)
	}
}

func TestHandlerRejectsInvalidExpression(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/api/v1/calculations", strings.NewReader(`{"type":"binary"}`))
	response := httptest.NewRecorder()

	NewHandler(fakeCalculator{result: 5}).ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
}
