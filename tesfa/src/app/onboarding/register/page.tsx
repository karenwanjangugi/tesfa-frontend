import { Suspense } from 'react';
import RegisterForm from './components/RegisterForm';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ agreed?: string }>;
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#FDF6F6] px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row items-center gap-x-50 max-w-screen-xl w-full mx-auto">
        <div className="flex justify-center mb-8 md:mb-0">
          <img
            src="/Images/Group 184.png"
            alt="Logo"
            width={500}
            height={200}
            className="rounded-full drop-shadow-lg"
          />
        </div>
        <Suspense fallback={<div className="md:w-1/2 max-w-md">Loading...</div>}>
          <RegisterForm searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}