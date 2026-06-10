import { Toaster } from "react-hot-toast"
import "../../styles/Toast.css"

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
      }}
      containerStyle={{ top: 60 }}
    />
  )
}
