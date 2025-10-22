# husnapi

> A simple REST API that serve the 99 Names of Allah (Asmaul Husna) with bilingual support

Access the most beautiful names through a clean, easy-to-use API. Perfect for Islamic apps, educational websites, daily inspiration widgets, and more.

## Quick Start

Try it now! Open this URL in your browser:

```
https://husnapi.vercel.app/v1/names/random
```

You'll get a random name from the 99 Names of Allah with its meaning and explanations.

## Base URL

```
https://husnapi.vercel.app
```

## What You Get

Each name includes:

- **Arabic text** - The name in Arabic script
- **Latin transliteration** - Easy-to-read romanized version (DIN 31635 standard)
- **Meaning** - What the name means
- **Tafsir** - A short explanation of the name
- **Insight** - Additional context (to-do)

## Available Languages

- **English** (`en`) - Default
- **Indonesian** (`id`) - Bahasa Indonesia

## API Endpoints

### Get All Names

Retrieve all 99 names at once:

```http
GET /v1/names
```

**Optional parameters:**

- `lang` - Language: `en` or `id` (default: `en`)
- `q` - Search within meanings and explanations

**Examples:**

```bash
# Get all names in English
curl https://husnapi.vercel.app/v1/names

# Get all names in Indonesian
curl https://husnapi.vercel.app/v1/names?lang=id

# Search for names about mercy
curl https://husnapi.vercel.app/v1/names?q=mercy
```

### Get a Random Name

Get one or more random names for daily inspiration:

```http
GET /v1/names/random
```

**Optional parameters:**

- `lang` - Language: `en` or `id` (default: `en`)
- `count` - How many names (1-99, default: `1`)

**Examples:**

```bash
# Get one random name
curl https://husnapi.vercel.app/v1/names/random

# Get 5 random names in Indonesian
curl https://husnapi.vercel.app/v1/names/random?count=5&lang=id
```

### Get a Specific Name

Retrieve a name by its number (1-99):

```http
GET /v1/names/:id
```

**Optional parameters:**

- `lang` - Language: `en` or `id` (default: `en`)
- `prop` - Get only one property: `meaning` or `tafsir`

**Examples:**

```bash
# Get the first name
curl https://husnapi.vercel.app/v1/names/1

# Get name #25 in Indonesian
curl https://husnapi.vercel.app/v1/names/25?lang=id

# Get only the meaning for name #9
curl https://husnapi.vercel.app/v1/names/9?prop=meaning
```

### Health Check

Check if the API is running properly:

```http
GET /v1/health
```

**Example:**

```bash
curl https://husnapi.vercel.app/v1/health
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "status": 200,
  "data": {
    /* your data here */
  }
}
```

## Limitations

To ensure fair usage for all users, the API has rate limits:

- **Limit:** 99 requests per 15 minutes
- **Rate:** Approximately 6 requests per minute
- **Scope:** Applied per IP address

> [!NOTE]
>
> When you exceed the rate limit, you'll receive a `429` status code.

## Status Codes

| Status Code | Description                                             |
| ----------- | ------------------------------------------------------- |
| `200`       | Success - Request completed successfully                |
| `400`       | Bad Request - Invalid ID or property parameter          |
| `404`       | Not Found - Name not found or no search results         |
| `429`       | Too Many Requests - Rate limit exceeded                 |
| `500`       | Internal Server Error - Something went wrong on our end |

> [!NOTE]
>
> All error responses include: `"success": false` and `"data": null`

## Code Examples

### JavaScript (Browser)

```js
// Get a random name
fetch('https://husnapi.vercel.app/v1/names/random')
  .then((res) => res.json())
  .then((data) => {
    const name = data.data[0];

    console.log(`${name.latin}: ${name.name.meaning}`);
  });

// Search for names
async function searchNames(query) {
  const res = await fetch(`https://husnapi.vercel.app/v1/names?q=${query}`);
  const data = await res.json();

  return data.data;
}
```

### Python

```python
import requests

# Get all names
res = requests.get('https://husnapi.vercel.app/v1/names')
names = res.json()['data']

# Get 5 random names in Indonesian
res = requests.get(
    'https://husnapi.vercel.app/v1/names/random',
    params={'count': 5, 'lang': 'id'}
)
random_names = res.json()['data']
```

### Node

```js
// Get a specific name
const res = await fetch('https://husnapi.vercel.app/v1/names/1');
const result = await res.json();

console.log(result.data);
```

## Use Cases

Here's what you can build with this API:

- **Mobile Apps** - Islamic apps with daily name notifications
- **Websites** - Educational sites about the Names of Allah
- **Widgets** - "Name of the Day" for your blog or app
- **Bots** - Telegram/Discord bots sharing Allah's names
- **Learning Tools** - Flashcard apps for memorization
- **Prayer Apps** - Integrate with prayer time apps

## Contributing

Want to help improve this API? Check [this](CONTRIBUTING.md) out! All contributions are welcome!

## License

[MIT License](LICENSE)

## Acknowledgments

Inspired by the need for accessible Islamic resources in API format.

## Support

If you find this useful, please star the repository and share it with others!

---

**Made with gratitude for the Ummah**
