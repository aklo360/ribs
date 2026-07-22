"use client";

import { useMemo, useState } from "react";
import {
  useForm,
  Controller,
  useWatch,
  type Control,
  type Resolver,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Loader2,
  PartyPopper,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  bookingSchema,
  bookingDefaults,
  type BookingInput,
  INQUIRER_TYPES,
  EVENT_TYPES,
  LINEUP_OPTIONS,
  REPERTOIRE_OPTIONS,
  SET_LENGTH_OPTIONS,
  PROVIDED_OPTIONS,
  BACKLINE_ITEMS,
  BUDGET_RANGES,
  HEARD_OPTIONS,
} from "@/lib/booking-schema";
import {
  calculateQuoteEstimate,
  formatMoney,
  formatQuoteEstimate,
  type QuoteEstimate,
} from "@/lib/quote";

/* ---------- small field primitives ---------- */

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Pills({
  value,
  onChange,
  options,
  multi,
}: {
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  options: readonly string[];
  multi?: boolean;
}) {
  const selected = (v: string) =>
    multi ? Array.isArray(value) && value.includes(v) : value === v;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => {
            if (multi) {
              const arr = Array.isArray(value) ? [...value] : [];
              onChange(
                arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]
              );
            } else {
              onChange(opt);
            }
          }}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
            selected(opt)
              ? "border-primary/60 bg-primary/15 text-primary"
              : "border-white/10 bg-white/[0.03] text-foreground/70 hover:border-white/20 hover:text-foreground"
          )}
        >
          {selected(opt) && <Check className="mr-1.5 inline size-3.5" />}
          {opt}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-all",
        value
          ? "border-primary/50 bg-primary/10 text-foreground"
          : "border-white/10 bg-white/[0.03] text-foreground/70 hover:border-white/20"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          value ? "bg-primary" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            value ? "translate-x-[1.4rem]" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

