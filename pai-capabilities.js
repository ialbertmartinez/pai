/* ============================================================
   PERFORM AIR INTERNATIONAL — Capability Search
   ------------------------------------------------------------
   Drop this into a page with:
       <div id="pai-capability-search"></div>
   and load pai-capabilities.css alongside it.

   Everything (search console, results table, quote modal) is
   injected into that container, so the Webflow page never needs
   to be edited again when this file is updated.
   ============================================================ */
(function () {
  "use strict";

  var MOUNT_ID = "pai-capability-search";

  function boot() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) {
      console.warn(
        "[Perform Air] No #" + MOUNT_ID + " element found on this page.",
      );
      return;
    }
    if (mount.getAttribute("data-pai-ready") === "1") return; // never double-init
    mount.setAttribute("data-pai-ready", "1");
    mount.classList.add("pai-cap");
    mount.innerHTML = MARKUP;
    init();
  }

  var MARKUP =
    '<div class="pai-console-wrap">\n  <div class="pai-console">\n    <div class="pai-console-head">\n      <div class="pai-ttl">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>\n        Capability Search\n      </div>\n      <div class="pai-meta"><span class="pai-sync"></span> Synced weekly from internal system \u00b7 <span id="sync-time">updated Mon 02:00 AZ</span></div>\n    </div>\n\n    <div class="pai-search-grid">\n      <div class="pai-field pai-search-main">\n        <label>Part Number</label>\n        <div class="pai-ctrl">\n          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>\n          <input type="text" id="f-pn" placeholder="Enter part number \u2014 e.g. 10000-899 or 10000899\u2026" autocomplete="off">\n        </div>\n      </div>\n      <div class="pai-field">\n        <label>Keyword / Description</label>\n        <div class="pai-ctrl"><input type="text" id="f-keyword" placeholder="e.g. blower, valve, pump\u2026" autocomplete="off"></div>\n      </div>\n      <div class="pai-field">\n        <label>ATA Chapter</label>\n        <div class="pai-ctrl"><select id="f-ata"><option value="">All ATA chapters</option></select></div>\n      </div>\n      <div class="pai-field">\n        <label>Aircraft Type</label>\n        <div class="pai-ctrl"><select id="f-aircraft"><option value="">All aircraft</option></select></div>\n      </div>\n    </div>\n\n    <div class="pai-cert-row">\n      <span class="pai-lbl">Approvals</span>\n      <span class="pai-chip" data-cert="FAA">FAA</span>\n      <span class="pai-chip" data-cert="EASA">EASA</span>\n      <span class="pai-chip" data-cert="CAAC">CAAC</span>\n      <span class="pai-chip" data-cert="DER">DER Available</span>\n      <span class="pai-cert-spacer"></span>\n      <button class="pai-btn-reset" id="btn-reset">\u21ba Reset all filters</button>\n    </div>\n  </div>\n</div>\n\n\n<div class="pai-results-wrap">\n  <div class="pai-results-bar">\n    <div class="pai-results-count" id="results-count">Loading capabilities\u2026</div>\n    <div class="pai-results-tools">\n      <span class="pai-latency" id="latency"></span>\n      <div class="pai-pagesize">\n        Show\n        <select id="f-pagesize">\n          <option>10</option><option selected>20</option><option>50</option><option>100</option>\n        </select>\n      </div>\n      <button class="pai-btn-export" id="btn-export">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>\n        Export results\n      </button>\n    </div>\n  </div>\n\n  <div class="pai-table-card">\n    <table>\n      <thead>\n        <tr>\n          <th data-sort="pn">Part Number <span class="pai-arrow">\u25b2</span></th>\n          <th data-sort="nom">Nomenclature <span class="pai-arrow">\u25b2</span></th>\n          <th data-sort="ata" class="pai-hide-m">ATA <span class="pai-arrow">\u25b2</span></th>\n          <th data-sort="aircraft">Aircraft <span class="pai-arrow">\u25b2</span></th>\n          <th class="pai-cert-col pai-hide-m">FAA</th>\n          <th class="pai-cert-col pai-hide-m">EASA</th>\n          <th class="pai-cert-col pai-hide-m">CAAC</th>\n          <th class="pai-cert-col pai-hide-m">DER</th>\n          <th></th>\n        </tr>\n      </thead>\n      <tbody id="tbody"></tbody>\n    </table>\n    <div class="pai-pager" id="pager"></div>\n  </div>\n</div>\n\n\n<div class="pai-modal-overlay" id="quoteModal">\n  <div class="pai-modal" role="dialog" aria-modal="true" aria-labelledby="qmTitle">\n    <div class="pai-modal-head">\n      <h3 id="qmTitle">Request a Quote</h3>\n      <p>Tell us what you need and our team will respond promptly.</p>\n      <button class="pai-modal-close" id="qmClose" aria-label="Close">\u2715</button>\n    </div>\n\n    <div id="qmForm">\n      <div class="pai-quote-part">\n        <div class="pai-qp"><i>Part Number</i><b id="qpPn">\u2014</b></div>\n        <div class="pai-qp"><i>Nomenclature</i><span id="qpNom">\u2014</span></div>\n        <div class="pai-qp"><i>Aircraft</i><span id="qpAc">\u2014</span></div>\n        <div class="pai-qp"><i>ATA</i><b id="qpAta">\u2014</b></div>\n      </div>\n\n      <div class="pai-quote-body">\n        <div class="pai-qgrid">\n          <div class="pai-qfield"><label>Name <span class="pai-req">*</span></label><input type="text" id="qName" placeholder="Full name"></div>\n          <div class="pai-qfield"><label>Company <span class="pai-req">*</span></label><input type="text" id="qCompany" placeholder="Company name"></div>\n          <div class="pai-qfield"><label>Email <span class="pai-req">*</span></label><input type="email" id="qEmail" placeholder="you@company.com"></div>\n          <div class="pai-qfield"><label>Phone</label><input type="tel" id="qPhone" placeholder="Optional"></div>\n          <div class="pai-qfield"><label>Quantity</label><input type="text" id="qQty" placeholder="e.g. 2"></div>\n          <div class="pai-qfield"><label>Condition / Service</label>\n            <select id="qCond"><option value="">Select\u2026</option><option>Overhaul</option><option>Repair</option><option>Exchange</option><option>New</option></select>\n          </div>\n          <div class="pai-qfield pai-full"><label>Target date / additional notes</label><textarea id="qNotes" placeholder="Any timing needs or details that help us quote accurately\u2026"></textarea></div>\n          <div class="pai-qfield pai-full" style="position:absolute;left:-9999px;height:0;overflow:hidden" aria-hidden="true">\n            <label>Website</label>\n            <input type="text" id="qWebsite" tabindex="-1" autocomplete="off">\n          </div>\n          <div class="pai-qaog">\n            <input type="checkbox" id="qAog">\n            <label for="qAog">This is an <span class="pai-aog-tag">AOG</span> \u2014 aircraft on ground (urgent)</label>\n          </div>\n        </div>\n        <div id="qmError" class="pai-qm-error"></div>\n        <div class="pai-modal-foot">\n          <span class="pai-note">We typically respond within one business day.</span>\n          <div class="pai-qbtns">\n            <button class="pai-btn-cancel" id="qmCancel">Cancel</button>\n            <button class="pai-btn-submit" id="qmSubmit">Submit Request</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class="pai-quote-success" id="qmSuccess">\n      <div class="pai-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>\n      <h3>Request received</h3>\n      <p>Thank you \u2014 your quote request has been sent to our team. You\'ll receive a response at the email you provided, typically within one business day.</p>\n      <p class="pai-ref" id="qmRef">Reference: RFQ-000000</p>\n    </div>\n  </div>\n</div>\n\n';

  function init() {
    /* ---------------------------------------------------------
   LIVE DATA LAYER — Supabase
   All filtering, sorting and pagination run server-side in
   Postgres. The browser only ever receives the rows on screen.
----------------------------------------------------------*/
    const SUPABASE_URL = "https://isymggbuyrfhbbusetuh.supabase.co";
    const SUPABASE_KEY = "sb_publishable_7iwL1TwhwVmvAfO89fUVeA_MkkOcfCi";
    const TABLE = "capabilities";
    const RFQ_FUNCTION = "submit-rfq"; // Supabase Edge Function name

    /* Set to true AFTER running the part_number_norm SQL (see notes).
   Enables punctuation-tolerant P/N search (10000899 finds 10000-899). */
    const PN_NORMALIZED = false;

    const AIRCRAFT = [
      "ATR42",
      "ATR72",
      "Airbus A220",
      "Airbus A300",
      "Airbus A310",
      "Airbus A318",
      "Airbus A319",
      "Airbus A320",
      "Airbus A321",
      "Airbus A330",
      "Airbus A340",
      "Airbus A350",
      "Airbus A380",
      "Airbus A600",
      "Antonov AN-148",
      "BAC1-11",
      "Beechcraft 1900",
      "Bell 204",
      "Bell 206",
      "Boeing 707",
      "Boeing 717",
      "Boeing 720",
      "Boeing 727",
      "Boeing 737",
      "Boeing 737 Next Gen",
      "Boeing 747",
      "Boeing 757",
      "Boeing 767",
      "Boeing 777",
      "Boeing 787",
      "Bombardier BD-500",
      "Bombardier Global Express",
      "Bombardier Q400",
      "British Aero Especial 146",
      "British Aero Especial 31",
      "British Aero Especial 32",
      "CFM56-7B",
      "Canadair 215",
      "Canadair 415",
      "Canadian Regional Jet",
      "Canadian Regional Jet 100",
      "Canadian Regional Jet 170/190",
      "Canadian Regional Jet 200",
      "Canadian Regional Jet 400",
      "Canadian Regional Jet 440",
      "Canadian Regional Jet 600",
      "Canadian Regional Jet 700",
      "Canadian Regional Jet 900",
      "Casa",
      "Challenger 604",
      "Convair 440",
      "Dassault",
      "DeHavilland Dash 6",
      "DeHavilland Dash 7",
      "DeHavilland Dash 8",
      "Douglas Corporation 10",
      "Douglas Corporation 3",
      "Douglas Corporation 6",
      "Douglas Corporation 7",
      "Douglas Corporation 8",
      "Douglas Corporation 9",
      "Embraer 120",
      "Embraer 135",
      "Embraer 140",
      "Embraer 145",
      "Embraer 170",
      "Embraer 190",
      "Embraer Legacy 450",
      "Fairchild-Dornier",
      "Fokker 100",
      "Fokker 28",
      "Fokker 50",
      "Fokker 70",
      "Fokker F27",
      "GE-CF6",
      "Gulf Stream",
      "Hawker Beechcraft 800",
      "King Air 100 Series",
      "King Air 90 Series",
      "Lockheed 1011",
      "Lockheed Commercial C130",
      "Lockheed Electra",
      "Lockheed L382",
      "McDonald Douglas MD80",
      "McDonald Douglas MD83",
      "McDonald Douglas MD88",
      "McDonald Douglas MD90",
      "McDonnell Douglas MD11",
      "Metroliner",
      "Nihon",
      "SAAB",
      "Saab 200",
      "Saab 340",
      "Sikorsky Skycrane",
    ];
    const ATA_NAMES = {
      "03": "",
      15: "",
      16: "",
      20: "Standard Practices",
      21: "Air Conditioning",
      22: "Auto Flight",
      23: "Communications",
      24: "Electrical Power",
      25: "Equipment / Furnishings",
      26: "Fire Protection",
      27: "Flight Controls",
      28: "Fuel",
      29: "Hydraulic Power",
      30: "Ice & Rain Protection",
      31: "Indicating / Recording",
      32: "Landing Gear",
      33: "Lights",
      34: "Navigation",
      35: "Oxygen",
      36: "Pneumatic",
      38: "Water / Waste",
      39: "Electrical Panels",
      47: "Nitrogen Generation",
      49: "Auxiliary Power",
      50: "Cargo Compartments",
      52: "Doors",
      54: "Nacelles / Pylons",
      55: "Stabilizers",
      57: "Wings",
      61: "Propellers",
      71: "Power Plant",
      72: "Engine",
      73: "Engine Fuel & Control",
      75: "Engine Air",
      76: "Engine Controls",
      77: "Engine Indicating",
      78: "Exhaust",
      79: "Oil",
      80: "Starting",
      82: "Water Injection",
      84: "",
      85: "Fuel Cell",
    };

    /* Map UI sort keys -> database columns */
    const SORT_COL = {
      pn: "part_number",
      nom: "nomenclature",
      ata: "ata_number",
      aircraft: "aircraft",
    };

    async function fetchPage() {
      const p = new URLSearchParams();
      p.set(
        "select",
        "part_number,nomenclature,aircraft,ata_number,easa,caac,der_available",
      );

      if (state.aircraft) p.set("aircraft", "eq." + state.aircraft);
      if (state.ata) p.set("ata_chapter", "eq." + state.ata);
      if (state.keyword) p.set("nomenclature", "ilike.*" + state.keyword + "*");
      if (state.pn) {
        if (PN_NORMALIZED) {
          p.set(
            "part_number_norm",
            "ilike.*" + state.pn.replace(/[^A-Za-z0-9]/g, "") + "*",
          );
        } else {
          p.set("part_number", "ilike.*" + state.pn + "*");
        }
      }
      if (state.certs.has("EASA")) p.set("easa", "is.true");
      if (state.certs.has("CAAC")) p.set("caac", "is.true");
      if (state.certs.has("DER")) p.set("der_available", "is.true");
      /* FAA is the baseline for every record, so it needs no filter */

      const col = SORT_COL[state.sort] || "part_number";
      p.set("order", col + "." + (state.dir === 1 ? "asc" : "desc"));

      const from = (state.page - 1) * state.pageSize;
      const to = from + state.pageSize - 1;

      const t0 = performance.now();
      const res = await fetch(
        SUPABASE_URL + "/rest/v1/" + TABLE + "?" + p.toString(),
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY,
            "Range-Unit": "items",
            Range: from + "-" + to,
            Prefer: "count=exact",
          },
        },
      );
      const ms = Math.round(performance.now() - t0);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error("Supabase " + res.status + ": " + msg.slice(0, 300));
      }
      const rows = await res.json();
      /* content-range looks like "0-19/37114" */
      const cr = res.headers.get("content-range") || "";
      const total = parseInt(cr.split("/")[1] || "0", 10) || 0;

      return {
        rows: rows.map((r) => ({
          pn: r.part_number,
          nom: r.nomenclature || "",
          aircraft: r.aircraft || "",
          ata: r.ata_number || "",
          faa: true,
          easa: !!r.easa,
          caac: !!r.caac,
          der: !!r.der_available,
        })),
        total,
        ms,
      };
    }

    /* ---------------------------------------------------------
   STATE
----------------------------------------------------------*/
    const state = {
      keyword: "",
      aircraft: "",
      pn: "",
      ata: "",
      certs: new Set(),
      page: 1,
      pageSize: 20,
      sort: "pn",
      dir: 1,
    };

    /* populate dropdowns */
    const acSel = document.getElementById("f-aircraft");
    AIRCRAFT.forEach((a) => {
      const o = document.createElement("option");
      o.value = a;
      o.textContent = a;
      acSel.appendChild(o);
    });
    const ataSel = document.getElementById("f-ata");
    Object.keys(ATA_NAMES)
      .sort()
      .forEach((c) => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = ATA_NAMES[c]
          ? "ATA " + c + " — " + ATA_NAMES[c]
          : "ATA " + c;
        ataSel.appendChild(o);
      });

    function hl(text, q) {
      if (!q) return text;
      const i = text.toLowerCase().indexOf(q.toLowerCase());
      if (i < 0) return text;
      return (
        text.slice(0, i) +
        '<span class="pai-hl">' +
        text.slice(i, i + q.length) +
        "</span>" +
        text.slice(i + q.length)
      );
    }
    function tickOrDash(v) {
      return v
        ? '<span class="pai-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>'
        : '<span class="pai-dash">—</span>';
    }

    let _reqId = 0;
    async function render() {
      const myReq = ++_reqId;
      const tbEl = document.getElementById("tbody");
      tbEl.style.opacity = ".55";

      let payload;
      try {
        payload = await fetchPage();
      } catch (err) {
        if (myReq !== _reqId) return;
        tbEl.style.opacity = "1";
        document.getElementById("results-count").innerHTML =
          "Could not load capabilities";
        document.getElementById("latency").innerHTML = "";
        tbEl.innerHTML =
          '<tr><td colspan="9"><div class="pai-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>' +
          '<h3>Unable to reach the database</h3><p style="max-width:520px;margin:0 auto">' +
          String(err.message).replace(/</g, "&lt;") +
          "</p></div></td></tr>";
        document.getElementById("pager").innerHTML = "";
        console.error(err);
        return;
      }
      if (myReq !== _reqId) return; // a newer request superseded this one
      tbEl.style.opacity = "1";

      const slice = payload.rows;
      const total = payload.total;
      const filtered =
        state.keyword ||
        state.aircraft ||
        state.pn ||
        state.ata ||
        state.certs.size;
      const pages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page > pages && pages > 0) {
        state.page = pages;
        return render();
      }
      const start = (state.page - 1) * state.pageSize;

      // results count line
      const rc = document.getElementById("results-count");
      if (!filtered) {
        rc.innerHTML = `<b>${total.toLocaleString()}</b> total certified capabilities — refine your search above`;
      } else if (total === 0) {
        rc.innerHTML = `No capabilities match your filters`;
      } else {
        rc.innerHTML = `<b>${total.toLocaleString()}</b> matching ${total === 1 ? "capability" : "capabilities"}`;
      }

      // latency badge (simulated)
      const lat = document.getElementById("latency");
      lat.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg> ${payload.ms} ms`;

      const tb = tbEl;
      if (total === 0) {
        tb.innerHTML = `<tr><td colspan="9"><div class="pai-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <h3>No matching capabilities</h3>
      <p>Try removing a filter, or reach out and our team will confirm by hand.</p></div></td></tr>`;
        document.getElementById("pager").innerHTML = "";
        return;
      }

      tb.innerHTML = slice
        .map(
          (r, idx) => `
    <tr class="pai-match-pulse pai-datarow" data-row="${idx}">
      <td class="pai-pn"><span class="pai-pn-val">${hl(r.pn, state.pn)}</span>
        <button class="pai-m-expand" aria-label="Show certifications">Certifications <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
      </td>
      <td class="pai-nom" data-label="Nomenclature">${hl(r.nom, state.keyword)}</td>
      <td class="pai-ata pai-hide-m" data-label="ATA">${r.ata}</td>
      <td class="pai-ac" data-label="Aircraft"><span class="pai-ac-name">${r.aircraft}</span></td>
      <td class="pai-cert pai-hide-m" data-label="FAA">${tickOrDash(r.faa)}</td>
      <td class="pai-cert pai-hide-m" data-label="EASA">${tickOrDash(r.easa)}</td>
      <td class="pai-cert pai-hide-m" data-label="CAAC">${tickOrDash(r.caac)}</td>
      <td class="pai-cert pai-hide-m" data-label="DER">${r.der ? '<span class="pai-der-pill">DER</span>' : '<span class="pai-dash">—</span>'}</td>
      <td class="pai-quote-cell"><button class="pai-btn-quote" data-pn="${r.pn}" data-nom="${r.nom.replace(/"/g, "&quot;")}" data-ac="${r.aircraft}" data-ata="${r.ata}">Request Quote
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button></td>
    </tr>
    <tr class="pai-cert-detail" data-detail="${idx}"><td colspan="9">
      <div class="pai-cert-detail-inner">
        <span class="pai-cd"><i>FAA</i> ${tickOrDash(r.faa)}</span>
        <span class="pai-cd"><i>EASA</i> ${tickOrDash(r.easa)}</span>
        <span class="pai-cd"><i>CAAC</i> ${tickOrDash(r.caac)}</span>
        <span class="pai-cd"><i>DER</i> ${r.der ? '<span class="pai-der-pill">DER</span>' : '<span class="pai-dash">—</span>'}</span>
        <span class="pai-cd"><i>ATA</i> <b>${r.ata}</b></span>
      </div>
    </td></tr>`,
        )
        .join("");

      // mobile expand toggles
      document.querySelectorAll(".pai-m-expand").forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tr = btn.closest("tr");
          const idx = tr.dataset.row;
          const detail = document.querySelector(
            `.pai-cert-detail[data-detail="${idx}"]`,
          );
          const open = detail.classList.toggle("pai-open");
          btn.classList.toggle("pai-open", open);
        }),
      );

      // pager
      const showStart = total === 0 ? 0 : start + 1;
      const showEnd = Math.min(start + slice.length, total);
      let pageBtns = "";
      const win = 2;
      const lo = Math.max(1, state.page - win),
        hi = Math.min(pages, state.page + win);
      pageBtns += `<button class="pai-pg" data-pg="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>‹</button>`;
      if (lo > 1) {
        pageBtns += `<button class="pai-pg" data-pg="1">1</button>`;
        if (lo > 2)
          pageBtns += `<span style="color:#9fb1c6;padding:0 2px">…</span>`;
      }
      for (let p = lo; p <= hi; p++)
        pageBtns += `<button class="pai-pg ${p === state.page ? "on" : ""}" data-pg="${p}">${p}</button>`;
      if (hi < pages) {
        if (hi < pages - 1)
          pageBtns += `<span style="color:#9fb1c6;padding:0 2px">…</span>`;
        pageBtns += `<button class="pai-pg" data-pg="${pages}">${pages}</button>`;
      }
      pageBtns += `<button class="pai-pg" data-pg="${state.page + 1}" ${state.page === pages ? "disabled" : ""}>›</button>`;

      document.getElementById("pager").innerHTML = `
    <div class="pai-showing">Showing ${showStart.toLocaleString()}–${showEnd.toLocaleString()} of ${total.toLocaleString()}</div>
    <div class="pai-pages">${pageBtns}</div>`;

      document.querySelectorAll(".pai-pg[data-pg]").forEach((b) =>
        b.addEventListener("click", () => {
          const p = parseInt(b.dataset.pg);
          if (p >= 1 && p <= pages) {
            state.page = p;
            render();
            window.scrollTo({
              top: document.querySelector(".pai-results-wrap").offsetTop - 20,
              behavior: "smooth",
            });
          }
        }),
      );
    }

    /* ---- wire up controls ---- */
    let kt;
    document.getElementById("f-keyword").addEventListener("input", (e) => {
      clearTimeout(kt);
      kt = setTimeout(() => {
        state.keyword = e.target.value.trim();
        state.page = 1;
        render();
      }, 120);
    });
    document.getElementById("f-pn").addEventListener("input", (e) => {
      clearTimeout(kt);
      kt = setTimeout(() => {
        state.pn = e.target.value.trim();
        state.page = 1;
        render();
      }, 120);
    });
    document.getElementById("f-aircraft").addEventListener("change", (e) => {
      state.aircraft = e.target.value;
      state.page = 1;
      render();
    });
    document.getElementById("f-ata").addEventListener("change", (e) => {
      state.ata = e.target.value;
      state.page = 1;
      render();
    });
    document.getElementById("f-pagesize").addEventListener("change", (e) => {
      state.pageSize = parseInt(e.target.value);
      state.page = 1;
      render();
    });
    document.querySelectorAll(".pai-chip[data-cert]").forEach((c) =>
      c.addEventListener("click", () => {
        const k = c.dataset.cert;
        c.classList.toggle("pai-on");
        if (state.certs.has(k)) state.certs.delete(k);
        else state.certs.add(k);
        state.page = 1;
        render();
      }),
    );
    document.getElementById("btn-reset").addEventListener("click", () => {
      state.keyword = "";
      state.aircraft = "";
      state.pn = "";
      state.ata = "";
      state.certs.clear();
      state.page = 1;
      document.getElementById("f-keyword").value = "";
      document.getElementById("f-pn").value = "";
      document.getElementById("f-aircraft").value = "";
      document.getElementById("f-ata").value = "";
      document
        .querySelectorAll(".pai-chip.on")
        .forEach((c) => c.classList.remove("pai-on"));
      render();
    });
    document.querySelectorAll("thead th[data-sort]").forEach((th) =>
      th.addEventListener("click", () => {
        const k = th.dataset.sort;
        if (state.sort === k) state.dir *= -1;
        else {
          state.sort = k;
          state.dir = 1;
        }
        document.querySelectorAll("thead th").forEach((x) => {
          x.classList.remove("pai-sorted");
          x.querySelector(".pai-arrow") &&
            (x.querySelector(".pai-arrow").textContent = "▲");
        });
        th.classList.add("pai-sorted");
        th.querySelector(".pai-arrow").textContent =
          state.dir === 1 ? "▲" : "▼";
        render();
      }),
    );
    document.getElementById("btn-export").addEventListener("click", () => {
      const b = document.getElementById("btn-export");
      const o = b.innerHTML;
      b.innerHTML = "✓ Export coming soon";
      setTimeout(() => (b.innerHTML = o), 1800);
    });

    /* ---- Quote modal (deferred until modal markup exists) ---- */
    function initQuoteModal() {
      const qModal = document.getElementById("quoteModal");
      if (!qModal) return;
      const qForm = document.getElementById("qmForm"),
        qSuccess = document.getElementById("qmSuccess");
      let currentPart = {};
      function openQuote(data) {
        currentPart = data || {};
        document.getElementById("qpPn").textContent = data.pn || "—";
        document.getElementById("qpNom").textContent = data.nom || "—";
        document.getElementById("qpAc").textContent = data.ac || "—";
        document.getElementById("qpAta").textContent = data.ata || "—";
        qForm.style.display = "";
        qSuccess.classList.remove("pai-show");
        ["qName", "qCompany", "qEmail", "qPhone", "qQty", "qNotes"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("qCond").value = "";
        document.getElementById("qAog").checked = false;
        document.getElementById("qWebsite").value = "";
        ["qName", "qCompany", "qEmail"].forEach(
          (id) => (document.getElementById(id).style.borderColor = ""),
        );
        qModal.classList.add("pai-open");
        document.body.style.overflow = "hidden";
        setTimeout(() => document.getElementById("qName").focus(), 100);
      }
      function closeQuote() {
        qModal.classList.remove("pai-open");
        document.body.style.overflow = "";
      }
      // safety net: if anything ever leaves the page scroll-locked, clear it
      if (!qModal.classList.contains("pai-open"))
        document.body.style.overflow = "";
      window.addEventListener("pageshow", function () {
        if (!qModal.classList.contains("pai-open"))
          document.body.style.overflow = "";
      });

      document.getElementById("tbody").addEventListener("click", (e) => {
        const btn = e.target.closest(".pai-btn-quote");
        if (!btn) return;
        openQuote({
          pn: btn.dataset.pn,
          nom: btn.dataset.nom,
          ac: btn.dataset.ac,
          ata: btn.dataset.ata,
        });
      });
      document.getElementById("qmClose").addEventListener("click", closeQuote);
      document.getElementById("qmCancel").addEventListener("click", closeQuote);
      qModal.addEventListener("click", (e) => {
        if (e.target === qModal) closeQuote();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && qModal.classList.contains("pai-open"))
          closeQuote();
      });

      document
        .getElementById("qmSubmit")
        .addEventListener("click", async () => {
          const btn = document.getElementById("qmSubmit");
          const name = document.getElementById("qName").value.trim();
          const company = document.getElementById("qCompany").value.trim();
          const email = document.getElementById("qEmail").value.trim();
          let ok = true;
          [
            ["qName", name],
            ["qCompany", company],
            ["qEmail", email],
          ].forEach(([id, v]) => {
            const el = document.getElementById(id);
            if (!v) {
              el.style.borderColor = "#cf5a5f";
              ok = false;
            } else {
              el.style.borderColor = "";
            }
          });
          if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            document.getElementById("qEmail").style.borderColor = "#cf5a5f";
            ok = false;
          }
          if (!ok) return;

          // clear any previous error
          const errBox = document.getElementById("qmError");
          if (errBox) errBox.style.display = "none";

          const original = btn.textContent;
          btn.disabled = true;
          btn.textContent = "Submitting…";
          btn.style.opacity = ".7";

          const payload = {
            part_number: currentPart.pn || null,
            nomenclature: currentPart.nom || null,
            aircraft: currentPart.ac || null,
            ata_number: currentPart.ata || null,
            contact_name: name,
            company: company,
            email: email,
            phone: document.getElementById("qPhone").value.trim() || null,
            quantity: document.getElementById("qQty").value.trim() || null,
            condition: document.getElementById("qCond").value || null,
            is_aog: document.getElementById("qAog").checked,
            notes: document.getElementById("qNotes").value.trim() || null,
            source_page: "capabilities-search",
            website: document.getElementById("qWebsite").value, // honeypot — must stay empty
          };

          try {
            const res = await fetch(
              SUPABASE_URL + "/functions/v1/" + RFQ_FUNCTION,
              {
                method: "POST",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: "Bearer " + SUPABASE_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              },
            );
            const out = await res.json().catch(() => ({}));
            if (!res.ok || out.error) {
              throw new Error(out.error || res.status + ": submission failed");
            }
            document.getElementById("qmRef").textContent =
              "Reference: " + (out.reference || "received");
            qForm.style.display = "none";
            qSuccess.classList.add("pai-show");
          } catch (err) {
            console.error("RFQ submit failed:", err);
            if (errBox) {
              errBox.textContent =
                "Sorry — we couldn\u2019t submit that just now. Please try again, or email us directly. (" +
                err.message +
                ")";
              errBox.style.display = "block";
            }
          } finally {
            btn.disabled = false;
            btn.textContent = original;
            btn.style.opacity = "";
          }
        });
    }

    render();
    initQuoteModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
// 8.24.26 9:14pm
