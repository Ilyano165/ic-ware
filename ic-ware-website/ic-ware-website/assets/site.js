(function(){
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Einblendungen ---------- */
  var ios = document.querySelectorAll(".io");
  if("IntersectionObserver" in window && !reduced){
    var obs = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("on"); obs.unobserve(e.target); }
      });
    },{threshold:.12, rootMargin:"0px 0px -6% 0px"});
    ios.forEach(function(el){ obs.observe(el); });
  } else {
    ios.forEach(function(el){ el.classList.add("on"); });
  }

  /* ---------- Nav-Insel ---------- */
  var island = document.getElementById("island");
  if(island){
    var navState = function(){ island.classList.toggle("scrolled", window.scrollY > 12); };
    window.addEventListener("scroll", navState, {passive:true});
    navState();
  }

  /* ---------- Scroll-Beam (Ablauf, nur Startseite) ---------- */
  var flow = document.getElementById("flow");
  if(flow){
    var fill = document.getElementById("beamFill");
    var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
    var ticking = false;
    var beam = function(){
      ticking = false;
      var r = flow.getBoundingClientRect();
      var mark = window.innerHeight * 0.58;
      var passed = Math.min(Math.max(mark - r.top, 0), r.height);
      if(fill) fill.style.height = passed + "px";
      steps.forEach(function(s){
        s.classList.toggle("active", s.getBoundingClientRect().top < mark);
      });
    };
    var onScroll = function(){
      if(!ticking){ ticking = true; window.requestAnimationFrame(beam); }
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onScroll);
    beam();
  }

  /* ---------- Karten: Tilt + Cursor-Glow ---------- */
  if(finePointer && !reduced){
    document.querySelectorAll(".tilt").forEach(function(card){
      card.addEventListener("pointermove", function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px*100).toFixed(1) + "%");
        card.style.setProperty("--my", (py*100).toFixed(1) + "%");
        var rx = ((py - .5) * -5).toFixed(2);
        var ry = ((px - .5) * 5).toFixed(2);
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      card.addEventListener("pointerleave", function(){
        card.style.transform = "";
      });
    });
  }

  /* ---------- Magnetische Buttons ---------- */
  if(finePointer && !reduced){
    document.querySelectorAll(".magnetic").forEach(function(btn){
      btn.addEventListener("pointermove", function(e){
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width/2)) * .18;
        var dy = (e.clientY - (r.top + r.height/2)) * .3;
        dx = Math.max(-7, Math.min(7, dx));
        dy = Math.max(-5, Math.min(5, dy));
        btn.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      btn.addEventListener("pointerleave", function(){
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Jahr ---------- */
  var jahr = document.getElementById("jahr");
  if(jahr) jahr.textContent = new Date().getFullYear();

  /* ---------- Formular-Wizard (nur Startseite) ---------- */
  var form = document.getElementById("anfrage");
  if(!form) return;

  var TYP_LABEL = {
    custom:  "Individuelle Software",
    kanzlei: "Kanzlei-Manager (Demo/Kauf)",
    import:  "Auftrags-Import (Demo/Kauf)"
  };
  var MAIL = "kontakt@ic-ware.eu";
  var fsteps = Array.prototype.slice.call(form.querySelectorAll(".fstep"));
  var prog = document.getElementById("progFill");
  var btnPrev = document.getElementById("btnPrev");
  var btnNext = document.getElementById("btnNext");
  var btnSend = document.getElementById("btnSend");
  var frow = document.getElementById("frow");
  var done = document.getElementById("done");
  var cur = 0;

  function show(i){
    cur = Math.max(0, Math.min(2, i));
    fsteps.forEach(function(fs, idx){ fs.classList.toggle("active", idx === cur); });
    prog.style.width = ((cur + 1) / 3 * 100) + "%";
    btnPrev.style.display = cur === 0 ? "none" : "";
    btnNext.style.display = cur === 2 ? "none" : "";
    btnSend.style.display = cur === 2 ? "" : "none";
  }

  function mark(id, bad){
    document.getElementById(id).classList.toggle("invalid", bad);
    return !bad;
  }
  function validStep(i){
    if(i === 1){
      var b = document.getElementById("beschreibung").value.trim();
      return mark("f-beschreibung", b.length < 10);
    }
    if(i === 2){
      var okName = mark("f-name", document.getElementById("name").value.trim().length < 2);
      var em = document.getElementById("email").value.trim();
      var okMail = mark("f-email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em));
      return okName && okMail;
    }
    return true;
  }

  btnNext.addEventListener("click", function(){
    if(validStep(cur)) show(cur + 1);
  });
  btnPrev.addEventListener("click", function(){ show(cur - 1); });

  /* Radio-Optik (Fallback zu :has) */
  var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="typ"]'));
  function syncOpts(){
    radios.forEach(function(r){
      r.closest(".opt").classList.toggle("sel", r.checked);
    });
  }
  radios.forEach(function(r){ r.addEventListener("change", syncOpts); });

  function selectTyp(t){
    var hit = false;
    radios.forEach(function(r){
      r.checked = (r.value === t);
      if(r.value === t) hit = true;
    });
    if(hit) syncOpts();
    return hit;
  }

  /* Demo-Buttons: Produkt vorwählen und zum Formular springen */
  document.querySelectorAll(".js-demo").forEach(function(b){
    b.addEventListener("click", function(){
      selectTyp(b.getAttribute("data-typ"));
      show(1);
      document.getElementById("kontakt").scrollIntoView({behavior: reduced ? "auto" : "smooth"});
      window.setTimeout(function(){
        document.getElementById("beschreibung").focus({preventScroll:true});
      }, 650);
    });
  });

  /* Vorauswahl per URL, z. B. index.html?typ=kanzlei#kontakt */
  try{
    var q = new URLSearchParams(window.location.search).get("typ");
    if(q && selectTyp(q)) show(1);
  }catch(err){}

  /* Absenden: Mail bauen, Erfolg zeigen */
  var lastBody = "", lastHref = "#";
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!validStep(2)) return;
    var typ = form.querySelector('input[name="typ"]:checked').value;
    var d = {
      typ: TYP_LABEL[typ] || typ,
      beschreibung: document.getElementById("beschreibung").value.trim(),
      firma: document.getElementById("firma").value.trim(),
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim()
    };
    lastBody =
      "Anfrage: " + d.typ + "\n" +
      "Firma: " + (d.firma || "—") + "\n\n" +
      "Beschreibung:\n" + d.beschreibung + "\n\n" +
      "Kontakt: " + d.name + " · " + d.email;
    var subject = "Anfrage: " + d.typ + (d.firma ? " — " + d.firma : "");
    lastHref = "mailto:" + MAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lastBody);

    document.getElementById("sum").textContent = lastBody;
    document.getElementById("btnMail").setAttribute("href", lastHref);

    form.style.display = "none";
    frow.style.display = "none";
    var progWrap = document.querySelector(".prog");
    if(progWrap) progWrap.style.display = "none";
    done.classList.add("active");

    var a = document.createElement("a");
    a.href = lastHref;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  /* Kopieren */
  document.getElementById("btnCopy").addEventListener("click", function(){
    var self = this;
    function fed(){
      self.textContent = "Kopiert ✓";
      window.setTimeout(function(){ self.textContent = "Text kopieren"; }, 1800);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(lastBody).then(fed, fed);
    } else {
      var ta = document.createElement("textarea");
      ta.value = lastBody; document.body.appendChild(ta);
      ta.select(); try{ document.execCommand("copy"); }catch(err){}
      ta.remove(); fed();
    }
  });

  show(0);
  syncOpts();
})();

/* ============================================================
   Partnerprogramm — Bewerbungsformular
   Eigener Block, damit die Startseiten-Logik unberührt bleibt.
   ============================================================ */
(function(){
  var form = document.getElementById("partner");
  if(!form) return;

  var MAIL = "kontakt@ic-ware.eu";
  var TYP_LABEL = {
    dienstleister: "Dienstleister / Berater",
    branche:       "Aus der Branche",
    netzwerk:      "Netzwerk / Sonstiges"
  };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fsteps  = Array.prototype.slice.call(form.querySelectorAll(".fstep"));
  var prog    = document.getElementById("pProgFill");
  var btnPrev = document.getElementById("pBtnPrev");
  var btnNext = document.getElementById("pBtnNext");
  var btnSend = document.getElementById("pBtnSend");
  var frow    = document.getElementById("pfrow");
  var done    = document.getElementById("pDone");
  var cur = 0;

  function show(i){
    cur = Math.max(0, Math.min(2, i));
    fsteps.forEach(function(fs, idx){ fs.classList.toggle("active", idx === cur); });
    prog.style.width = ((cur + 1) / 3 * 100) + "%";
    btnPrev.style.display = cur === 0 ? "none" : "";
    btnNext.style.display = cur === 2 ? "none" : "";
    btnSend.style.display = cur === 2 ? "" : "none";
  }

  function mark(id, bad){
    document.getElementById(id).classList.toggle("invalid", bad);
    return !bad;
  }
  function validStep(i){
    if(i === 1){
      return mark("pf-reichweite",
        document.getElementById("preichweite").value.trim().length < 10);
    }
    if(i === 2){
      var okName  = mark("pf-name",
        document.getElementById("pname").value.trim().length < 2);
      var em = document.getElementById("pemail").value.trim();
      var okMail  = mark("pf-email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em));
      var okRegeln = mark("pf-regeln", !document.getElementById("pregeln").checked);
      return okName && okMail && okRegeln;
    }
    return true;
  }

  btnNext.addEventListener("click", function(){ if(validStep(cur)) show(cur + 1); });
  btnPrev.addEventListener("click", function(){ show(cur - 1); });

  /* Radio-Optik */
  var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="ptyp"]'));
  function syncOpts(){
    radios.forEach(function(r){ r.closest(".opt").classList.toggle("sel", r.checked); });
  }
  radios.forEach(function(r){ r.addEventListener("change", syncOpts); });

  /* Absenden */
  var lastBody = "", lastHref = "#";
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!validStep(2)) return;

    var typ = form.querySelector('input[name="ptyp"]:checked').value;
    var d = {
      typ:        TYP_LABEL[typ] || typ,
      reichweite: document.getElementById("preichweite").value.trim(),
      website:    document.getElementById("pwebsite").value.trim(),
      firma:      document.getElementById("pfirma").value.trim(),
      name:       document.getElementById("pname").value.trim(),
      email:      document.getElementById("pemail").value.trim()
    };

    lastBody =
      "Bewerbung Partnerprogramm\n\n" +
      "Hintergrund: " + d.typ + "\n" +
      "Firma: "   + (d.firma   || "—") + "\n" +
      "Website: " + (d.website || "—") + "\n\n" +
      "Reichweite:\n" + d.reichweite + "\n\n" +
      "Kontakt: " + d.name + " · " + d.email + "\n\n" +
      "Spielregeln gelesen und akzeptiert: ja";

    var subject = "Partner-Bewerbung: " + d.name + (d.firma ? " — " + d.firma : "");
    lastHref = "mailto:" + MAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body="    + encodeURIComponent(lastBody);

    document.getElementById("pSum").textContent = lastBody;
    document.getElementById("pBtnMail").setAttribute("href", lastHref);

    form.style.display = "none";
    frow.style.display = "none";
    var progWrap = document.querySelector("#bewerbung .prog");
    if(progWrap) progWrap.style.display = "none";
    done.classList.add("active");

    var a = document.createElement("a");
    a.href = lastHref;
    document.body.appendChild(a);
    a.click();
    a.remove();

    done.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });

  show(0);
  syncOpts();
})();
