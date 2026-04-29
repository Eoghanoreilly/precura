import React from 'react';
import { CmdK } from '@/components/doctor/v2/CmdK';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CmdK />
    </>
  );
}
