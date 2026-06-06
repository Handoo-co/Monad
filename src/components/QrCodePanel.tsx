import { useEffect, useState } from 'react'
import { toDataURL } from 'qrcode'

type QrCodePanelProps = {
  url: string
}

export function QrCodePanel({ url }: QrCodePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    let active = true

    toDataURL(url, {
      width: 248,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#111827', light: '#ffffff' },
    }).then(value => {
      if (active) setQrDataUrl(value)
    })

    return () => {
      active = false
    }
  }, [url])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid h-36 w-36 shrink-0 place-items-center rounded-md border border-gray-200 bg-gray-50">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR del producto" className="h-32 w-32" />
          ) : (
            <span className="text-xs text-gray-400">Generando QR</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">URL publica del producto</p>
          <p className="mt-1 break-all rounded-md bg-gray-50 p-3 text-xs text-gray-600">{url}</p>
          <a
            href={url}
            className="mt-3 inline-flex rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Abrir ficha
          </a>
        </div>
      </div>
    </div>
  )
}
