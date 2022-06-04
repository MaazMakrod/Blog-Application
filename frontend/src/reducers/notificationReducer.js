import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  successNotif: null,
  errorNotif: null,
  infoNotif: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setSuccessNotification(state, action) {
      return {
        ...state,
        successNotif: action.payload
      }
    },
    setErrorNotification(state, action) {
      return {
        ...state,
        errorNotif: action.payload
      }
    },
    setInfoNotification(state, action) {
      return {
        ...state,
        infoNotif: action.payload
      }
    }
  }
})

export const { setSuccessNotification, setErrorNotification, setInfoNotification } = notificationSlice.actions
export default notificationSlice.reducer