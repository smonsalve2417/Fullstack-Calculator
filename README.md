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

- The primary goal was not only to build a working calculator quickly. The project was intentionally structured as a maintainable application: modular boundaries, isolated business rules, replaceable adapters, and code that can be tested without requiring the complete system to run.
- Clean Architecture was chosen because, when applied consistently, it supports those goals by keeping the domain independent from React, HTTP, and infrastructure details. This makes changes easier to reason about and prevents presentation or transport concerns from spreading into the calculation engine.
- The current frontend and backend separation reflects those boundaries. The frontend handles interaction and expression construction, the application layer coordinates use cases, the domain models and evaluates expressions, and the HTTP adapter translates requests and responses at the system boundary.
- This structure is intentionally extensible beyond a basic calculator. The expression tree can evolve toward a symbolic mathematics engine, similar in direction to tools such as Symbolab, by adding operations such as derivatives and integrals alongside existing arithmetic operations. Those capabilities can be introduced as new domain behaviors and application use cases without forcing the UI or HTTP contract to contain the mathematical implementation.
- Modularity also makes combined operations easier to support. For example, a derivative or integral could consume the same expression model used by arithmetic evaluation, while separate adapters could expose it through the existing frontend or a future API endpoint.
- The domain represents calculations as literal, binary, and unary expressions. This avoids modeling `root` or `percentage` as artificial binary operations.
- `buildExpression` belongs to the application layer because it converts UI tokens into the AST consumed by the calculation use case.
- Mathematical evaluation belongs to the Go domain layer and does not depend on HTTP or React.
- Scientific notation formatting belongs to the presentation layer. It changes only the visible output, not the value used to build an expression.
- The `root` operator is represented as a unary operator with one operand. `percentage` is also unary and evaluates an operand as a fraction of 100.
- The frontend and backend are separate processes locally and separate services in Docker Compose.

## Docker

Start the frontend and backend together:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8080`

## Prompts Used During Implementation

The implementation was guided by these task prompts:

1. "How should `percent` be implemented here? Should it be unary and calculate immediately?"
2. "Which part of the frontend turns a number into a value such as `200E25`?"
3. "Where should number display formatting live when following Clean Architecture?"
4. "Add repository documentation, setup instructions, API examples, unit tests, coverage, and optional Docker support."
