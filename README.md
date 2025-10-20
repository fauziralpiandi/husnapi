# husnapi

> The 99 Names of Allah, Delivered!

A simple, clean REST API that serves Asmaul Husna (the 99 Names of Allah) with bilingual support. Perfect for anyone wanting to integrate these (the most) beautiful names into their web/app.

## Features

- **99 Names of Allah** - Complete collection with Arabic text and Latin transliteration
- **Bilingual Support** - Available in English and Indonesian
- **Smart Search** - Filter names by meaning or tafsir
- **Random Selection** - Get random names for daily inspiration
- **Rate Limited** - Fair usage policy (99 requests per 15 minutes)
- **Fast & Cached** - Data is loaded in memory for quick responses
- **TypeScript** - Fully typed for better developer experience

## Base URL

```txt
https://api.husnapi.vercel.app
```

## API Endpoints

### 1. Get API Information

Get general information about the API, including version and available endpoints.

**Endpoint:** `GET /`

### 2. Get All Names

Retrieve the complete list of the 99 Names of Allah. Optionally filter by search query.

**Endpoint:** `GET /v1/names`

**Query Parameters:**

| Parameter | Type   | Default | Description                                           |
| --------- | ------ | ------- | ----------------------------------------------------- |
| `lang`    | string | `en`    | Language for translations (`en` or `id`)              |
| `q`       | string | -       | Search query to filter by meaning, tafsir, or insight |

**Example Requests:**

```bash
# Get all names in English
GET /v1/names

# Get all names in Indonesian
GET /v1/names?lang=id

# Search for names containing "mercy"
GET /v1/names?q=mercy

# Search in Indonesian
GET /v1/names?lang=id&q=kasih
```

### 3. Get Random Name(s)

Get one or more random names from the collection. Great for daily inspiration or learning.

**Endpoint:** `GET /v1/names/random`

**Query Parameters:**

| Parameter | Type   | Default | Description                                |
| --------- | ------ | ------- | ------------------------------------------ |
| `lang`    | string | `en`    | Language for translations (`en` or `id`)   |
| `count`   | number | `1`     | Number of random names to return (max: 99) |

**Example Requests:**

```bash
# Get one random name
GET /v1/names/random

# Get 5 random names in Indonesian
GET /v1/names/random?count=5&lang=id

# Get 10 random names
GET /v1/names/random?count=10
```

### 4. Get Name by ID

Retrieve a specific name by its ID (1-99). Optionally get a specific property only.

**Endpoint:** `GET /v1/names/:id`

**Path Parameters:**

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `id`      | number | The ID of the name (1-99) |

**Query Parameters:**

| Parameter | Type   | Default | Description                                                             |
| --------- | ------ | ------- | ----------------------------------------------------------------------- |
| `lang`    | string | `en`    | Language for translations (`en` or `id`)                                |
| `prop`    | string | -       | Specific property to return (`arabic`, `latin`, `meaning`, or `tafsir`) |

**Example Requests:**

```bash
# Get name with ID 1
GET /v1/names/1

# Get name with ID 25 in Indonesian
GET /v1/names/25?lang=id

# Get only the Arabic text for name 9
GET /v1/names/9?prop=arabic

# Get only the meaning for name 50
GET /v1/names/50?prop=meaning
```

### 5. Health Check

Check the API's health status, uptime, and memory usage.

**Endpoint:** `GET /v1/health`

**Example Request:**

```bash
GET /v1/health
```

## Language Support

The API supports two languages:

- **`en`** - English (default)
- **`id`** - Indonesian (Bahasa Indonesia)

All endpoints that return name data accept the `lang` query parameter. If not specified, English is used by default.

## Response Format

```ts
{
  success: boolean; // Whether the request was successful
  status: number; // HTTP status code
  data: T | null; // Response data (null on error)
}
```

### Name Object Structure

Each name `object` contains:

```ts
{
  id: number;          // Unique ID (1-99)
  arabic: string;      // Arabic text
  latin: string;       // DIN 31635 transliteration
  name: {
    meaning: string;   // Translation of the name
    tafsir: string;    // Short explanation/interpretation
    insight?: string;  // Optional additional insight (coming soon)
  }
}
```

