import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { RootLayout } from '@/layouts/root-layout'

const HomePage = lazy(() => import('@/pages/index'))
const AboutPage = lazy(() => import('@/pages/about'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
