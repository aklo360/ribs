"use client";

import { useState } from "react";
import { Loader2, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Mailchimp newsletter signup. Set NEXT_PUBLIC_MAILCHIMP_URL to your Mailchimp
 * embedded-form action URL (…list-manage.com/subscribe/post?u=…&id=…).
 * Posts no-cors (Mailchimp blocks CORS), so success is optimistic.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
      if (url) {
        const body = new URLSearchParams();
        body.set("EMAIL", email);
        await fetch(url, { method: "POST", mode: "no-cors", body });
      }
      setDone(true);
      toast.success("You're on the list!");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 pb-2 pt-8 sm:px-8">
      <div className="glass-raised mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
            Newsletter
          </p>
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Stay in the loop
          </h3>
          <p className="mt-1.5 text-sm text-foreground/60">
            Never miss an upcoming tour date or release.
          </p>
        </div>

        {done ? (
          <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-5 py-3 text-sm font-medium">
            <Check className="size-4" />
            Thanks for subscribing!
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex w-full gap-2 sm:max-w-sm"
            noValidate
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-11 pl-9"
                aria-label="Email address"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 shrink-0 gap-2 font-semibold"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
