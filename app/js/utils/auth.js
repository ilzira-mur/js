import isBrowser from '.'

export default function getToken() {
  if (isBrowser()) {
    const meta = document.head.querySelector('meta[name="api-token"]')
    if (meta) {
      return meta.content
    }
  }
  return 'backend'
}
