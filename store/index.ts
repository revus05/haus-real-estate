import { configureStore } from "@reduxjs/toolkit"
import { sessionReducer } from "./sessionSlice"
import type { SessionUser } from "@/lib/auth/types"

export interface PreloadedRootState {
  session: { user: SessionUser | null }
}

export function makeStore(preloadedState?: PreloadedRootState) {
  return configureStore({
    reducer: {
      session: sessionReducer,
    },
    preloadedState,
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
