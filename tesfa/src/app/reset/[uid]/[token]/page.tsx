import ResetFormClient from "@/app/resetPassword/components/ResetForm";
export default async function ResetPage({ params }: { params: Promise<{ uid: string; token: string }> }) {
  const { uid, token } = await params;

  return (
    <div className="overflow-hidden relative min-h-screen bg-[#0E545F] flex items-center justify-center px-4 ${josefinSans.className}">
      <div className="absolute top-10 left-10 w-15">
        <img src="/Images/Tlogo.png" alt="" />
      </div>
      <ResetFormClient uid={uid} token={token} />
      <div className="absolute -bottom-45 -right-27 w-100 h-100 rounded-full border-[10px] border-[#011d1f] opacity-40"></div>
      <div className="absolute -bottom-70 -right-52 w-150 h-150 rounded-full border-[100px] border-[#05393a] opacity-40"></div>
      <div className="absolute -bottom-70 -right-52 w-150 h-150 rounded-full border-[10px] border-[#011d1f] opacity-40"></div>
    </div>
  );
}