function QuotePreview({ estimate }: { estimate: QuoteEstimate }) {
  const visibleItems = estimate.items.slice(0, 3);

  return (
    <div className="mb-7 border-y border-white/10 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-foreground">
            <Calculator className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-normal text-foreground/55">
              Planning quote
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Estimate updates as the event details come together.
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="font-display text-3xl font-bold text-foreground">
            {formatQuoteEstimate(estimate)}
          </p>
          <p className="mt-1 text-xs text-foreground/45">
            Final quote confirmed by the band.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <span
            key={`${item.label}-${item.amount}`}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground/60"
          >
            {item.label}
            {item.amount !== 0 && (
              <span className="ml-1 text-foreground/40">
                {item.amount > 0 ? "+" : ""}
                {formatMoney(item.amount)}
              </span>
            )}
          </span>
        ))}
        {estimate.needsReview.slice(0, 2).map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground/45"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- steps ---------- */

const STEPS = [
  { title: "Your details", fields: ["name", "email"] },
  { title: "The event", fields: ["city"] },
  { title: "Performance", fields: [] },
  { title: "Sound & backline", fields: [] },
  { title: "Budget & details", fields: [] },
] as const;

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as unknown as Resolver<BookingInput>,
    defaultValues: bookingDefaults as BookingInput,
    mode: "onTouched",
  });
  const quoteFields = useWatch({ control });
  const estimate = useMemo(
    () => calculateQuoteEstimate(quoteFields),
    [quoteFields]
  );

  const total = STEPS.length;
  const isLast = step === total - 1;

  async function next() {
    const fields = STEPS[step].fields as readonly (keyof BookingInput)[];
    const ok = fields.length ? await trigger(fields as never) : true;
    if (ok) setStep((s) => Math.min(s + 1, total - 1));
  }

  async function onSubmit(values: BookingInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          quoteEstimate: formatQuoteEstimate(calculateQuoteEstimate(values)),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setDone(true);
      toast.success("Inquiry sent — we'll be in touch soon!");
    } catch {
      toast.error("Something went wrong. Email us directly and we'll sort it out.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-raised flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary glow">
          <PartyPopper className="size-7" />
        </span>
        <h3 className="font-display text-2xl font-bold">Inquiry received</h3>
        <p className="max-w-md text-foreground/65">
          Thanks for reaching out to Roots in Blue Stone. We&apos;ll review the
          details and get back to you shortly about availability and a quote.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="glass-raised rounded-3xl p-5 sm:p-8">
      {/* Progress */}
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-display font-semibold text-foreground">
            {STEPS[step].title}
          </span>
          <span className="text-foreground/50">
            Step {step + 1} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <QuotePreview estimate={estimate} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
          {...register("company_website")}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            {step === 0 && (
              <Step1 register={register} control={control} errors={errors} />
            )}
            {step === 1 && (
              <Step2 register={register} control={control} errors={errors} />
            )}
            {step === 2 && <Step3 register={register} control={control} />}
            {step === 3 && <Step4 register={register} control={control} />}
            {step === 4 && <Step5 register={register} control={control} />}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-2 text-foreground/70 disabled:opacity-0"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {isLast ? (
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 font-semibold glow"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Inquiry
            </Button>
          ) : (
            <Button type="button" onClick={next} className="gap-2 font-semibold">
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------- step bodies ---------- */

type StepProps = {
  register: UseFormRegister<BookingInput>;
  control: Control<BookingInput>;
  errors?: FieldErrors<BookingInput>;
};

function Step1({ register, control, errors }: StepProps) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors?.name?.message}>
          <Input placeholder="Your name" {...register("name")} />
        </Field>
        <Field label="Email" required error={errors?.email?.message}>
          <Input type="email" placeholder="you@email.com" {...register("email")} />
        </Field>
        <Field label="Phone">
          <Input type="tel" placeholder="(555) 555-5555" {...register("phone")} />
        </Field>
        <Field label="Organization / Venue">
          <Input placeholder="Company, venue, or event name" {...register("organization")} />
        </Field>
      </div>
      <Field label="I'm a…">
        <Controller
          control={control}
          name="inquirerType"
          render={({ field }) => (
            <Pills options={INQUIRER_TYPES} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
    </>
  );
}

function Step2({ register, control, errors }: StepProps) {
  return (
    <>
      <Field label="Type of event">
        <Controller
          control={control}
          name="eventType"
          render={({ field }) => (
            <Pills options={EVENT_TYPES} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Event date">
          <Input type="date" {...register("eventDate")} />
        </Field>
        <Controller
          control={control}
          name="dateFlexible"
          render={({ field }) => (
            <div className="flex flex-col justify-end">
              <Toggle
                label="Date is flexible"
                value={!!field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />
        <Field label="City" required error={errors?.city?.message}>
          <Input placeholder="City" {...register("city")} />
        </Field>
        <Field label="State / Region">
          <Input placeholder="State" {...register("region")} />
        </Field>
        <Field label="Venue name">
          <Input placeholder="Where's the show?" {...register("venueName")} />
        </Field>
        <Field label="Expected audience size">
          <Input placeholder="e.g. 150" {...register("audienceSize")} />
        </Field>
      </div>
      <Field label="Setting">
        <Controller
          control={control}
          name="setting"
          render={({ field }) => (
            <Pills
              options={["Indoor", "Outdoor", "Both / Unsure"] as const}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>
    </>
  );
}

function Step3({ control }: StepProps) {
  return (
    <>
      <Field label="Lineup size">
        <Controller
          control={control}
          name="lineup"
          render={({ field }) => (
            <Pills options={LINEUP_OPTIONS} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Field label="Repertoire">
        <Controller
          control={control}
          name="repertoire"
          render={({ field }) => (
            <Pills
              options={REPERTOIRE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>
      <Field label="Desired set length">
        <Controller
          control={control}
          name="setLength"
          render={({ field }) => (
            <Pills
              options={SET_LENGTH_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>
    </>
  );
}

function Step4({ register, control }: StepProps) {
  return (
    <>
      <Field label="Sound system / PA">
        <Controller
          control={control}
          name="soundProvided"
          render={({ field }) => (
            <Pills options={PROVIDED_OPTIONS} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Field label="Backline / gear available on site">
        <Controller
          control={control}
          name="backline"
          render={({ field }) => (
            <Pills
              multi
              options={BACKLINE_ITEMS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="soundEngineerNeeded"
          render={({ field }) => (
            <Toggle
              label="Sound engineer needed"
              value={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="powerAvailable"
          render={({ field }) => (
            <Toggle
              label="Power available at stage"
              value={!!field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <Field label="Stage size / load-in notes">
        <Textarea
          rows={3}
          placeholder="Stage dimensions, load-in access, parking, curfews…"
          {...register("stageNotes")}
        />
      </Field>
    </>
  );
}

function Step5({ register, control }: StepProps) {
  return (
    <>
      <Field label="Budget range">
        <Controller
          control={control}
          name="budget"
          render={({ field }) => (
            <Pills options={BUDGET_RANGES} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Controller
        control={control}
        name="travelLodging"
        render={({ field }) => (
          <Toggle
            label="Travel & lodging covered"
            value={!!field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Field label="Anything else?">
        <Textarea
          rows={4}
          placeholder="Tell us about the event, the vibe, special requests…"
          {...register("message")}
        />
      </Field>
      <Field label="How did you hear about us?">
        <Controller
          control={control}
          name="heardFrom"
          render={({ field }) => (
            <Pills options={HEARD_OPTIONS} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
    </>
  );
}
