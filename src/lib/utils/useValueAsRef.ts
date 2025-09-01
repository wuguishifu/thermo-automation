'use client';

import { RefObject, useRef } from 'react';

export function useValueAsRef<T>(value: T): RefObject<T> {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}
