"use client";

import { useState } from "react";
import { Plus, Trash, ArrowUp, ArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { PageSection } from "@/lib/validations/page-sections";

const BLOCK_LABELS: Record<PageSection["type"], string> = {
  hero: "En-tête",
  richtext: "Texte",
  stats: "Chiffres clés",
};

function emptyBlock(type: PageSection["type"]): PageSection {
  switch (type) {
    case "hero":
      return { type: "hero", data: { eyebrow: "", title: "", subtitle: "" } };
    case "richtext":
      return { type: "richtext", data: { title: "", html: "" } };
    case "stats":
      return { type: "stats", data: { items: [{ value: "", label: "" }] } };
  }
}

export function PageSectionsEditor({
  initialSections,
}: {
  initialSections: PageSection[];
}) {
  const [sections, setSections] = useState<PageSection[]>(
    initialSections.length > 0 ? initialSections : [emptyBlock("hero")],
  );

  function update(index: number, next: PageSection) {
    setSections((prev) => prev.map((s, i) => (i === index ? next : s)));
  }

  function remove(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />

      {sections.map((section, index) => (
        <div key={index} className="rounded-xl border border-ink-200 bg-surface p-4">
          <div className="flex items-center justify-between gap-2 border-b border-ink-200 pb-3">
            <span className="text-sm font-semibold text-ink-900">
              {BLOCK_LABELS[section.type]}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(index, -1)} disabled={index === 0}>
                <ArrowUp size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
              >
                <ArrowDown size={14} />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
                <Trash size={14} />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {section.type === "hero" && (
              <>
                <div className="grid gap-1.5">
                  <Label>Eyebrow (facultatif)</Label>
                  <Input
                    value={section.data.eyebrow ?? ""}
                    onChange={(e) =>
                      update(index, { ...section, data: { ...section.data, eyebrow: e.target.value } })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Titre</Label>
                  <Input
                    value={section.data.title}
                    onChange={(e) =>
                      update(index, { ...section, data: { ...section.data, title: e.target.value } })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Sous-titre (facultatif)</Label>
                  <Input
                    value={section.data.subtitle ?? ""}
                    onChange={(e) =>
                      update(index, { ...section, data: { ...section.data, subtitle: e.target.value } })
                    }
                  />
                </div>
              </>
            )}

            {section.type === "richtext" && (
              <>
                <div className="grid gap-1.5">
                  <Label>Titre du bloc (facultatif)</Label>
                  <Input
                    value={section.data.title ?? ""}
                    onChange={(e) =>
                      update(index, { ...section, data: { ...section.data, title: e.target.value } })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Contenu</Label>
                  <RichTextEditor
                    value={section.data.html}
                    onChange={(html) => update(index, { ...section, data: { ...section.data, html } })}
                  />
                </div>
              </>
            )}

            {section.type === "stats" && (
              <div className="flex flex-col gap-2">
                <Label>Chiffres</Label>
                {section.data.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Valeur (ex: 12+)"
                      value={item.value}
                      onChange={(e) => {
                        const items = [...section.data.items];
                        items[itemIndex] = { ...items[itemIndex], value: e.target.value };
                        update(index, { ...section, data: { items } });
                      }}
                    />
                    <Input
                      placeholder="Libellé"
                      value={item.label}
                      onChange={(e) => {
                        const items = [...section.data.items];
                        items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                        update(index, { ...section, data: { items } });
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        const items = section.data.items.filter((_, i) => i !== itemIndex);
                        update(index, { ...section, data: { items } });
                      }}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    update(index, {
                      ...section,
                      data: { items: [...section.data.items, { value: "", label: "" }] },
                    })
                  }
                >
                  <Plus size={14} />
                  Ajouter un chiffre
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Select onValueChange={(type) => setSections((prev) => [...prev, emptyBlock(type as PageSection["type"])])}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Ajouter un bloc..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hero">En-tête</SelectItem>
            <SelectItem value="richtext">Texte</SelectItem>
            <SelectItem value="stats">Chiffres clés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
