import Sidebar from "../SideBar"
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <div className="flex min-h-screen">
    <Sidebar/>
        <main className="flex w-full">{children}</main>
      </div>
  )
}