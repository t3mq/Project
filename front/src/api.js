  const BASE = '/api'

  async function req(path, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } }
    if (body) opts.body = JSON.stringify(body)
    const res = await fetch(BASE + path, opts)
    if (res.status === 204) return null
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  }

  export const api = {
    parcelles: {
      getAll:   ()          => req('/parcelles'),
      getById:  (id)        => req(`/parcelles/${id}`),
      create:   (body)      => req('/parcelles', 'POST', body),
      update:   (id, body)  => req(`/parcelles/${id}`, 'PUT', body),
      delete:   (id)        => req(`/parcelles/${id}`, 'DELETE'),
    },
    cultures: {
      getAll:   ()          => req('/cultures'),
      getById:  (id)        => req(`/cultures/${id}`),
      create:   (body)      => req('/cultures', 'POST', body),
      update:   (id, body)  => req(`/cultures/${id}`, 'PUT', body),
      delete:   (id)        => req(`/cultures/${id}`, 'DELETE'),
    },
    alertes: {
      getAll:   ()   => req('/alertes'),
      resolve:  (id) => req(`/alertes/${id}/resolve`, 'PATCH'),
      run:      ()   => req('/alertes/run', 'POST'),
    },
    meteo: {
      get:      (limit = 7, id_parcelle) => {
        const qs = id_parcelle ? `?limit=${limit}&id_parcelle=${id_parcelle}` : `?limit=${limit}`
        return req(`/meteo${qs}`)
      },
      latest:   () => req('/meteo/latest'),
    },
    observations: {
      getAll:   (id_culture) => req(id_culture ? `/observations?id_culture=${id_culture}` : '/observations'),
      getById:  (id)         => req(`/observations/${id}`),
    },
  }
