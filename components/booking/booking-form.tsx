"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  useWatch,
  type Control,
  type Resolver,
  type UseFormSetValue,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Loader2,
  PartyPopper,
  ReceiptText,
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
import { estimateBookingQuote, type BookingQuoteEstimate } from "@/lib/booking-quote";

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
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as unknown as Resolver<BookingInput>,
    defaultValues: bookingDefaults as BookingInput,
    mode: "onTouched",
  });

  const quoteValues = useWatch({ control }) as Partial<BookingInput>;
  const quote = estimateBookingQuote(quoteValues);
  const total = STEPS.length;
  const isLast = step === total - 1;

  useEffect(() => {
    if (
      quoteValues.repertoire === "Original Music" &&
      (quoteValues.setLength !== "2 hours" || quoteValues.customHours)
    ) {
      setValue("setLength", "2 hours", { shouldDirty: true, shouldValidate: true });
      setValue("customHours", undefined, { shouldDirty: true, shouldValidate: true });
    }
  }, [quoteValues.customHours, quoteValues.repertoire, quoteValues.setLength, setValue]);

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
        body: JSON.stringify(values),
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
    <div className="glass-raised min-w-0 rounded-3xl p-5 sm:p-8">
      <QuoteEstimate estimate={quote} />

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
            {step === 2 && (
              <Step3
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            )}
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

function QuoteEstimate({ estimate }: { estimate: BookingQuoteEstimate }) {
  return (
    <div className="mb-6 min-w-0 border-b border-white/10 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/85">
          <ReceiptText className="size-4 text-primary" />
          Live estimate
        </div>
        <span className="font-display text-xl font-bold tracking-normal text-foreground sm:text-2xl">
          {estimate.label}
        </span>
      </div>
      <div className="mt-3 flex min-w-0 max-w-full items-start gap-2 overflow-x-auto pb-1 text-xs leading-relaxed text-foreground/55">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary/80" />
        <p className="shrink-0 whitespace-nowrap">
          Estimate only; final quote follows logistics, production, travel, and event review.
        </p>
      </div>
      {estimate.notes.length > 0 && (
        <div className="mt-3 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
          {estimate.notes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-foreground/55"
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- step bodies ---------- */

type StepProps = {
  register: UseFormRegister<BookingInput>;
  control: Control<BookingInput>;
  errors?: FieldErrors<BookingInput>;
  setValue?: UseFormSetValue<BookingInput>;
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
  const setting = useWatch({ control, name: "setting" });
  const isOutdoor = setting === "Outdoor" || setting === "Both / Unsure";

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
      {isOutdoor && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="overheadCoverage"
            render={({ field }) => (
              <Toggle
                label="Overhead coverage / shade"
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
                label="Power at performance location"
                value={!!field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      )}
    </>
  );
}

function Step3({ control, errors, setValue }: StepProps) {
  const repertoire = useWatch({ control, name: "repertoire" });
  const setLengthOptions =
    repertoire === "Original Music"
      ? (["2 hours"] as const)
      : SET_LENGTH_OPTIONS;

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
        <div className="flex flex-wrap items-center gap-2">
          <Controller
            control={control}
            name="setLength"
            render={({ field }) => (
              <Pills
                options={setLengthOptions}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue?.("customHours", undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}
          />
          {repertoire !== "Original Music" && (
            <Controller
              control={control}
              name="customHours"
              render={({ field }) => (
                <label className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-foreground/70 transition-colors focus-within:border-primary/60 focus-within:bg-primary/10 focus-within:text-primary">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={4}
                    max={12}
                    step={1}
                    aria-label="Custom performance hours"
                    placeholder="4+"
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                      setValue?.("setLength", undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    className="h-7 w-12 border-0 bg-transparent p-0 text-center text-sm shadow-none focus-visible:ring-0"
                  />
                  <span>hours</span>
                </label>
              )}
            />
          )}
        </div>
        {errors?.customHours?.message && (
          <p className="text-xs text-destructive">{errors.customHours.message}</p>
        )}
      </Field>
    </>
  );
}

function Step4({ register, control }: StepProps) {
  return (
    <>
      <Field label="Will the band be providing sound reinforcement?">
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
      <Controller
        control={control}
        name="formalDress"
        render={({ field }) => (
          <Toggle
            label="Formal / upscale dress requirement"
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
