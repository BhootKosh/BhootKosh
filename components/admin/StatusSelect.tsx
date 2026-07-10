import { Select } from "@/components/ui/Select";

export function StatusSelect({
  value,
  onChange,
  name,
  register,
}: {
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
  register?: object;
}) {
  return (
    <Select
      id="status"
      label="Status"
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      name={name}
      options={[
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" },
      ]}
      {...register}
    />
  );
}
