import { useRef, useState } from 'react'
import { Camera, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { removeProfessionalPhoto, uploadProfessionalPhoto } from '../lib/store'
import { imageUrl } from '../lib/utils'

export function PhotoUploader({
  userId,
  slot,
  url,
  onChange,
}: {
  userId: string
  slot: 1 | 2
  url: string | null
  onChange: (url: string | null) => void
}) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    setBusy(true)
    try {
      const nextUrl = await uploadProfessionalPhoto(userId, file, slot)
      onChange(nextUrl)
      toast(`Foto ${slot} atualizada com sucesso.`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível enviar a foto.', 'error')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    setBusy(true)
    try {
      await removeProfessionalPhoto(userId, slot)
      onChange(null)
      toast(`Foto ${slot} removida.`, 'success')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível remover a foto.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="field-label">{slot === 1 ? 'Foto principal' : 'Segunda foto (opcional)'}</p>
      <div className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface-2">
        {url ? (
          <>
            <img src={imageUrl(url)} alt={`Foto ${slot}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brand-deep/55 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink transition hover:bg-sun"
                aria-label="Trocar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleRemove()}
                disabled={busy}
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-coral transition hover:bg-coral hover:text-white"
                aria-label="Remover foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted transition hover:bg-surface-2 hover:text-ocean"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ocean shadow-sm">
              <ImagePlus className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold">Enviar foto</span>
            <span className="text-[10px] leading-tight text-muted">JPG ou PNG · até 8 MB</span>
          </button>
        )}

        {busy ? (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-ocean" />
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </div>
  )
}
