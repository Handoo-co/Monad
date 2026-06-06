# Verificación Empresarial - KYB

## Objetivo

Antes de autorizar una empresa o marca emisora en Handoo OriginPass, el equipo
debe comprobar que la entidad existe legalmente y que el certificado presentado
no fue alterado. En Colombia esto se hace con el código de verificación del
certificado de Cámara de Comercio; en otros países se usa el registro mercantil,
registro de compañías, Secretary of State, LEI u órgano equivalente.

## Decisión de arquitectura

La verificación legal vive **off-chain**. En Monad solo guardamos el compromiso
criptográfico de la evidencia mediante `hashMetadatos` en `registrarMarca`.

Motivo:

- Los portales oficiales cambian por país, ciudad y autoridad.
- Muchos flujos tienen captcha, pago, login, PDF firmado o revisión manual.
- El certificado puede contener datos personales o sensibles.
- Cambiar el contrato ahora rompería ABI/frontend sin necesidad.

El contrato actual ya soporta el flujo:

```text
registrarMarca(cuentaMarca, nombre, hashMetadatosKYB, true)
```

`hashMetadatosKYB` debe ser un `bytes32` calculado a partir de un registro KYB
normalizado. No guardar en cadena el código de verificación, NIT, PDF, nombres
de representantes legales, direcciones, correos ni teléfonos.

## Flujo MVP Colombia

1. La empresa entrega certificado reciente y código de verificación.
2. El operador identifica la Cámara de Comercio emisora.
3. El operador entra al portal oficial de esa cámara o al sistema que ella
   indique.
4. Digita el código de verificación exactamente como aparece en el certificado.
5. Compara que razón social, estado, matrícula/registro, renovaciones y fecha
   coincidan con el documento recibido.
6. Si todo coincide, genera un registro KYB normalizado y calcula
   `hashMetadatosKYB`.
7. El admin del contrato llama `registrarMarca(walletMarca, nombreComercial,
   hashMetadatosKYB, true)`.

Para la demo se puede usar una marca demo con metadata ficticia. No usar
certificados reales ni datos de terceros en vivo.

## Modelo de datos off-chain

Representar la evidencia como JSON canónico antes de hashearla:

```json
{
  "schema": "handoo.kyb.v1",
  "country": "CO",
  "subdivision": "ANT",
  "authorityName": "Camara de Comercio de Medellin para Antioquia",
  "registryName": "Registro Mercantil",
  "registryType": "chamber-of-commerce-certificate",
  "verificationMethod": "certificate-code-official-portal",
  "verificationCodeHash": "0x...",
  "certificateHash": "0x...",
  "legalNameHash": "0x...",
  "registryIdHash": "0x...",
  "status": "active",
  "verifiedAt": "2026-06-06T00:00:00-05:00",
  "validUntil": null,
  "operatorWallet": "0x...",
  "sourceUrlHash": "0x..."
}
```

Campos obligatorios para MVP:

| Campo | Uso |
| --- | --- |
| `country` | ISO 3166-1 alpha-2 (`CO`, `US`, `GB`, etc.). |
| `subdivision` | Región/estado/departamento cuando el registro no es nacional. |
| `authorityName` | Entidad oficial consultada. |
| `registryType` | Tipo de registro o certificado. |
| `verificationMethod` | Código, número de registro, API, LEI o revisión manual oficial. |
| `verificationCodeHash` | Hash del código, si existe. Nunca el código plano. |
| `certificateHash` | Hash del PDF/archivo recibido. |
| `legalNameHash` | Hash de la razón social normalizada. |
| `registryIdHash` | Hash del NIT, matrícula, company number o equivalente. |
| `status` | `active`, `inactive`, `dissolved`, `unknown` o equivalente local. |
| `verifiedAt` | Fecha/hora de verificación. |
| `operatorWallet` | Wallet del operador/admin que certificó la revisión. |

## Adaptadores internacionales

No existe un estándar global único. Handoo debe resolverlo con adaptadores por
jurisdicción y una interfaz común.

| Jurisdicción | Fuente primaria | Método recomendado |
| --- | --- | --- |
| Colombia | Cámaras de Comercio / RUES | Código de verificación del certificado + consulta oficial. |
| Reino Unido | Companies House | Company number + API oficial para perfil y estado. |
| Unión Europea | BRIS / registros nacionales | Búsqueda por nombre o número en el país participante. |
| Estados Unidos | Secretary of State por estado | Entity number/name + estado de la entidad en el portal estatal. |
| Global complementario | GLEIF | LEI para entidades que ya tienen identificador legal global. |

Regla: si el país tiene API oficial confiable, usar API. Si no, usar revisión
manual guiada y guardar solo hashes de evidencia. Agregadores privados pueden
ayudar a UX, pero no reemplazan la fuente oficial en el MVP.

## Interfaz futura de backend

No se implementa todavía, pero este es el contrato esperado para reducir
fricción después del hackathon:

| Endpoint | Responsabilidad |
| --- | --- |
| `POST /api/kyb/start` | Recibe país, autoridad, tipo de certificado y wallet de marca. |
| `POST /api/kyb/verify` | Ejecuta adapter o deja checklist manual para el operador. |
| `POST /api/kyb/attest` | Devuelve `hashMetadatosKYB` y payload canónico para auditoría. |
| `GET /api/kyb/:brandWallet` | Estado de verificación de una marca. |

El backend debe cifrar evidencia si se almacena, aplicar control de acceso y
mantener logs mínimos. El frontend nunca debe enviar evidencia sensible al
contrato.

## Checklist para autorizar marca

- [ ] Certificado o registro proviene de fuente oficial.
- [ ] Código de verificación o número de registro fue validado.
- [ ] Estado legal permite operar (`active` o equivalente).
- [ ] Razón social y documento coinciden.
- [ ] No hay datos personales en el payload on-chain.
- [ ] `hashMetadatosKYB` fue calculado desde JSON canónico.
- [ ] `registrarMarca` se ejecuta solo después de completar la revisión.

## Fuentes oficiales de referencia

- Cámara de Comercio de Bogotá: verificación de certificados con código del
  certificado.
  https://www.ccb.org.co/es/tramites-y-consultas/certificados/verificacion-de-certificados
- Cámara de Comercio de Medellín para Antioquia: e-CER y verificación por
  código.
  https://tramites.camaramedellin.com.co/tramites-virtuales/certificados
- RUES Colombia: registro empresarial y social administrado por Cámaras de
  Comercio.
  https://app-antiguoprd.rues.org.co/Home/About
- Companies House Reino Unido: API oficial de datos de compañías.
  https://developer.company-information.service.gov.uk
- BRIS Unión Europea: búsqueda de compañías en registros nacionales.
  https://webgate.ec.europa.eu/e-justice/searchBris.do
- GLEIF: API y búsqueda de LEI.
  https://www.gleif.org/en/lei-data/gleif-api
