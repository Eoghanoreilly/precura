import { redirect } from "next/navigation";

// /doctor/patients redirects to /doctor (the queue is the patients list for now)
export default function DoctorPatientsPage() {
  redirect("/doctor");
}
