import { HOW_IT_WORKS } from '../data/site'

export function HowItWorks() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {HOW_IT_WORKS.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="relative rounded-2xl border border-line bg-surface p-5"
          >
            <span className="absolute right-4 top-4 text-4xl font-extrabold leading-none text-ink/5">
              0{index + 1}
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-ocean">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="display mt-4 text-lg font-extrabold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
          </div>
        )
      })}
    </div>
  )
}
