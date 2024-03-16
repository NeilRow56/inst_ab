import DashboardNavbar from '@/components/dashboard-layout/DashboardNavbar'

import Sidebar from '@/components/dashboard-layout/Sidebar'
import React, { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col   md:flex-row md:overflow-hidden">
      <div className="w-20 flex-none border-gray-600 md:border-r lg:w-64">
        <Sidebar />
      </div>
      <div className="flex  w-full flex-col">
        <DashboardNavbar />
        <div className="mx-auto mt-20 w-full max-w-7xl flex-1 flex-grow p-4 sm:p-6 md:mt-0 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}
export default DashboardLayout
