import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

function StatCard({ label, value }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm border border-white/40">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  )
}

function AnnouncementItem({ item }) {
  return (
    <div className="rounded-xl p-4 bg-white/70 backdrop-blur border border-white/40 hover:bg-white/80 transition">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-slate-900 font-semibold">{item.title}</h4>
        {item.pinned && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Pinned</span>
        )}
      </div>
      <p className="text-slate-600 mt-2 leading-relaxed">{item.body}</p>
      {item.publish_at && (
        <p className="text-xs text-slate-500 mt-3">Published {new Date(item.publish_at).toLocaleString()}</p>
      )}
    </div>
  )
}

export default function App() {
  const [counts, setCounts] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          fetch(`${baseUrl}/api/overview`),
          fetch(`${baseUrl}/api/announcements?limit=5`),
        ])
        if (!cRes.ok) throw new Error('Failed to load overview')
        if (!aRes.ok) throw new Error('Failed to load announcements')
        const cJson = await cRes.json()
        const aJson = await aRes.json()
        setCounts(cJson.counts || {})
        setAnnouncements(aJson.items || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-slate-50 text-slate-800">
      {/* Hero section with Spline cover */}
      <div className="relative h-[56vh] w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/vK0TK9mHEhvY3bf1/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        {/* Soft overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/20 via-sky-50/40 to-blue-50/80" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              School Information System
            </h1>
            <p className="mt-4 text-slate-700 text-lg">
              A serene, modern portal for students, teachers, and courses — organized in one place.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Students" value={counts?.student ?? (loading ? '…' : 0)} />
              <StatCard label="Teachers" value={counts?.teacher ?? (loading ? '…' : 0)} />
              <StatCard label="Courses" value={counts?.course ?? (loading ? '…' : 0)} />
              <StatCard label="Enrollments" value={counts?.enrollment ?? (loading ? '…' : 0)} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Announcements */}
        <section>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Latest Announcements</h2>
              <p className="text-slate-600">Pinned and recent updates appear here</p>
            </div>
            <a href="/test" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium">
              Check backend status →
            </a>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-white/60 border border-white/40 animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-xl p-6 bg-white/70 border border-white/40 text-slate-600">
              No announcements yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((a) => (
                <AnnouncementItem key={a._id} item={a} />
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Students', desc: 'Browse and manage student records' },
              { title: 'Teachers', desc: 'View departments and staff' },
              { title: 'Courses', desc: 'Explore the course catalog' },
            ].map((x) => (
              <a key={x.title} href="#" className="group rounded-xl p-5 bg-white/70 border border-white/40 hover:bg-white transition">
                <div className="text-slate-900 font-semibold">{x.title}</div>
                <div className="text-slate-600 mt-1">{x.desc}</div>
                <div className="mt-3 text-blue-700 group-hover:translate-x-1 transition inline-flex">Open →</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 pb-10 pt-6 text-sm text-slate-500">
        <div className="border-t border-slate-200/70 pt-6 flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} BlueWave School Portal</span>
          <span>
            Backend: <code className="font-mono">{baseUrl}</code>
          </span>
        </div>
      </footer>
    </div>
  )
}
