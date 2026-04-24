# Doctor Portal Narrative v1 - Smoke Test Checklist

Run after deploy. Load https://precura-wine.vercel.app/login and dev-login as Doctor (Tomas).

## Queue rail (left pane, 240px)

- [ ] Three sections visible: "Pending review · N", "Awaiting your note · N", "Recently reviewed · N"
- [ ] Seed patients appear across sections based on their latest panel review_status
- [ ] Anna L shows with a terracotta dot (emotional signal triggered)
- [ ] Carl J does NOT show the terracotta dot despite high chat volume

## Case page - Anna (should auto-trigger emotional rail)

- [ ] Click Anna -> case page loads
- [ ] Header shows "Anna Lindstrom", 2 panels on file, "Emotional signal" pill
- [ ] Continuity timeline shows 3 events: Tomas's old note (5 Feb), new panel, latest chat message
- [ ] Precura pre-read narrative mentions ferritin
- [ ] "Show detail" reveals structured facts (panels on file, consistent above-range markers, etc.)
- [ ] Two flagged marker tiles: Ferritin (below, pink-red) + Liver enzyme (above, amber)
- [ ] Each tile shows a sparkline
- [ ] Emotional rail appears on the right (320px)
- [ ] Trigger strip shows message count, after-22:00 count, worry words with counts
- [ ] Verbatim chat messages appear below trigger strip
- [ ] "Hide context" button dismisses the rail (grid collapses to 2-pane)
- [ ] Auto-drafted opener block shows factual sentence listing each flagged marker
- [ ] "Accept to prepend" prepends opener text into compose field
- [ ] "+ Chat quote" chip opens a chooser with Anna's 10 recent messages
- [ ] "+ Trend" chip opens trend inserts for each flagged marker
- [ ] "+ Marker reference" chip opens full panel marker list
- [ ] Audit footer shows "Opened by Tomas on [date]" in mono type

## Case page - Sofia (stable, no flags)

- [ ] Click Sofia -> no emotional rail
- [ ] No flagged marker tiles
- [ ] Pre-read narrative states all markers in range (via fallback or LLM)
- [ ] Acknowledge button is primary
- [ ] Clicking Acknowledge updates review_status to acknowledged_no_note and queue updates

## Case page - Olivia (awaiting note 32d)

- [ ] Appears in "Awaiting your note" section (or Pending if latest status is pending)
- [ ] Flagged markers shown for TSH + Vitamin D
- [ ] Write a note, click "Post note & acknowledge" -> row moves to "Recently reviewed"

## Outcome states

- [ ] Defer requires a reason (textarea appears; confirm blocked until typed)
- [ ] Post note & acknowledge button disabled until note has content

## Chat / Carl (no auto-trigger test)

- [ ] Click Carl -> NO emotional rail auto-appears despite high chat volume
- [ ] Verbatim chat is NOT forced open

## Audit

- [ ] After opening a panel, `select count(*) from panel_views where panel_id = '...'` increments
- [ ] Posting a note creates an annotation row (visible via Supabase dashboard)
