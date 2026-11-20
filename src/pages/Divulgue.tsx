import { useEffect, useState } from 'react'
import { Download, Link2, Printer, QrCode, Share2, Sparkles } from 'lucide-react'
import QRCodeLib from 'qrcode'
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  CITY_NAME,
  SHARE_INVITE,
  SITE_URL,
} from '../config'
import { useSeo } from '../lib/seo'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/PageHeader'
import { WhatsAppShareButton } from '../components/WhatsAppShareButton'

const SHARE_TEXT = SHARE_INVITE

export function Divulgue() {
  const { toast } = useToast()
  const [qrCode, setQrCode] = useState('')
  const [generating, setGenerating] = useState(false)

  useSeo({
    title: 'Divulgue o Salinas Serviços',
    description:
      'Baixe o cartaz com QR code, compartilhe no WhatsApp e ajude mais gente de Salinas da Margarida a encontrar profissionais e comércios da cidade.',
    path: '/divulgue',
  })

  useEffect(() => {
    QRCodeLib.toDataURL(SITE_URL, {
      width: 640,
      margin: 1,
      color: { dark: '#0b1f33', light: '#ffffff' },
    })
      .then(setQrCode)
      .catch(() => setQrCode(''))
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      toast('Link copiado. Cole no status, em grupos ou no direct.', 'success')
    } catch {
      toast('Não foi possível copiar o link.', 'error')
    }
  }

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({ title: APP_NAME, text: SHARE_TEXT, url: SITE_URL })
        return
      }
      await copyLink()
    } catch {
      // Compartilhamento cancelado.
    }
  }

  async function downloadPoster() {
    if (!qrCode) {
      toast('O QR code ainda está sendo gerado. Tente novamente.', 'error')
      return
    }
    setGenerating(true)
    try {
      if (document.fonts?.ready) await document.fonts.ready
      const width = 1080
      const height = 1350
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas indisponível')

      ctx.fillStyle = '#fff8e8'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#0b1f33'
      ctx.fillRect(0, 0, width, 280)

      ctx.fillStyle = '#f5c542'
      ctx.font = 'bold 32px sans-serif'
      ctx.fillText('SALINAS SERVIÇOS', 72, 100)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 64px sans-serif'
      ctx.fillText('A cidade se conecta aqui.', 72, 180)

      ctx.fillStyle = '#ffffff'
      ctx.font = '30px sans-serif'
      ctx.fillText(CITY_NAME + ' · Bahia', 72, 228)

      ctx.fillStyle = '#0b1f33'
      ctx.font = 'bold 56px sans-serif'
      ctx.fillText('Encontre profissionais', 72, 400)
      ctx.fillText('e comércios da cidade.', 72, 470)

      ctx.fillStyle = '#536b78'
      ctx.font = '32px sans-serif'
      ctx.fillText('Contato direto pelo WhatsApp,', 72, 540)
      ctx.fillText('sem intermediários.', 72, 585)

      const qrSize = 460
      const qrX = (width - qrSize) / 2
      const qrY = 660
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#dce8e2'
      ctx.lineWidth = 4
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 32)
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48)
        ctx.strokeRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48)
      }

      const image = new Image()
      const loaded = new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Falha ao carregar o QR code'))
      })
      image.src = qrCode
      await loaded
      ctx.drawImage(image, qrX, qrY, qrSize, qrSize)

      ctx.fillStyle = '#0b1f33'
      ctx.font = 'bold 40px sans-serif'
      const tip = 'Aponte a câmera do celular'
      const tipWidth = ctx.measureText(tip).width
      ctx.fillText(tip, (width - tipWidth) / 2, 1210)

      ctx.fillStyle = '#087ea4'
      ctx.font = 'bold 30px sans-serif'
      const urlText = 'bigfatalbear.github.io/salinas-servicos'
      const urlWidth = ctx.measureText(urlText).width
      ctx.fillText(urlText, (width - urlWidth) / 2, 1262)

      ctx.fillStyle = '#536b78'
      ctx.font = '26px sans-serif'
      const footer = `Projeto comunitário de ${CITY_NAME}`
      const footerWidth = ctx.measureText(footer).width
      ctx.fillText(footer, (width - footerWidth) / 2, 1310)

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'salinas-servicos-cartaz.png'
      link.click()
      toast('Cartaz baixado. Compartilhe no status ou imprima.', 'success')
    } catch {
      toast('Não foi possível gerar o cartaz agora.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container-wide pt-8 sm:pt-12">
      <PageHeader
        eyebrow="Divulgação"
        title="Ajude o Salinas Serviços a chegar em mais gente."
        description="Baixe o cartaz com QR code, envie nos grupos e no status do WhatsApp, imprima no comércio. Cada pessoa que compartilha fortalece a rede local."
        action={
          <WhatsAppShareButton
            text={SHARE_TEXT}
            label="Compartilhar agora"
            className="btn-primary!"
          />
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="card print-poster overflow-hidden">
          <div className="bg-brand-deep p-6 text-white sm:p-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sun">
              {APP_NAME}
            </p>
            <p className="display mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
              {APP_TAGLINE}
            </p>
            <p className="mt-1 text-sm text-white/60">{CITY_NAME} · Bahia</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
            <h2 className="display max-w-sm text-2xl font-extrabold leading-tight text-ink">
              Encontre profissionais e comércios da cidade.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted">{APP_DESCRIPTION}</p>
            {qrCode ? (
              <img
                src={qrCode}
                alt={`QR code do ${APP_NAME}`}
                className="h-52 w-52 rounded-2xl border border-line bg-white p-2"
              />
            ) : (
              <div className="grid h-52 w-52 place-items-center rounded-2xl border border-line bg-surface-2">
                <QrCode className="h-10 w-10 text-muted" aria-hidden="true" />
              </div>
            )}
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
              Aponte a câmera do celular
            </p>
            <p className="text-sm font-bold text-ocean">bigfatalbear.github.io/salinas-servicos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="display text-xl font-extrabold text-ink">Kit de divulgação</h2>
            <p className="mt-1 text-sm text-muted">
              Baixe o cartaz pronto para o status, imprima no comércio ou envie direto para quem
              precisa de um serviço.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void downloadPoster()}
                disabled={generating}
                className="btn btn-primary"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {generating ? 'Gerando...' : 'Baixar cartaz'}
              </button>
              <WhatsAppShareButton text={SHARE_TEXT} label="Enviar no WhatsApp" />
              <button type="button" onClick={() => void copyLink()} className="btn btn-soft">
                <Link2 className="h-4 w-4" aria-hidden="true" />
                Copiar link
              </button>
              <button type="button" onClick={() => window.print()} className="btn btn-soft">
                <Printer className="h-4 w-4" aria-hidden="true" />
                Imprimir cartaz
              </button>
              <button type="button" onClick={() => void shareNative()} className="btn btn-soft sm:col-span-2">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Compartilhar pelo celular
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="display text-xl font-extrabold text-ink">Quem ajuda, aparece.</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
                <span>
                  <strong className="text-ink">Status do WhatsApp:</strong> poste o cartaz e o link
                  uma vez por semana. É o canal que mais alcança a cidade.
                </span>
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
                <span>
                  <strong className="text-ink">Grupos da comunidade:</strong> compartilhe com
                  educação e só onde divulgação é permitida.
                </span>
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
                <span>
                  <strong className="text-ink">Comércio local:</strong> imprima o cartaz e cole no
                  balcão, no salão ou na oficina.
                </span>
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
                <span>
                  <strong className="text-ink">Indique um profissional:</strong> quem tem um bom
                  serviço merece ser encontrado. Envie o link direto para a pessoa criar o perfil.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-sun/40 bg-sun/10 p-5">
            <p className="text-sm font-extrabold text-ink">Instale o app no celular</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Ao abrir o site no celular, use “Adicionar à tela de início”. O Salinas Serviços fica
              com ícone próprio e abre como aplicativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
