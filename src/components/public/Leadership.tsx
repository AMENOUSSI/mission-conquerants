import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

const LEADERS = [
  {
    name: "Anani Assigbe",
    role: "Fondateur et coordinateur international, avec son épouse",
  },
  {
    name: "Kakpogni Sénou Koffi",
    role: "Coordinateur national",
  },
  {
    name: "Assogba Makafui",
    role: "Coordinatrice, région des Plateaux",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Leadership() {
  return (
    <section className="border-t border-ink-200 py-16 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Nos responsables
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {LEADERS.map((leader, i) => (
            <Reveal key={leader.name} delay={i * 0.06}>
              <li className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-100 font-display text-lg font-semibold text-accent-700">
                  {initials(leader.name)}
                </span>
                <div>
                  <p className="font-display text-base leading-snug font-semibold text-ink-900">
                    {leader.name}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-500">{leader.role}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
