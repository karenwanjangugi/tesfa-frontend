import DashboardPage from "@/app/dashboard/page"
import Sidebar from "../SideBar"
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<div className="flex flex-row w-full h-full">
  <Sidebar />
  <main className="flex-1">{children}</main>
</div>
  )
}