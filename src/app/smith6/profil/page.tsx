"use client";

import Link from "next/link";
import {
  ChevronLeft, User, Mail, Phone, MapPin,
  Building, CreditCard, Calendar, Shield,
  Download, Settings, LogOut, Heart,
  FileText, ExternalLink,
} from "lucide-react";
import {
  PATIENT,
} from "@/lib/v2/mock-patient";

const HEALTHCARE_BLUE = "#1862a5";
const HEALTHCARE_BLUE_LIGHT = "#e8f0fb";
const HEALTHCARE_BLUE_DARK = "#0f4c81";
const WARM_BG = "#f7f8fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#4a5568";
const TEXT_MUTED = "#718096";
const BORDER_COLOR = "#e2e8f0";
const SUCCESS_GREEN = "#16a34a";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Smith6Profil() {
  return (
    <div style={{ background: WARM_BG, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/smith6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={22} />
          </Link>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Min profil</div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 20px 80px",
        }}
      >
        {/* Profile card */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: 12,
            padding: "24px 20px",
            marginBottom: 20,
            textAlign: "center" as const,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: HEALTHCARE_BLUE_LIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: HEALTHCARE_BLUE,
              }}
            >
              {PATIENT.firstName[0]}
            </span>
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 4px",
            }}
          >
            {PATIENT.name}
          </h1>
          <p style={{ fontSize: 15, color: TEXT_MUTED, margin: 0 }}>
            Personnummer: {PATIENT.personnummer}
          </p>
        </div>

        {/* Personal information */}
        <section style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              margin: "0 0 12px",
              padding: "0 4px",
            }}
          >
            Personuppgifter
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              { icon: <Calendar size={18} color={HEALTHCARE_BLUE} />, label: "Fodelsedatum", value: formatDate(PATIENT.dateOfBirth) },
              { icon: <Mail size={18} color={HEALTHCARE_BLUE} />, label: "E-post", value: PATIENT.email },
              { icon: <Phone size={18} color={HEALTHCARE_BLUE} />, label: "Telefon", value: PATIENT.phone },
              { icon: <MapPin size={18} color={HEALTHCARE_BLUE} />, label: "Adress", value: PATIENT.address },
              { icon: <Building size={18} color={HEALTHCARE_BLUE} />, label: "Vardcentral", value: PATIENT.vardcentral },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom:
                    i < 4 ? `1px solid ${BORDER_COLOR}` : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: HEALTHCARE_BLUE_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Membership */}
        <section style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              margin: "0 0 12px",
              padding: "0 4px",
            }}
          >
            Medlemskap
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Precura Arlig
                </div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                  Medlem sedan {formatDate(PATIENT.memberSince)}
                </div>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: SUCCESS_GREEN,
                  background: "#ecfdf5",
                  padding: "4px 12px",
                  borderRadius: 10,
                }}
              >
                Aktiv
              </span>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                  Arsavgift
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {PATIENT.membershipPrice.toLocaleString("sv-SE")} kr
                  <span style={{ fontSize: 14, fontWeight: 400, color: TEXT_MUTED }}>
                    /ar
                  </span>
                </div>
              </div>
              <CreditCard size={24} color={HEALTHCARE_BLUE} />
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 14,
                color: TEXT_SECONDARY,
                lineHeight: 1.6,
              }}
            >
              Inkluderar: Blodprover 2x per ar, lakarkonsultationer,
              personlig traningsplan, riskbedomning, meddelandeservice.
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              margin: "0 0 12px",
              padding: "0 4px",
            }}
          >
            Installningar
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              {
                icon: <Download size={18} color={HEALTHCARE_BLUE} />,
                label: "Exportera halsodata (FHIR)",
                desc: "Ladda ner all din data i standardformat",
              },
              {
                icon: <Shield size={18} color={HEALTHCARE_BLUE} />,
                label: "Integritet och samtycke",
                desc: "Hantera dina datadelningsval",
              },
              {
                icon: <FileText size={18} color={HEALTHCARE_BLUE} />,
                label: "Koppling till 1177",
                desc: "Hantera anslutning till 1177 Journalen",
              },
              {
                icon: <Settings size={18} color={HEALTHCARE_BLUE} />,
                label: "Notifikationer",
                desc: "Avisering for meddelanden och paminelser",
              },
            ].map((item, i) => (
              <button
                key={item.label}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom:
                    i < 3 ? `1px solid ${BORDER_COLOR}` : "none",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: HEALTHCARE_BLUE_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                    {item.desc}
                  </div>
                </div>
                <ExternalLink size={16} color={TEXT_MUTED} />
              </button>
            ))}
          </div>
        </section>

        {/* Sign out */}
        <button
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#dc2626",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <LogOut size={18} />
          Logga ut
        </button>

        {/* Footer */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "28px 0 0",
            fontSize: 13,
            color: TEXT_MUTED,
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            <Heart size={14} color={HEALTHCARE_BLUE} />
            <span style={{ fontWeight: 600 }}>Precura</span>
          </div>
          <div>Version 2.0 | Precura AB</div>
          <div style={{ marginTop: 4 }}>
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>
              Anvandarvillkor
            </span>
            {" | "}
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>
              Integritetspolicy
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
