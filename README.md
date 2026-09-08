# Fullstack Calc

A web calculator with a React + TypeScript frontend and a Go HTTP API. The frontend builds an expression AST and the backend evaluates it.

## Requirements

- Node.js 20+
- Go 1.25+
- Docker and Docker Compose (optional)

## Local Setup

Start the backend in one terminal:

```bash
cd Go-Backend
go run .
```

Start the frontend in another terminal:

```bash
cd Frontend
npm ci
npm run dev
```

Open `http://localhost:5173`.

## Tests and Coverage

Frontend:

```bash
cd Frontend
npm test
npm run coverage
```

The frontend HTML coverage report is generated at `Frontend/coverage/index.html`.

Backend:

```bash
cd Go-Backend
go test ./...
go test ./... -coverprofile=coverage
go tool cover -html=coverage -o coverage.html
```

The backend HTML coverage report is generated at `Go-Backend/coverage.html`.

## REST API

### Calculate an expression

`POST http://localhost:8080/api/v1/calculations`

Example for `10 + sqrt(25)`:

```bash
curl -X POST http://localhost:8080/api/v1/calculations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "binary",
    "operator": "add",
    "left": { "type": "literal", "value": 10 },
    "right": {
      "type": "unary",
      "operator": "root",
      "operand": { "type": "literal", "value": 25 }
    }
  }'
```

Response:

```json
{ "result": 15 }
```

Binary operators: `add`, `subtract`, `multiply`, `divide`, `power`.
Unary operators: `root`, `percentage`.

Mathematical errors return HTTP `422` with this shape:

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "division by zero"
  }
}
```

## Design Decisions and Assumptions

- The frontend is responsible for user interaction and converting calculator input into an expression AST.
- The backend is responsible for validating and evaluating expressions.
- Mathematical rules are kept in the domain layer and are independent of HTTP and React.
- HTTP handlers act as adapters between the API contract and the application layer.
- Expressions use literal, binary, and unary nodes so operations such as square root and percentage do not need artificial binary operands.
- Formatting is kept in the presentation layer because it affects display rather than calculation.
- The architecture is intentionally lightweight and provides clear boundaries for adding future operations without coupling the domain to the UI or transport layer.

## Docker

Start the frontend and backend together:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8080`

## Prompts Used During Implementation

The implementation was guided by these task prompts:

1. "Implement a template for the proyect using clean architecture for further enhancement"
1. "How should `percent` be implemented here? Should it be unary and calculate immediately?"
1. "Which part of the frontend turns a number into a value such as `200E25`?"
1. "Where should number display formatting live when following Clean Architecture?"
1. "Add repository documentation, setup instructions, API examples, unit tests, coverage, and optional Docker support."
