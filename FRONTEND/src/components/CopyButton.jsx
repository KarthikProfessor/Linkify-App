import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for non-secure contexts
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export default function CopyButton({ text, label, className = 'btn-secondary px-2.5 py-1.5' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await copyText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={className} title="Copy to clipboard">
      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
      {!label && <span className="sr-only">Copy</span>}
    </button>
  )
}
