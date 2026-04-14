import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SessionUser } from "@/lib/auth/types"

interface SessionState {
  user: SessionUser | null
}

const initialState: SessionState = { user: null }

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SessionUser | null>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
