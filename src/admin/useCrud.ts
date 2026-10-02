import { useCallback, useEffect, useState } from 'react'

export interface CrudState<T> {
  data: T[]
  loading: boolean
  error: string | null
  toast: { message: string; type: 'success' | 'error' } | null
  editItem: T | null
  showModal: boolean
}

export function useCrud<T>(
  listFn: () => Promise<T[]>,
  options?: {
    onMount?: () => void
  }
) {
  const [state, setState] = useState<CrudState<T>>({
    data: [],
    loading: true,
    error: null,
    toast: null,
    editItem: null,
    showModal: false,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await listFn()
      setState((s) => ({ ...s, data: Array.isArray(data) ? data : [], loading: false }))
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message, loading: false }))
    }
  }, [listFn])

  useEffect(() => {
    load()
    options?.onMount?.()
  }, [load])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setState((s) => ({ ...s, toast: { message, type } }))
  }

  const dismissToast = () => setState((s) => ({ ...s, toast: null }))

  const openCreate = () =>
    setState((s) => ({ ...s, editItem: null, showModal: true }))

  const openEdit = (item: T) =>
    setState((s) => ({ ...s, editItem: item, showModal: true }))

  const closeModal = () =>
    setState((s) => ({ ...s, showModal: false, editItem: null }))

  const mutate = async (
    fn: () => Promise<any>,
    successMsg: string,
    errorMsg?: string
  ) => {
    try {
      await fn()
      showToast(successMsg)
      await load()
    } catch (e: any) {
      showToast(errorMsg ?? e.message, 'error')
    }
  }

  return { ...state, load, showToast, dismissToast, openCreate, openEdit, closeModal, mutate }
}
