import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link2 } from 'lucide-react'
import { urlApi } from '../api/endpoints'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import CreateUrlForm from '../components/CreateUrlForm'
import LinkRow from '../components/LinkRow'
import EditUrlModal from '../components/EditUrlModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { PageLoader } from '../components/Spinner'
import { stripProtocol } from '../utils/format'

const PAGE_SIZE = 10

export default function Links() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  const [urls, setUrls] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const setPage = useCallback(
    (p) => setSearchParams(p > 1 ? { page: String(p) } : {}, { replace: false }),
    [setSearchParams]
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await urlApi.list(page, PAGE_SIZE)
      // Deleted the last link on a page? Step back one page.
      if (result.urls.length === 0 && page > 1) {
        setPage(page - 1)
        return
      }
      setUrls(result.urls)
      setPagination(result.pagination)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your links.'))
    } finally {
      setLoading(false)
    }
  }, [page, setPage])

  useEffect(() => {
    load()
  }, [load])

  function handleCreated() {
    if (page !== 1) setPage(1)
    else load()
  }

  function handleSaved(saved) {
    setUrls((list) => list.map((u) => (u._id === saved._id ? { ...u, ...saved } : u)))
  }

  async function handleToggleActive(url) {
    const next = url.isActive === false
    setTogglingId(url._id)
    try {
      const saved = await urlApi.update(url._id, { isActive: next })
      handleSaved(saved)
      toast.success(next ? 'Link activated' : 'Link deactivated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await urlApi.remove(deleting._id)
      toast.success('Link deleted')
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My links</h1>
        <p className="mt-1 text-sm text-slate-500">Create, edit and manage all of your short links.</p>
      </div>

      <CreateUrlForm onCreated={handleCreated} />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && urls.length === 0 ? (
        <PageLoader />
      ) : urls.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Link2}
            title="No links yet"
            description="Paste a long URL above to create your first short link."
          />
        </div>
      ) : (
        <div className={`card transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-slate-900">All links</h2>
            {pagination?.totalUrls != null && (
              <span className="text-xs text-slate-500">{pagination.totalUrls} total</span>
            )}
          </div>
          <ul className="divide-y divide-slate-100">
            {urls.map((url) => (
              <LinkRow
                key={url._id}
                url={url}
                onEdit={setEditing}
                onDelete={setDeleting}
                onToggleActive={handleToggleActive}
                toggling={togglingId === url._id}
              />
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={pagination?.totalPages}
            total={pagination?.totalUrls}
            onChange={setPage}
            disabled={loading}
          />
        </div>
      )}

      <EditUrlModal url={editing} open={Boolean(editing)} onClose={() => setEditing(null)} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete link?"
        message={
          deleting
            ? `${stripProtocol(deleting.shortUrl)} will stop working immediately and its analytics will be lost. This can't be undone.`
            : ''
        }
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
