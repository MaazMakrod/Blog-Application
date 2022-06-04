import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const SuccessNotification = () => {
  const notification = useSelector(state => state.notification.successNotif)

  useEffect(() => {
    if (notification) {
      toast.success(notification, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }, [notification])

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export const ErrorNotification = () => {
  const notification = useSelector(state => state.notification.errorNotif)

  useEffect(() => {
    if (notification) {
      toast.error(notification,  {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }, [notification])

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export const InfoNotification = () => {
  const notification = useSelector(state => state.notification.infoNotif)

  useEffect(() => {
    if (notification) {
      toast.info(notification,  {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }, [notification])

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}