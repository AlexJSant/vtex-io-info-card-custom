declare module 'vtex.list-context' {
  import type { ReactNode } from 'react'

  export interface ListContextValue {
    list?: ReactNode[]
  }

  export function useListContext(): ListContextValue | undefined

  export interface ListContextProviderProps {
    list: ReactNode[]
    children?: ReactNode
  }

  export const ListContextProvider: React.FC<ListContextProviderProps>
}
