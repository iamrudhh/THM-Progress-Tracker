(() => {
  const KEY = "thm-tracker-v1";
  const $ = id => document.getElementById(id);
  const LABELS = { todo: "Not started", prog: "In progress", done: "Completed" };

  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  const status = slug => state[slug] || "todo";

  const rooms = ROOMS.map(([cat, name, slug]) => ({ cat, name, slug }));
  const cats = [...new Set(rooms.map(r => r.cat))];
  const openCats = new Set();
  let filter = "all";

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // category dropdown
  $("category").innerHTML = '<option value="">All categories</option>' +
    cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");

  function counts(list) {
    const c = { todo: 0, prog: 0, done: 0 };
    list.forEach(r => c[status(r.slug)]++);
    return c;
  }

  function renderSummary() {
    const c = counts(rooms), n = rooms.length;
    $("sDone").textContent = c.done;
    $("sProg").textContent = c.prog;
    $("sTodo").textContent = c.todo;
    $("sPct").textContent = Math.round((c.done / n) * 100) + "%";
    $("barDone").style.width = (c.done / n) * 100 + "%";
    $("barProg").style.width = (c.prog / n) * 100 + "%";
  }

  function render() {
    const q = $("search").value.trim().toLowerCase();
    const cat = $("category").value;
    const searching = q || filter !== "all" || cat;
    let html = "", shown = 0;

    cats.forEach(c => {
      if (cat && c !== cat) return;
      const all = rooms.filter(r => r.cat === c);
      const list = all.filter(r =>
        (filter === "all" || status(r.slug) === filter) &&
        (!q || r.name.toLowerCase().includes(q)));
      if (!list.length) return;
      shown += list.length;

      const t = counts(all), total = all.length;
      const open = searching || openCats.has(c) ? " open" : "";
      html += `<details data-cat="${esc(c)}"${open}><summary>
        <span class="cname">${esc(c)}</span>
        <span class="mini"><i class="d" style="width:${(t.done / total) * 100}%"></i><i class="p" style="width:${(t.prog / total) * 100}%"></i></span>
        <span class="ccount">${t.done}/${total}</span></summary>`;

      list.forEach(r => {
        const s = status(r.slug);
        html += `<div class="room ${s}" data-slug="${esc(r.slug)}">
          <a href="https://tryhackme.com/room/${esc(r.slug)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>
          <div class="seg" role="group" aria-label="Status of ${esc(r.name)}">` +
          Object.keys(LABELS).map(k =>
            `<button data-s="${k}" class="${s === k ? "on" : ""}" aria-pressed="${s === k}">${LABELS[k]}</button>`).join("") +
          `</div></div>`;
      });
      html += "</details>";
    });

    $("list").innerHTML = html;
    $("empty").hidden = shown > 0;
    renderSummary();
  }

  // events
  $("list").addEventListener("click", e => {
    const b = e.target.closest(".seg button");
    if (!b) return;
    const slug = b.closest(".room").dataset.slug;
    if (b.dataset.s === "todo") delete state[slug]; else state[slug] = b.dataset.s;
    save();
    const det = b.closest("details");
    openCats.add(det.dataset.cat);
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  });

  $("list").addEventListener("toggle", e => {
    const d = e.target, c = d.dataset && d.dataset.cat;
    if (!c) return;
    d.open ? openCats.add(c) : openCats.delete(c);
  }, true);

  $("search").addEventListener("input", render);
  $("category").addEventListener("change", render);
  $("tabs").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll("#tabs button").forEach(x => x.classList.toggle("on", x === b));
    render();
  });

  // backup
  $("export").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
    a.download = "thm-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $("import").onclick = () => $("file").click();
  $("file").onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (typeof data !== "object" || Array.isArray(data)) throw 0;
        state = {};
        Object.keys(data).forEach(k => { if (data[k] === "prog" || data[k] === "done") state[k] = data[k]; });
        save(); render();
      } catch (err) { alert("That file is not a valid backup."); }
    };
    r.readAsText(f);
    e.target.value = "";
  };
  $("reset").onclick = () => {
    if (confirm("Clear all progress? This cannot be undone.")) { state = {}; save(); render(); }
  };

  render();
})();
