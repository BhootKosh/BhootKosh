"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to send message");
        return;
      }
      toast.success("Message sent");
      setDone(true);
      reset();
    } catch {
      toast.error("Network error");
    }
  }

  if (done) {
    return (
      <div className="border-[3px] border-ink bg-accent-cyan p-6 text-center shadow-[4px_4px_0_0_#0a0a0a] sm:p-8">
        <span className="brutal-stamp bg-gold text-ink">Sent</span>
        <p className="mt-4 font-display text-2xl uppercase text-ink">
          Message received
        </p>
        <p className="mt-3 font-serif text-sm text-ink/85">
          Thank you for writing to BhootKosh. We will respond if a reply is
          needed.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setDone(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="name"
        label="Name *"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="email"
        type="email"
        label="Email *"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="subject"
        label="Subject"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        id="message"
        label="Message *"
        rows={6}
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
