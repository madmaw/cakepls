import { useRef } from 'react';

/**
 * Always return the first supplied value regardless of later values
 */
export function useConstant<T>(value: T) {
  return useRef<T>(value).current;
}

type ConstantValue<T> = {
  value: T,
};

/**
 * Always return the first supplied value regardless of later values
 * @param expression the expression that returns the value, will only
 * be called once
 * @returns the first supplied value
 */
export function useConstantExpression<T>(expression: () => T) {
  const ref = useRef<ConstantValue<T>>();
  if (ref.current == null) {
    const value = expression();
    ref.current = {
      value,
    };
  }
  return ref.current.value;
}
