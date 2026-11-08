'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  X,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'

export default function LoginPage() {
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  // Dialogue (Modal) state for "Request Access / Join Now"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reqEmail, setReqEmail] = useState('')
  const [reqPhone, setReqPhone] = useState('')
  const [reqWhatsApp, setReqWhatsApp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [isSubmittingReq, setIsSubmittingReq] = useState(false)
  const [reqSubmitted, setReqSubmitted] = useState(false)
  const [reqError, setReqError] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !password) return
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setSignedIn(true)
      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }
      }, 700)
    }, 500)
  }

  const handleQuickDemo = (demoRole: 'member' | 'admin', demoUser: string) => {
    setRole(demoRole)
    setUserId(demoUser)
    setPassword('••••••••••••')
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setReqSubmitted(false)
    setReqError('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setReqSubmitted(false)
    setReqEmail('')
    setReqPhone('')
    setReqWhatsApp('')
    setReqError('')
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqEmail || !reqPhone) {
      setReqError('Email and Contact Number are required.')
      return
    }

    setIsSubmittingReq(true)
    setReqError('')

    const whatsappValue = sameAsPhone ? reqPhone : (reqWhatsApp || reqPhone)

    try {
      const res = await fetch('/api/auth/login-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reqEmail,
          phone: reqPhone,
          whatsapp: whatsappValue,
          issueType: 'access_request',
          details: `Requested access on login screen. WhatsApp: ${whatsappValue}`,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.')
      }

      setReqSubmitted(true)
    } catch (err: any) {
      setReqError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmittingReq(false)
    }
  }

  return (
    <div className="min-h-screen bg-radial from-[#153472] via-[#0E244E] to-[#08152D] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#215CE5] selection:text-white">
      {/* Ambient background light rays reflecting the silver-white prism logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-gradient-to-b from-[#215CE5]/25 via-[#215CE5]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Return to Home */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Discreet Quick Demo Switchers */}
        <div className="flex items-center space-x-1.5 text-[11px]">
          <span className="text-slate-400 hidden sm:inline mr-1">Demo:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('member', 'nishant@anotherworldindia.com')}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 text-[10px] font-semibold transition-colors"
          >
            Nishant
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin', 'admin@mni.network')}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 text-[10px] font-semibold transition-colors"
          >
            Admin
          </button>
        </div>
      </header>

      {/* Main Creative Centerpiece */}
      <main className="relative z-10 w-full max-w-[420px] mx-auto px-4 py-4 flex flex-col items-center">
        {/* Creative Logo Presentation: The User's Prism "M" Logo */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-b from-white/30 via-blue-400/20 to-transparent blur-lg opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-[#0B224E] flex items-center justify-center">
            <img
              src="/mni-logo.png"
              alt="MNI Logo"
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white/[0.07] backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5">
          {/* Member / Admin Selector */}
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setRole('member')
                setUserId('')
                setPassword('')
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'member'
                  ? 'bg-white text-[#102C60] shadow-md shadow-black/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin')
                setUserId('')
                setPassword('')
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'admin'
                  ? 'bg-[#215CE5] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>

          {signedIn ? (
            <div className="py-8 text-center space-y-2 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">
                {role === 'admin' ? 'Admin Access Granted' : 'Member Authenticated'}
              </p>
              <p className="text-xs text-slate-300">
                {role === 'admin' ? 'Redirecting to Admin Studio...' : 'Opening network timeline...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* 1. USER ID FIELD */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  User ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={role === 'member' ? 'Member ID or Email' : 'Admin User ID'}
                    className="w-full text-xs p-3.5 pl-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* 2. PASSWORD FIELD */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-xs p-3.5 pl-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* 3. CTA TO SIGN IN */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#215CE5] hover:bg-[#1a4bc4] disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 4. TEXTS ASKING "Don't have login credentials?" */}
          {/* 5. CTA FOR "Request Access / Join Now" */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-xs text-slate-300">
              Don't have login credentials?
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Request Access / Join Now</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-400">
        MNI • Curated Private Business Network
      </footer>

      {/* DIALOGUE / MODAL FOR "REQUEST ACCESS / JOIN NOW" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-[#0F2652] border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {reqSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Access Request Received</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  Thank you! MNI Administration will verify your contact details and provide your User ID & Password via WhatsApp / Email.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-3 rounded-2xl bg-[#215CE5] hover:bg-[#1a4bc4] text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Request Access / Join Now
                  </h3>
                  <p className="text-xs text-slate-300">
                    Submit your details. MNI Admin will provision your login credentials.
                  </p>
                </div>

                {reqError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-200">
                    {reqError}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Email Address <span className="text-blue-300">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full text-xs p-3.5 pl-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Contact No Field */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Contact No <span className="text-blue-300">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-3.5 pl-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* WhatsApp Contact Field */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 block">
                      WhatsApp Contact
                    </label>
                    <label className="flex items-center space-x-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => setSameAsPhone(e.target.checked)}
                        className="rounded border-white/20 text-[#215CE5] focus:ring-0"
                      />
                      <span>Same as Contact No</span>
                    </label>
                  </div>

                  {!sameAsPhone && (
                    <div className="relative animate-in fade-in duration-150">
                      <input
                        type="tel"
                        value={reqWhatsApp}
                        onChange={(e) => setReqWhatsApp(e.target.value)}
                        placeholder="WhatsApp number with country code"
                        className="w-full text-xs p-3.5 pl-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 transition-all"
                      />
                      <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className="w-full py-3.5 rounded-2xl bg-[#215CE5] hover:bg-[#1a4bc4] disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer mt-2"
                >
                  <span>{isSubmittingReq ? 'Submitting...' : 'Submit Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
