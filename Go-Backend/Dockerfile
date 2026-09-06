FROM golang:1.25 AS build
WORKDIR /src
COPY go.mod ./
COPY . .
RUN CGO_ENABLED=0 go build -o /calculator .

FROM gcr.io/distroless/static-debian12
COPY --from=build /calculator /calculator
EXPOSE 8080
ENTRYPOINT ["/calculator"]
