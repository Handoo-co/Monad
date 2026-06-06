import { DEMO_PRODUCTS } from '../data/demo'

type Props = {
  onVerify: (serial: string) => void
}

const STATUS_CONFIG = {
  active: {
    badge: 'Verificado',
    badgeClass: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    cardClass: 'border-gray-200 hover:border-emerald-300 hover:shadow-emerald-50',
    dotClass: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    label: '✓',
  },
  revoked: {
    badge: 'Revocado',
    badgeClass: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    cardClass: 'border-gray-200 hover:border-amber-300 hover:shadow-amber-50',
    dotClass: 'bg-amber-500',
    iconBg: 'bg-amber-50',
    label: '!',
  },
  notfound: {
    badge: 'No registrado',
    badgeClass: 'bg-red-100 text-red-600 ring-1 ring-red-200',
    cardClass: 'border-gray-200 hover:border-red-300 hover:shadow-red-50',
    dotClass: 'bg-red-400',
    iconBg: 'bg-red-50',
    label: '✗',
  },
} as const

export function ProductShowcase({ onVerify }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Productos certificados</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Pasaportes de autenticidad registrados en Monad Testnet.
          </p>
        </div>
        <span className="text-xs text-gray-400 pb-0.5">Chain 10143</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {DEMO_PRODUCTS.map((p) => {
          const cfg = STATUS_CONFIG[p.scenario]
          return (
            <button
              key={p.serial}
              onClick={() => onVerify(p.serial)}
              className={`group w-full rounded-2xl border bg-white p-5 text-left transition-all duration-200 hover:shadow-lg ${cfg.cardClass} focus:outline-none focus:ring-2 focus:ring-purple-300`}
            >
              {/* Icono + badge */}
              <div className="flex items-start justify-between gap-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${cfg.iconBg}`}>
                  {p.icon}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.badgeClass}`}>
                  {cfg.badge}
                </span>
              </div>

              {/* Nombre */}
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
              </div>

              {/* Descripción */}
              <p className="mt-2.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
                {p.description}
              </p>

              {/* Marca emisora */}
              {p.brand && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dotClass}`} />
                  <span className="text-xs font-semibold text-gray-700">{p.brand}</span>
                </div>
              )}

              {/* Footer serial + CTA */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="font-mono text-[11px] text-gray-400">{p.serial}</span>
                <span className="text-xs font-medium text-purple-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Ver sello →
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
