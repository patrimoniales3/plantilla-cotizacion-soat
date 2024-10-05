import * as React from "react"

export interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  // Add any other properties that ToastProps might have
}

export type ToastActionElement = React.ReactElement

export const Toast: React.FC<ToastProps> = ({ title, description, action, variant = "default" }) => {
  return (
    <div className={`toast ${variant}`}>
      {title && <div className="toast-title">{title}</div>}
      {description && <div className="toast-description">{description}</div>}
      {action && <div className="toast-action">{action}</div>}
    </div>
  )
}