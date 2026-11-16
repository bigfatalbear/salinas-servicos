import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SITE_URL } from '../config'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { OfflineBanner } from './OfflineBanner'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function CanonicalUrl() {
  const { pathname } = useLocation()

  useEffect(() => {
    const href = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (link) link.href = href

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (ogUrl) ogUrl.content = href
  }, [pathname])

  return null
}

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-sand">
      <ScrollToTop />
      <CanonicalUrl />
      <Header />
      <OfflineBanner />
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
