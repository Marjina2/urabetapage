import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'healthy',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }),
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  }
} 