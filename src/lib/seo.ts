import { useEffect } from 'react'
import { APP_NAME, SITE_URL } from '../config'

type JsonLdObject = Record<string, unknown>

interface SeoOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  jsonLd?: JsonLdObject | JsonLdObject[]
}

export function seoUrl(path?: string) {
  if (!path) return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const absoluteUrl = seoUrl

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = href
}

function clearJsonLd() {
  document.head
    .querySelectorAll('script[data-seo-jsonld="true"]')
    .forEach((element) => element.remove())
}

function injectJsonLd(items: JsonLdObject | JsonLdObject[]) {
  clearJsonLd()
  const list = Array.isArray(items) ? items : [items]
  for (const item of list) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seoJsonld = 'true'
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  }
}

export function useSeo({
  title,
  description,
  path,
  image,
  type = 'website',
  jsonLd,
}: SeoOptions) {
  const fullTitle = title.includes(APP_NAME) ? title : `${title} — ${APP_NAME}`
  const url = absoluteUrl(path)
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl('/pwa-512.png')
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
    setCanonical(url)

    if (jsonLdKey) {
      const parsed = JSON.parse(jsonLdKey) as JsonLdObject | JsonLdObject[]
      const items = Array.isArray(parsed) ? parsed : [parsed]
      injectJsonLd(items.map((item) => ({ '@context': 'https://schema.org', ...item })))
    }

    return () => {
      clearJsonLd()
    }
  }, [fullTitle, description, url, imageUrl, type, jsonLdKey])
}

export function breadcrumb(items: Array<{ name: string; path: string }>): JsonLdObject {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
