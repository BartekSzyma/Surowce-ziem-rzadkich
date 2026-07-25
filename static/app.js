// nawigacja mobilna + wyszukiwarka klienta
(function () {
  var toggle = document.getElementById("menu-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });

  var box = document.getElementById("searchbox");
  var res = document.getElementById("search-results");
  var root = window.SITE_ROOT || "";
  if (!box || !res || !window.SEARCH) return;

  var sel = -1, items = [];

  function norm(s) {
    return (s || "").toLowerCase()
      .replace(/ą/g,"a").replace(/ć/g,"c").replace(/ę/g,"e").replace(/ł/g,"l")
      .replace(/ń/g,"n").replace(/ó/g,"o").replace(/ś/g,"s").replace(/ź/g,"z").replace(/ż/g,"z");
  }
  function run(q) {
    q = norm(q.trim());
    res.innerHTML = ""; sel = -1; items = [];
    if (q.length < 2) { res.classList.remove("open"); return; }
    var terms = q.split(/\s+/);
    var scored = [];
    window.SEARCH.forEach(function (p) {
      var hayT = norm(p.t), hayS = norm(p.s);
      var sc = 0, ok = true;
      terms.forEach(function (t) {
        var inT = hayT.indexOf(t) >= 0, inS = hayS.indexOf(t) >= 0;
        if (!inT && !inS) ok = false;
        if (inT) sc += 10;
        if (inS) sc += 1;
      });
      if (ok) scored.push({ p: p, sc: sc });
    });
    scored.sort(function (a, b) { return b.sc - a.sc; });
    scored = scored.slice(0, 12);
    if (!scored.length) { res.innerHTML = '<div class="sr-empty">Brak wyników</div>'; res.classList.add("open"); return; }
    scored.forEach(function (o) {
      var a = document.createElement("a");
      a.className = "sr-item"; a.href = root + o.p.u;
      var snip = o.p.s.slice(0, 150);
      a.innerHTML = '<div class="sr-title">' + esc(o.p.t) + '</div><div class="sr-snip">' + esc(snip) + '…</div>';
      res.appendChild(a); items.push(a);
    });
    res.classList.add("open");
  }
  function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML;}

  box.addEventListener("input", function () { run(box.value); });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); paint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
    else if (e.key === "Enter" && sel >= 0) { items[sel].click(); }
    else if (e.key === "Escape") { res.classList.remove("open"); box.blur(); }
  });
  function paint(){ items.forEach(function(a,i){ a.classList.toggle("sel", i===sel); }); if(items[sel]) items[sel].scrollIntoView({block:"nearest"}); }
  document.addEventListener("click", function (e) { if (!res.contains(e.target) && e.target !== box) res.classList.remove("open"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== box) { e.preventDefault(); box.focus(); }
  });
})();
