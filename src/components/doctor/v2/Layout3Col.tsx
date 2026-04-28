'use client';

import React, { useRef, useState, type ReactNode } from 'react';
import { PanelGroup, Panel, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';

export type Layout3ColProps = {
  nav: ReactNode;
  inbox: ReactNode;
  workspace: ReactNode;
  // mobile-only: typically the inbox alone; workspace lives at /doctor/case/[id]
  mobile?: ReactNode;
};

export function Layout3Col({ nav, inbox, workspace, mobile }: Layout3ColProps) {
  const navRef = useRef<ImperativePanelHandle>(null);
  const inboxRef = useRef<ImperativePanelHandle>(null);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [inboxCollapsed, setInboxCollapsed] = useState(false);

  const desktopLayout = (
    <div className="doc-v2-desktop">
      <PanelGroup direction="horizontal" autoSaveId="doctor-v2" className="doc-v2-panels">
        <Panel
          ref={navRef}
          id="nav"
          order={1}
          defaultSize={18}
          minSize={4}
          maxSize={22}
          collapsible
          collapsedSize={4}
          onCollapse={() => setNavCollapsed(true)}
          onExpand={() => setNavCollapsed(false)}
        >
          <section className={`doc-v2-col doc-v2-col-nav ${navCollapsed ? 'is-collapsed' : ''}`}>
            <div className="doc-v2-col-body hide-scrollbar">{nav}</div>
          </section>
        </Panel>
        <PanelResizeHandle className="doc-v2-seam" />
        <Panel
          ref={inboxRef}
          id="inbox"
          order={2}
          defaultSize={24}
          minSize={18}
          maxSize={34}
          collapsible
          collapsedSize={4}
          onCollapse={() => setInboxCollapsed(true)}
          onExpand={() => setInboxCollapsed(false)}
        >
          <section className={`doc-v2-col doc-v2-col-inbox ${inboxCollapsed ? 'is-collapsed' : ''}`}>
            <div className="doc-v2-col-body hide-scrollbar">{inbox}</div>
          </section>
        </Panel>
        <PanelResizeHandle className="doc-v2-seam" />
        <Panel id="workspace" order={3} minSize={40}>
          <section className="doc-v2-col doc-v2-col-workspace">
            <div className="doc-v2-col-body hide-scrollbar">{workspace}</div>
          </section>
        </Panel>
      </PanelGroup>
    </div>
  );

  const mobileLayout = (
    <div className="doc-v2-mobile">{mobile ?? inbox}</div>
  );

  return (
    <>
      <div className="doc-v2-root-mobile">{mobileLayout}</div>
      <div className="doc-v2-root-desktop">{desktopLayout}</div>

      <style jsx>{`
        .doc-v2-root-mobile { display: block; min-height: 100dvh; background: var(--canvas, #FBF7F0); }
        .doc-v2-root-desktop { display: none; }
        @media (min-width: 1024px) {
          .doc-v2-root-mobile { display: none; }
          .doc-v2-root-desktop { display: block; }
        }
        .doc-v2-desktop {
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--canvas, #FBF7F0);
          overflow: hidden;
          font-family: var(--font-sans);
        }
        .doc-v2-panels { flex: 1; min-height: 0; }
        .doc-v2-col {
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 0;
          min-width: 0;
          overflow: hidden;
        }
        .doc-v2-col-nav { background: var(--paper, #FFFFFF); border-right: 1px solid var(--line-soft, #EEE9DB); }
        .doc-v2-col-inbox { background: var(--canvas-soft, #FDFBF6); border-right: 1px solid var(--line-soft, #EEE9DB); }
        .doc-v2-col-workspace { background: var(--paper, #FFFFFF); }
        .doc-v2-col-body { flex: 1; min-height: 0; overflow-y: auto; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>

      <style jsx global>{`
        .doc-v2-seam {
          width: 1px;
          background: var(--line-soft, #EEE9DB);
          position: relative;
          flex-shrink: 0;
          cursor: col-resize;
          transition: background 0.15s ease;
        }
        .doc-v2-seam::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          left: -3px; right: -3px;
          cursor: col-resize;
        }
        .doc-v2-seam:hover,
        .doc-v2-seam[data-panel-resize-handle-active] {
          background: var(--sage-deep, #445A4A);
        }
      `}</style>
    </>
  );
}
