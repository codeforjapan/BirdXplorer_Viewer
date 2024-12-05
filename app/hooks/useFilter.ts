import { useState } from "react"
import { Filter } from "~/types"

export const useFilter = () => {
  const [filters, setFilters] = useState<Filter>({})

  const updateFilter = <K extends keyof Filter>(key: K, value: Filter[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return { filters, updateFilter }
}
