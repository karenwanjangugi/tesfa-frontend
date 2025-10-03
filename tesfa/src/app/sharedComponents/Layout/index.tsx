import DashboardPage from "@/app/dashboard/page"
import Sidebar from "../SideBar"
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <div className="flex min-h-screen">
    <Sidebar/>

        <main className="flex-1 p-5 overflow-y-hidden">{children}</main>

      </div>
  )
}