'use client'

import { useState, useEffect, useCallback } from 'react'
import { storageService } from '@/services/storage/storageService'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [stored, setStored] = useState<T>(() => {
    return storageService.get<T>(key) ?? initialValue
  })

  useEffect(() => {
    storageService.set(key, stored)
  }, [key, stored])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
        storageService.set(key, next)
        return next
      })
    },
    [key],
  )

  const removeValue = useCallback(() => {
    storageService.remove(key)
    setStored(initialValue)
  }, [key, initialValue])

  return [stored, setValue, removeValue]
}
