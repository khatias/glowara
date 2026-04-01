import React from 'react'
import SignupForm from '@/components/auth/signupForm'
import { Suspense } from 'react'
function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  )
}

export default Page