## Rate Limiting

To ensure fair usage for everyone, the API implements rate limiting:

- **Limit:** 99 requests per 15 minutes
- **Rate:** Approximately 6 requests per minute
- **Scope:** Applied per IP address

> [!NOTE]
>
> When you exceed the rate limit, you'll receive a `429` status code.

## HTTP Status

| Status Code | Description                                             |
| ----------- | ------------------------------------------------------- |
| `200`       | Success - Request completed successfully                |
| `400`       | Bad Request - Invalid ID or property parameter          |
| `404`       | Not Found - Name not found or no search results         |
| `429`       | Too Many Requests - Rate limit exceeded                 |
| `500`       | Internal Server Error - Something went wrong on our end |

> [!NOTE]
>
> All errors return the same response format with `success: false` and `data: null`.

## Quick Start Examples

### JavaScript/TypeScript (fetch)

```js
// Get all names
const getAllNames = async () => {
  const res = await fetch('https://api.husnapi.vercel.app/v1/names');
  const data = await res.json();

  console.log(data);
};

// Get random name
const getRandomName = async () => {
  const res = await fetch('https://api.husnapi.vercel.app/v1/names/random');
  const data = await res.json();

  console.log(data.data[0].name);
};

// Search for names
const searchNames = async (query) => {
  const res = await fetch(
    `https://api.husnapi.vercel.app/v1/names?q=${encodeURIComponent(query)}`,
  );
  const data = await res.json();

  console.log(data);
};

// Get specific name in Indonesian
const getNameInIndonesian = async (id) => {
  const res = await fetch(
    `https://api.husnapi.vercel.app/v1/names/${id}?lang=id`,
  );
  const data = await res.json();

  console.log(data);
};
```

### Python (requests)

```python
import requests

# Get all names
res = requests.get('https://api.husnapi.vercel.app/v1/names')
data = res.json()
print(data)

# Get 5 random names in Indonesian
res = requests.get(
    'https://api.husnapi.vercel.app/v1/names/random',
    params={'count': 5, 'lang': 'id'}
)
data = res.json()
print(data)

# Search for names containing "mercy"
res = requests.get(
    'https://api.husnapi.vercel.app/v1/names',
    params={'q': 'mercy'}
)
data = res.json()
print(data)
```

### cURL

```bash
# Get all names
curl https://api.husnapi.vercel.app/v1/names

# Get random name in Indonesian
curl "https://api.husnapi.vercel.app/v1/names/random?lang=id"

# Get name by ID
curl https://api.husnapi.vercel.app/v1/names/1

# Search for names
curl "https://api.husnapi.vercel.app/v1/names?q=mercy"

# Health check
curl https://api.husnapi.vercel.app/v1/health
```

## Use Cases

Here are some ideas for using this API:

- **Mobile Apps**: Islamic apps for daily name recitation
- **Web Applications**: Educational websites about Asmaul Husna
- **Widgets**: Random name of the day widgets
- **Chatbots**: Telegram/Discord bots that share Allah's names
- **Learning Tools**: Flashcard apps for memorization
- **Prayer Apps**: Integration with prayer time applications

## Local Development

Want to run the API locally or contribute?

### Prerequisites

- Node.js >= 18.0.0
- NPM or your preferred package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/fauziralpiandi/husnapi.git
cd husnapi

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode (with hot reload)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Format code
npm run format

# Lint code
npm run lint
```

### Build & Pre-production

```bash
# Build the project
npm run build

# Start pre-production server
npm start
```

The API will be available at `http://localhost:3000` (or the `PORT` specified in your environment).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Testing:** Vitest + Supertest
- **Rate Limiting:** express-rate-limit
- **Code Quality:** ESLint + Prettier

## Contributing

Contributions are welcome! Whether it's:

- Add more languages
- Improving translations
- Adding additional content
- Docs improvements
- Bug fixes, etc.

Feel free to open an issue or submit a pull request.

## License

[MIT License](LICENSE)

## Acknowledgments

Inspired by the need for accessible Islamic resources in API format.

---

**Made with 🤍 for the Ummah**
