# Verificacion Empresarial y Artesanal - Handoo OriginPass V2

## Principio

Handoo separa dos afirmaciones:

1. **Empresa verificada:** la entidad o tienda existe y fue revisada contra una
   fuente oficial cuando aplica.
2. **Producto atestado:** el origen/autenticidad del producto lo declara la
   empresa emisora o Handoo, y queda anclado en Monad.

La Camara de Comercio no debe presentarse como certificadora de cada producto.

## Empresa comercial

Usar este modo cuando la empresa tiene registro formal.

Flujo:

1. Empresa entrega certificado o referencia de registro.
2. Operador revisa fuente oficial: Camara de Comercio en Colombia o registro
   equivalente internacional.
3. Se hashea el codigo/evidencia sensible off-chain.
4. Empresa llama `solicitarRegistroEmpresa` con:
   - `TipoEmpresa.Comercial`
   - `ModoVerificacion.CamaraComercio` o `RegistroOficial`
   - `hashVerificacion != 0`
5. Admin aprueba con `aprobarEmpresa`.

No guardar codigo de verificacion, NIT, certificado, representantes legales,
telefonos, correos ni direcciones privadas on-chain.

## Empresa artesanal

Usar este modo para talleres o productores que hacen sus propios productos y no
tienen Camara de Comercio.

Flujo:

1. Artesano solicita registro como `TipoEmpresa.Artesanal`.
2. El contrato exige `ModoVerificacion.RevisionArtesanalAdmin`.
3. `hashVerificacion` puede ser `0x00...`.
4. Admin revisa evidencia no sensible: taller, proceso, ubicacion publica,
   fotos autorizadas, redes o validacion presencial.
5. Admin aprueba con `aprobarEmpresa`.

La UI debe mostrar: **Producto artesanal aprobado por Handoo**. No usar el texto
"verificado por Camara de Comercio" en este modo.

## Metadata publica

El contrato guarda `metadataURI` y `metadataHash`. El JSON visible puede incluir:

```json
{
  "name": "Taller Artesanal La Montana",
  "displayName": "La Montana Artesanal",
  "location": "Santa Elena, Antioquia, Colombia",
  "description": "Taller artesanal aprobado por revision administrativa de Handoo.",
  "verificationClaim": "Empresa artesanal aprobada por Handoo."
}
```

Regla: si no quieres que un dato sea publico, no debe estar en la metadata URI.

## Adaptadores internacionales futuros

| Jurisdiccion | Fuente primaria | Modo |
| --- | --- | --- |
| Colombia | Camaras de Comercio / RUES | `CamaraComercio` |
| Reino Unido | Companies House | `RegistroOficial` |
| Union Europea | BRIS / registros nacionales | `RegistroOficial` |
| Estados Unidos | Secretary of State estatal | `RegistroOficial` |
| Global | GLEIF LEI | Complementario |

Agregadores privados pueden ayudar, pero el MVP debe basarse en fuente oficial o
revision admin documentada.

## Checklist admin

- [ ] La empresa comercial fue revisada contra fuente oficial.
- [ ] El codigo/evidencia sensible no se guardo on-chain.
- [ ] La empresa artesanal tiene evidencia suficiente de produccion propia.
- [ ] La metadata publica no contiene datos personales innecesarios.
- [ ] El tipo de empresa coincide con el tipo de producto que emitira.
- [ ] La UI distingue comercial verificada vs artesanal aprobada.

## Fuentes de referencia

- Camara de Comercio de Bogota:
  https://www.ccb.org.co/es/tramites-y-consultas/certificados/verificacion-de-certificados
- Camara de Comercio de Medellin:
  https://tramites.camaramedellin.com.co/tramites-virtuales/certificados
- RUES Colombia:
  https://app-antiguoprd.rues.org.co/Home/About
- Companies House:
  https://developer.company-information.service.gov.uk
- BRIS:
  https://webgate.ec.europa.eu/e-justice/searchBris.do
- GLEIF:
  https://www.gleif.org/en/lei-data/gleif-api
