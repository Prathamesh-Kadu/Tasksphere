import { useState, useEffect, useRef } from "react";
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: (id: string) => void;
};

export default function ToastItem({ id, message, type, duration = 2000, onClose }: Props) {
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const renderIcon = () => {
    switch (type) {
      case "success": return <FaCheckCircle className="text-success" size={18} />;
      case "error": return <FaExclamationCircle className="text-danger" size={18} />;
      case "warning": return <FaExclamationTriangle className="text-warning" size={18} />;
      case "info": return <FaInfoCircle className="text-info" size={18} />;
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose(id);
  };

  useEffect(() => {
    if (!paused) {
      timerRef.current = setTimeout(() => handleClose(), duration);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, duration]);

  if (!visible) return null;

  return (
    <div
      className="toast show bg-white border shadow-sm rounded-3 mb-3 overflow-hidden position-relative"
      style={{
        width: "340px",
        transition: "transform 0.15s ease-in-out",
        opacity: 1
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="toast-body d-flex align-items-center py-2 px-3" style={{ minHeight: "50px" }}>

        <button
          type="button"
          className="btn p-0 border-0 text-muted position-absolute d-flex align-items-center justify-content-center"
          style={{
            top: "14px",
            left: "12px",
            width: "16px",
            height: "16px",
            lineHeight: 1,
            zIndex: 5
          }}
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes size={14} className="text-secondary opacity-75" />
        </button>

        <div
          className="flex-grow-1 text-dark text-start fw-medium"
          style={{
            paddingLeft: "22px",
            paddingRight: "8px",
            fontSize: "13.5px",
            lineHeight: "1.3",
            cursor: "default"
          }}
        >
          {message}
        </div>

        <div className="flex-shrink-0 ms-2 d-flex align-items-center">
          {renderIcon()}
        </div>
      </div>

      <div
        className={`toast-progress position-absolute bottom-0 start-0 bg-${type === "error" ? "danger" : type}`}
        style={{
          height: "3px",
          animationDuration: `${duration}ms`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}