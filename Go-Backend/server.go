package main

import (
	"log"
	"net/http"

	"go_backend/internal/application"
	calculatorhttp "go_backend/internal/transport/http"
)

func main() {
	useCase := application.NewCalculateUseCase()
	handler := calculatorhttp.NewHandler(useCase)

	log.Println("Server is starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", withCORS(handler)))
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		origin := request.Header.Get("Origin")
		if origin == "http://localhost:5173" || origin == "http://localhost:5174" {
			writer.Header().Set("Access-Control-Allow-Origin", origin)
			writer.Header().Set("Vary", "Origin")
		}
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		if request.Method == http.MethodOptions {
			writer.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(writer, request)
	})
}
