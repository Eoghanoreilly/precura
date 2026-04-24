import { redirect } from "next/navigation";

// /doctor/settings is not yet built - redirects to /doctor for now
export default function DoctorSettingsPage() {
  redirect("/doctor");
}
