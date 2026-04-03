import { LoginForm } from '@/components/auth/loginForm'
import { Suspense } from 'react'
function Page() {
  return (
    <div>
      <Suspense fallback={<div>იტვირთება...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default Page