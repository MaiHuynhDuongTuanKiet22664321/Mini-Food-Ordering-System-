# Payment Service

Node.js Express service for processing payments and integrating with Order Service.

## Features

- **Port**: 3004
- **Payment Methods**: COD, BANKING
- **Integration**: Calls Order Service to update order status to PAID
- **Logging**: Logs payment success messages
- **Error Handling**: Comprehensive error handling for validation and service failures

## API Endpoints

### POST /payments

Process a payment for an order.

**Request Body:**
```json
{
  "orderId": "string",
  "method": "COD" | "BANKING"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "orderId": "string",
    "method": "COD" | "BANKING",
    "orderStatus": "PAID"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Details"
}
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm start
```

The service will run on `http://localhost:3004`

## Dependencies

- express: ^4.18.2
- axios: ^1.6.0
- body-parser: ^1.20.2

## Example Usage

```bash
curl -X POST http://localhost:3004/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order123",
    "method": "BANKING"
  }'
```

## Integration Notes

- Requires Order Service running on `http://localhost:3003`
- Order Service must support PATCH endpoint: `PATCH /orders/:id` with body `{"status": "PAID"}`
- Optional notification endpoint is commented out in server.js (lines 40-44)
