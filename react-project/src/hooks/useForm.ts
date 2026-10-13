import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * მრავალჯერადი გამოყენების ფორმის ჰუკი.
 * - values: ველების მნიშვნელობები (useState)
 * - errors: ვალიდაციის შეცდომები (ჩანს მხოლოდ შეხების ან გაგზავნის მცდელობის შემდეგ)
 */
export function useForm<T extends Record<string, string | number>>(
  initialValues: T,
  validate: (values: T) => FormErrors<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const allErrors = useMemo(() => validate(values), [validate, values]);

  const errors = useMemo(() => {
    if (submitted) return allErrors;
    const visible: FormErrors<T> = {};
    (Object.keys(allErrors) as Array<keyof T>).forEach((key) => {
      if (touched[key]) visible[key] = allErrors[key];
    });
    return visible;
  }, [allErrors, touched, submitted]);

  const isValid = Object.keys(allErrors).length === 0;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: typeof prev[name] === 'number' ? Number(value) : value,
      }));
    },
    [],
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const name = e.target.name as keyof T;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      if (isValid) onValid(values);
    },
    [isValid, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { values, errors, isValid, handleChange, handleBlur, handleSubmit, reset };
}
