type Props = {
  serial: string
  size?: number
}

export function QRCodeLink({ serial, size = 128 }: Props) {
  const url = `${window.location.origin}?serial=${encodeURIComponent(serial)}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
  return (
    <img
      src={qrSrc}
      alt={`QR ${serial}`}
      width={size}
      height={size}
      className="block"
      loading="lazy"
    />
  )
}
