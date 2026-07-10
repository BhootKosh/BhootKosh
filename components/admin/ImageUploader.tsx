"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export function ImageUploader({
  value,
  onChange,
  label = "Image URL",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Upload failed");
        return;
      }
      onChange(json.secureUrl || json.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        id="image-url"
        label={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer">
          <span className="inline-flex border-[3px] border-ink bg-gold px-3 py-2 text-xs font-bold uppercase text-ink shadow-[2px_2px_0_0_#0a0a0a] hover:bg-saffron hover:text-white">
            {uploading ? "Uploading…" : "Upload image"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        )}
      </div>
      {value && (
        <div className="relative h-40 w-full max-w-sm overflow-hidden border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
