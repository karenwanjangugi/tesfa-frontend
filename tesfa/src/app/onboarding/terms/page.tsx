"use client";
import { useRouter } from "next/navigation";
export default function TermsPage() {
  const router = useRouter();
  const handleAgree = () => {
    router.push("/onboarding/register?agreed=true");
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#00353D] text-white rounded-xl overflow-hidden shadow-2xl border border-[#CDA12B]/30">
        <div className="p-5 border-b border-[#CDA12B]/30 flex justify-between items-center sticky top-0 bg-[#00353D] z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#CDA12B]">Terms and Conditions</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-[#CDA12B] text-5xl cursor-pointer  w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6 text-base md:text-lg leading-relaxed">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">1. Introduction</h2>
            <p>
              Welcome to Tesfa! By using our platform and related services, you agree to these Terms and Conditions. Please read them carefully before using Tesfa.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">2. Who We Are</h2>
            <p>
              Tesfa is an AI-powered platform designed to support NGOs, health agencies, and policymakers in post-conflict regions. Our system provides data-driven insights, helps organizations plan long-term health recovery, and promotes sustainable interventions.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">3. Your Responsibilities</h2>
            <p>When using Tesfa, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide accurate information when creating or managing your account.</li>
              <li>Use Tesfa’s tools and insights only for legitimate organizational or research purposes.</li>
              <li>Keep your login details confidential and protect your account from unauthorized access.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">4. Data and Privacy</h2>
            <p>
              We collect limited personal and organizational information (like your name, email, institution) to provide you with a secure and personalized experience. Tesfa follows data protection laws, including the Kenya Data Protection Act (2019) and GDPR where applicable. Your data is stored securely using encryption and access controls. By using Tesfa, you consent to the collection and use of your data as outlined in our Privacy Policy.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">5. Reports and Insights</h2>
            <p>
              Tesfa provides insights, projections, and recommendations based on available data. While we strive for accuracy, our outputs are informational tools, not guaranteed results. Always validate insights with local data, expert judgment, and your organization’s policies before making decisions.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Use Tesfa for illegal, unethical, or harmful activities.</li>
              <li>Upload or share false, misleading, or confidential data without permission.</li>
              <li>Attempt to interfere with or disrupt Tesfa’s systems, APIs, or security.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">7. Limitation of Liability</h2>
            <p>
              Tesfa is a decision-support tool. We’re not liable for any losses, damages, or decisions made based on Tesfa’s outputs or recommendations. We do our best to ensure the accuracy and reliability of data, but we can’t guarantee it will always be complete or error-free.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">8. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. When we make significant changes, we’ll notify users through the platform or email. Continuing to use Tesfa after updates means you accept the new Terms.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Kenya, and where applicable, by international data and digital service regulations.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#CDA12B] mb-2">10. Contact Us</h2>
            <p>
              For any questions, feedback, or data-related requests, contact at:
              <br />
              <a href="mailto:tesfaakirachix@gmail.com" className="font-medium">tesfaakirachix@gmail.com</a>

              <br />
              Nairobi, Kenya
            </p>
          </section>
          <section className="pt-4 border-t border-[#CDA12B]/30">
            <h3 className="text-lg font-semibold text-[#CDA12B]">Privacy Tip</h3>
            <p className="mt-2">
              Always check your account settings and data permissions regularly. If you have any concerns about how your information is used, contact us immediately.
            </p>
          </section>
        </div>
        <div className="p-4 border-t border-[#CDA12B]/30 bg-[#00353D] flex justify-end">
          <button
            onClick={handleAgree}
            className="px-5 py-2 cursor-pointer bg-[#CDA12B] text-[#00353D] font-bold rounded-lg hover:bg-[#E0B54A] transition"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
}
