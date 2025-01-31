import type { AppProps } from 'next/app'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import '@/styles/globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:," />
      </Head>
      <AuthProvider>
        <UserProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </UserProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp 