"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, type SubmissionInput } from "@/lib/validators";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const sourceOptions = [
  { value: "ORAL", label: "Oral tradition" },
  { value: "FAMILY", label: "Family story" },
  { value: "LOCAL_LEGEND", label: "Local legend" },
  { value: "BOOK", label: "Book / published source" },
  { value: "ONLINE", label: "Online" },
  { value: "OTHER", label: "Other" },
];

export function SubmitForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { sourceType: "ORAL", contactEmail: "" },
  });

  async function onSubmit(data: SubmissionInput) {
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Submission failed");
        return;
      }
      toast.success("Legend submitted for review");
      setDone(true);
      reset();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  if (done) {
    return (
      <div className="border-[3px] border-ink bg-gold p-6 text-center shadow-[4px_4px_0_0_#0a0a0a] sm:p-8">
        <span className="brutal-stamp bg-white text-ink">Received</span>
        <p className="mt-4 font-display text-2xl uppercase text-ink">
          Thank you
        </p>
        <p className="mt-3 font-serif text-sm text-ink/85">
          Your legend has been received and awaits editorial review. It will not
          appear on the public site until approved.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setDone(false)}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="name"
        label="Legend / ghost name *"
        placeholder="e.g. Local name of the spirit"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="regionText"
        label="Region / state *"
        placeholder="e.g. Bengal, Rajasthan, Kerala…"
        error={errors.regionText?.message}
        {...register("regionText")}
      />
      <Textarea
        id="story"
        label="Story *"
        placeholder="Share the legend as you know it…"
        rows={8}
        error={errors.story?.message}
        {...register("story")}
      />
      <Select
        id="sourceType"
        label="Source type *"
        options={sourceOptions}
        error={errors.sourceType?.message}
        {...register("sourceType")}
      />
      <Input
        id="contactEmail"
        type="email"
        label="Contact email (optional)"
        placeholder="Only used if we need clarification"
        error={errors.contactEmail?.message}
        {...register("contactEmail")}
      />
      <p className="border-2 border-ink bg-bg-page px-3 py-2 text-xs font-medium text-ink shadow-[2px_2px_0_0_#0a0a0a]">
        Submissions are reviewed by editors and are never published automatically.
      </p>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Submit for review"}
      </Button>
    </form>
  );
}
