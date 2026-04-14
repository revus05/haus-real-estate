"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, type AppStore, type PreloadedRootState } from "@/store"
import type { SessionUser } from "@/lib/auth/types"

interface SessionProviderProps {
  initialUser: SessionUser | null
  children: React.ReactNode
}

export function SessionProvider({ initialUser, children }: SessionProviderProps) {
  const storeRef = useRef<AppStore | null>(null)

  // Создаём стор ровно один раз — с серверными данными пользователя как preloadedState.
  // Это исключает мигание неавторизованного состояния при гидрации,
  // потому что стор инициализируется синхронно до первого рендера.
  if (storeRef.current === null) {
    const preloadedState: PreloadedRootState = {
      session: { user: initialUser },
    }
    storeRef.current = makeStore(preloadedState)
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
