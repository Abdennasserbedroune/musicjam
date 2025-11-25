'use client';

import { useState } from 'react';
import NeonButton from './NeonButton';

type InputFieldConfig = {
  name: string;
  type: string;
  label: string;
  icon?: string;
  validation?: (value: string) => string | null;
};

type AuthFormProps = {
  fields: InputFieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
};

export default function AuthForm({
  fields,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {},
    ),
  );
  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    const field = fields.find((f) => f.name === name);
    if (field?.validation && touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: field.validation!(value),
      }));
    }
  };

  const handleBlur = (name: string) => {
    setFocused((prev) => ({ ...prev, [name]: false }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const field = fields.find((f) => f.name === name);
    if (field?.validation) {
      setErrors((prev) => ({
        ...prev,
        [name]: field.validation!(values[name]),
      }));
    }
  };

  const handleFocus = (name: string) => {
    setFocused((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | null> = {};
    let hasErrors = false;

    fields.forEach((field) => {
      if (field.validation) {
        const error = field.validation(values[field.name]);
        newErrors[field.name] = error;
        if (error) hasErrors = true;
      }
      setTouched((prev) => ({ ...prev, [field.name]: true }));
    });

    setErrors(newErrors);

    if (!hasErrors) {
      await onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {fields.map((field) => {
        const hasValue = values[field.name]?.length > 0;
        const isFocused = focused[field.name];
        const showError = touched[field.name] && errors[field.name];

        return (
          <div key={field.name} className="relative">
            <div className="relative">
              {field.icon && (
                <span className="absolute left-3 top-3.5 text-xl">
                  {field.icon}
                </span>
              )}
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onFocus={() => handleFocus(field.name)}
                onBlur={() => handleBlur(field.name)}
                className={`input-neon ${field.icon ? 'pl-12' : ''} ${
                  showError ? 'border-red-500 focus:ring-red-500/50' : ''
                }`}
              />
              <label
                className={`floating-label ${field.icon ? 'left-12' : 'left-3'} ${
                  hasValue || isFocused ? 'floating-label-active' : ''
                }`}
              >
                {field.label}
              </label>
            </div>
            {showError && (
              <p className="mt-1 text-sm text-red-400">{errors[field.name]}</p>
            )}
          </div>
        );
      })}

      <NeonButton
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {submitLabel}
      </NeonButton>
    </form>
  );
}
