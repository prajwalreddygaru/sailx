import type { Policy } from "@/lib/policies";

export function PolicyContent({ policy }: { policy: Policy }) {
  return (
    <section className="pt-28 md:pt-36 pb-12">
      <div className="container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-6">{policy.title}</h1>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          {policy.intro && (
            <p className="text-muted-foreground">{policy.intro}</p>
          )}

          {policy.sections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-muted-foreground mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {section.bullets.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <div className="mt-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <h3 className="font-bold text-red-500 mb-2">Important Note</h3>
                  <p className="text-sm text-foreground/80">{section.note}</p>
                </div>
              )}
            </div>
          ))}

          {policy.closing && (
            <p className="text-muted-foreground">{policy.closing}</p>
          )}
        </div>
      </div>
    </section>
  );
}
