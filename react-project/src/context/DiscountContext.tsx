import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface DiscountContextValue {
  isStudent: boolean;
  setIsStudent: (value: boolean) => void;
  /** გლობალური ფასდაკლების ინდექსი: 1 = ფასდაკლების გარეშე, 0.85 = სტუდენტური */
  discountIndex: number;
}

const STUDENT_DISCOUNT_INDEX = 0.85;

const DiscountContext = createContext<DiscountContextValue | undefined>(undefined);

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [isStudent, setIsStudent] = useState(false);

  const value = useMemo<DiscountContextValue>(
    () => ({
      isStudent,
      setIsStudent,
      discountIndex: isStudent ? STUDENT_DISCOUNT_INDEX : 1,
    }),
    [isStudent],
  );

  return <DiscountContext.Provider value={value}>{children}</DiscountContext.Provider>;
}

export function useDiscount(): DiscountContextValue {
  const ctx = useContext(DiscountContext);
  if (!ctx) throw new Error('useDiscount უნდა გამოიყენოთ DiscountProvider-ის შიგნით');
  return ctx;
}
