import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Welcome to URA API' }),
    headers: {
      'Content-Type': 'application/json',
    },
  }
} 