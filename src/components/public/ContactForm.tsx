"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Envoi en cours..." : "Envoyer le message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-surface p-6">
        <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-accent-600" />
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Message envoyé</p>
          <p className="mt-1 text-sm text-ink-500">
            Merci de nous avoir contactés. Nous reviendrons vers vous dès que possible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Honeypot — hidden from real visitors, invisible label for screen readers */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Ne pas remplir</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-ink-900">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-accent-500 focus:ring-3 focus:ring-accent-500/20 focus:outline-none"
          placeholder="Votre nom"
        />
        {state.fieldErrors?.name && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <WarningCircle size={14} weight="fill" />
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-ink-900">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-accent-500 focus:ring-3 focus:ring-accent-500/20 focus:outline-none"
          placeholder="vous@exemple.com"
        />
        {state.fieldErrors?.email && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <WarningCircle size={14} weight="fill" />
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-ink-900">
          Sujet <span className="font-normal text-ink-500">(facultatif)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-accent-500 focus:ring-3 focus:ring-accent-500/20 focus:outline-none"
          placeholder="Objet de votre message"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-accent-500 focus:ring-3 focus:ring-accent-500/20 focus:outline-none"
          placeholder="Comment pouvons-nous vous aider ?"
        />
        {state.fieldErrors?.message && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <WarningCircle size={14} weight="fill" />
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && !Object.keys(state.fieldErrors ?? {}).length && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <WarningCircle size={14} weight="fill" />
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
