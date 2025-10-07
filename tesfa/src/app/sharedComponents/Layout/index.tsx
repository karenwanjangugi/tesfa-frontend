import Sidebar from "../SideBar"
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <div className="flex px-4 min-h-screen">
    <Sidebar/> 

        <main className="flex-1 p-5 ">{children}</main>

      </div>
  )
}