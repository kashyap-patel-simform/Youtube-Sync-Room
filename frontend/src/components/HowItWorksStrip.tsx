import { HOW_IT_WORKS } from '../constants'

export function HowItWorksStrip() {
  return (
    <section id="how" className="relative z-10 border-t border-border/50 px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {HOW_IT_WORKS.map((item) => (
          <div key={item.step} className="flex gap-4">
            <span className="font-mono text-xs font-semibold text-amber/60 mt-0.5 shrink-0 w-6">
              {item.step}
            </span>
            <div>
              <p className="font-display font-semibold text-fg text-sm mb-1">{item.title}</p>
              <p className="text-fg-subtle text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
