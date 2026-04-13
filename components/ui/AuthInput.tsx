interface AuthInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}

export function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-body text-sm text-on-surface/60 block mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 font-body text-on-surface outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
