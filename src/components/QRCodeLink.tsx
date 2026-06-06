import React from 'react'

type Props = {
  serial: string
  size?: number
}

// QRCodeLink component using an external QR code generation API to avoid library import issues.
export const QRCodeLink: React.FC<Props> = ({ serial, size = 128 }) => {
  const url = `${window.location.origin}?serial=${serial}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
  return (
    <img
      src={qrSrc}
      alt="QR code"
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  )
}
