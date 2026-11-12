"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  budgetOptions,
  contactLimits,
  contactSchema,
  projectTypes,
  type ContactValues,
} from "@/lib/contact";
import styles from "./studio.module.css";

const defaults: ContactValues = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaults,
  });
  const [feedback, setFeedback] = useState<{ status: "success" | "error"; message: string }>();
  const pending = useRef<{ body: string; id: string } | null>(null);

  async function submit(values: ContactValues) {
    setFeedback(undefined);
    const body = JSON.stringify(values);
    if (pending.current?.body !== body && typeof globalThis.crypto?.randomUUID === "function") {
      pending.current = { body, id: crypto.randomUUID() };
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(pending.current && { "Idempotency-Key": pending.current.id }),
        },
        body,
      });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
        const message = result && typeof result === "object" &&
          "message" in result && typeof result.message === "string"
          ? result.message
          : "Your message could not be sent. Please try again.";
        setFeedback({ status: "error", message });
        return;
      }

      reset(defaults);
      pending.current = null;
      setFeedback({ status: "success", message: "Your inquiry is in. Thank you for getting in touch." });
    } catch {
      setFeedback({ status: "error", message: "Something interrupted the send. Please try again." });
    }
  }

  return (
    <form
      className={styles.form}
      action="/api/contact"
      method="post"
      onSubmit={(event) => void handleSubmit(submit, () => setFeedback(undefined))(event)}
      aria-labelledby="inquiry-title"
      aria-busy={isSubmitting}
      noValidate
    >
      <div className={styles.formHeader}>
        <h2 id="inquiry-title">Project inquiry</h2>
        <span>01 / Your brief</span>
      </div>
      <noscript>
        <p className={styles.formError}>Enable JavaScript to use the form or send an email to the address on this page.</p>
      </noscript>

      <fieldset className={styles.fields} disabled={isSubmitting}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" autoComplete="name" placeholder="Your name" required
            maxLength={contactLimits.name} aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined} {...register("name")} />
          {errors.name && <p id="contact-name-error" className={styles.fieldError}>{errors.name.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" autoComplete="email" placeholder="you@example.com" required
            maxLength={contactLimits.email} aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined} {...register("email")} />
          {errors.email && <p id="contact-email-error" className={styles.fieldError}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-type">Project type</label>
          <div className={styles.select}>
            <select id="contact-type" required aria-invalid={Boolean(errors.projectType)}
              aria-describedby={errors.projectType ? "contact-type-error" : undefined} {...register("projectType")}>
              <option value="" disabled>Select a project</option>
              {projectTypes.map((project) => <option key={project}>{project}</option>)}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
          {errors.projectType && <p id="contact-type-error" className={styles.fieldError}>{errors.projectType.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-budget">Budget <span>(optional)</span></label>
          <div className={styles.select}>
            <select id="contact-budget" aria-invalid={Boolean(errors.budget)}
              aria-describedby={errors.budget ? "contact-budget-error" : undefined} {...register("budget")}>
              <option value="">Select a range</option>
              {budgetOptions.map((budget) => <option key={budget}>{budget}</option>)}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
          {errors.budget && <p id="contact-budget-error" className={styles.fieldError}>{errors.budget.message}</p>}
        </div>

        <div className={`${styles.field} ${styles.fullField}`}>
          <label htmlFor="contact-message">Tell me about the project</label>
          <textarea id="contact-message" rows={5} required maxLength={contactLimits.message}
            placeholder="A few words on the idea, timeline, and what you hope to make."
            aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined}
            {...register("message")} />
          {errors.message && <p id="contact-message-error" className={styles.fieldError}>{errors.message.message}</p>}
        </div>

        <div className={styles.trap} aria-hidden="true">
          <label htmlFor="contact-website">Leave this field blank</label>
          <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
      </fieldset>

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? "Sending" : "Send inquiry"}
          {isSubmitting
            ? <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" />
            : <ArrowUpRight size={17} aria-hidden="true" />}
        </button>
        <span className={styles.replyNote}>Replies usually within 2 business days</span>
      </div>

      {feedback?.status === "success" && (
        <p className={styles.success} role="status"><Check size={17} aria-hidden="true" />{feedback.message}</p>
      )}
      {feedback?.status === "error" && <p className={styles.formError} role="alert">{feedback.message}</p>}
    </form>
  );
}
