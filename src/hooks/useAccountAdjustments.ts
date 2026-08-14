import { useCallback, useEffect, useState } from 'react'
import { getAdjustments, createAdjustment, updateAdjustment, deleteAdjustment } from '../lib/adjustmentApi'
import type { AccountAdjustment, AccountAdjustmentFormValues } from '../types/account'

export function useAccountAdjustments(accountId: string) {
  const [adjustments, setAdjustments] = useState<AccountAdjustment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdjustments(accountId)
      setAdjustments(data)
    } finally {
      setIsLoading(false)
    }
  }, [accountId])

  useEffect(() => {
    void load()
  }, [load])

  const add = async (values: AccountAdjustmentFormValues) => {
    await createAdjustment(accountId, values)
    await load()
  }

  const update = async (id: string, values: AccountAdjustmentFormValues) => {
    await updateAdjustment(id, values)
    await load()
  }

  const remove = async (id: string) => {
    await deleteAdjustment(id)
    await load()
  }

  return { adjustments, isLoading, add, update, remove }
}
