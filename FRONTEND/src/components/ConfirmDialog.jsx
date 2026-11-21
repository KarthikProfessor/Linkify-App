import Modal from './Modal'
import Spinner from './Spinner'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose} title={title} size="max-w-md">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner className="size-4" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
