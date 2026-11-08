'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/layout/AppHeader'
import { ArrowRight, HelpCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Request Login Details page
    router.replace('/login-help')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-16 text-[#12233E]">
      <AppHeader />

      <main className="max-w-md mx-auto px-4 sm:px-6 pt-12 text-center space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-3">
          <HelpCircle className="w-10 h-10 text-[#215CE5] mx-auto" />
          <h1 className="text-lg font-bold text-[#102C60]">Admin-Provisioned Access Only</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            There is no direct public signup. MNI is a closed network where login credentials are provided directly by MNI Administration.
          </p>
          <div className="pt-2">
            <Link
              href="/login-help"
              className="w-full py-3 rounded-xl bg-[#215CE5] text-white text-xs font-bold shadow-md block transition-all"
            >
              Request Login Details from Admin
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
