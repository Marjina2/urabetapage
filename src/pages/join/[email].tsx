import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const JoinWithReferral = () => {
  const router = useRouter()
  const { email } = router.query

  useEffect(() => {
    const handleReferral = async () => {
      if (email) {
        // Verify the referrer exists
        const { data: referrer } = await supabase
          .from('beta_registrations')
          .select('email')
          .eq('email', email)
          .single()

        if (referrer) {
          router.push(`/betaregistrations?ref=${encodeURIComponent(email as string)}`)
        } else {
          router.push('/betaregistrations')
        }
      }
    }

    if (email) {
      handleReferral()
    }
  }, [email, router])

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-purple-400 animate-pulse">Loading...</div>
    </div>
  )
}

export default JoinWithReferral 