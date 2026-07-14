import { Reveal } from "@/components/reveal"

type SectionHeadingProps = {
  number?: string
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ number, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="relative mb-12 md:mb-16">
      {number ? (
        <span aria-hidden className="ghost-number absolute -top-8 -left-2 -z-10 md:-top-12">
          {number}
        </span>
      ) : null}
      <p className="mb-3 font-mono text-sm tracking-widest text-primary uppercase">
        {number ? <span className="mr-2 opacity-60">{number} —</span> : null}
        {eyebrow}
      </p>
      <h2 className="font-display text-fluid-h2 font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
      ) : null}
    </Reveal>
  )
}
