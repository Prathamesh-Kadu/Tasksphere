import toast,{ type Toast }  from "react-hot-toast"
import ToastItem from "./ToastItem"

const show = (
  msg: string,
  type: "success" | "error" | "info" | "warning"
) =>
  toast.custom((t: Toast) => (
    <ToastItem
      id={t.id}
      message={msg}
      type={type}
    />
  ))

export const toastSuccess = (msg: string) => show(msg, "success")
export const toastError = (msg: string) => show(msg, "error")
export const toastInfo = (msg: string) => show(msg, "info")
export const toastWarning = (msg: string) => show(msg, "warning")
