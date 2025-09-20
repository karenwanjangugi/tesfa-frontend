import Image from "next/image";
import Sidebar from "./sharedcomponents/SideBar";
import Layout from "./sharedcomponents/Layout";

import ForgotPasswordPage from "./reset-password/page";

export default function Home() {
  return (
    <div>
      <ForgotPasswordPage />
    </div>

  );
}
