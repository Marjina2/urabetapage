import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { GetStaticProps, GetStaticPaths } from 'next'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

interface Props {
  email: string
}

const JoinWithReferral: FC<Props> = ({ email: initialEmail }) => {
  const router = useRouter()
  
  useEffect(() => {
    const handleReferral = async () => {
      if (!initialEmail || initialEmail === 'default' || initialEmail === 'signup') {
        router.replace('/betaregistrations')
        return
      }

      const toastId = toast.loading('Verifying referral...')
      const cleanEmail = initialEmail.toString().trim().toLowerCase()

      try {
        // Verify the referrer exists
        const { data: referrer, error } = await supabase
          .from('beta_registrations')
          .select('email')
          .eq('email', cleanEmail)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error verifying referrer:', error)
          toast.error('Invalid referral link', { id: toastId })
          router.replace('/betaregistrations')
          return
        }

        if (referrer) {
          // Store referrer in localStorage and redirect with ref parameter
          localStorage.setItem('referrer', cleanEmail)
          toast.success('Referral verified!', { id: toastId })
          
          // Use the referrer's email as the ref parameter
          const redirectUrl = `/betaregistrations?ref=${encodeURIComponent(cleanEmail)}`
          router.replace(redirectUrl)
        } else {
          toast.error('Invalid referral link', { id: toastId })
          router.replace('/betaregistrations')
        }
      } catch (error) {
        console.error('Referral error:', error)
        toast.error('Something went wrong', { id: toastId })
        router.replace('/betaregistrations')
      }
    }

    if (router.isReady && initialEmail) {
      handleReferral()
    }
  }, [initialEmail, router])

  // Handle fallback state
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Verifying Referral | URA</title>
        <meta name="description" content="Verifying referral link" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-purple-400 animate-pulse text-lg">
            Verifying referral...
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Don't prerender any paths
    fallback: 'blocking' // Enable blocking fallback
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const email = params?.email as string
  return {
    props: {
      email
    }
  }
}

export default JoinWithReferral 