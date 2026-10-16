/* ==========================================================================
   PANGEA — interactions et animations
   Tout le contenu reste lisible sans JavaScript : les animations ne font
   que l'accompagner. Les préférences « mouvement réduit » sont respectées.
   ========================================================================== */
(() => {
  const doc = document.documentElement;
  const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap;
  const anime = Boolean(G) && !calme;
  if (anime && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-annee]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Portraits : si la photo manque, on garde les initiales ---------- */
  document.querySelectorAll(".portrait img").forEach((img) => {
    const retirer = () => img.remove();
    if (img.complete && img.naturalWidth === 0) retirer();
    else img.addEventListener("error", retirer);
  });

  /* ---------- Logo et nom : masqués dès qu'on fait défiler ---------- */
  let attente = false;
  const majDefile = () => { doc.classList.toggle("defile", window.scrollY > 60); attente = false; };
  window.addEventListener("scroll", () => { if (!attente) { attente = true; requestAnimationFrame(majDefile); } }, { passive: true });
  majDefile();

  /* ---------- Animations CSS en pause quand elles sont hors de l'écran ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => e.target.classList.toggle("pause", !e.isIntersecting));
    }, { rootMargin: "100px" });
    document.querySelectorAll(".forme, .galet, .rebours-blob, .engagement .pastille, .grille-9 .g, .a-venir, .intro-visuel .anneau")
      .forEach((el) => { if (!el.closest(".rideau")) io.observe(el); });
  }

  /* ---------- Anneaux de texte : la taille s'ajuste pour faire le tour exact ---------- */
  document.querySelectorAll(".anneau text, .plateau-anneau text").forEach((t) => {
    const tp = t.querySelector("textPath");
    const chemin = document.getElementById(tp.getAttribute("href").slice(1));
    tp.removeAttribute("textLength");
    // Majuscules écrites en dur : le navigateur mesure mal text-transform sur un textPath
    tp.textContent = tp.textContent.toUpperCase();
    const ajuster = () => {
      const tour = chemin.getTotalLength();
      const base = parseFloat(getComputedStyle(t).fontSize);
      // getComputedTextLength ignore l'espacement des lettres : on l'ajoute
      const espace = (parseFloat(getComputedStyle(t).letterSpacing) || 0) * t.getNumberOfChars();
      const longueur = t.getComputedTextLength() + espace;
      if (longueur > 0) t.style.fontSize = `${(base * tour * 0.97) / longueur}px`;
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ajuster);
  });

  /* ---------- Menu mobile (rideau organique) ---------- */
  const bouton = document.querySelector(".menu-bouton");
  const rideau = document.getElementById("rideau");
  if (bouton && rideau) {
    const liens = rideau.querySelectorAll("a");
    const basculer = (ouvrir) => {
      bouton.setAttribute("aria-expanded", String(ouvrir));
      bouton.setAttribute("aria-label", ouvrir ? "Fermer le menu" : "Ouvrir le menu");
      rideau.classList.toggle("ouvert", ouvrir);
      doc.classList.toggle("rideau-ouvert", ouvrir);
      document.body.style.overflow = ouvrir ? "hidden" : "";
      if (ouvrir) {
        if (anime) G.fromTo(liens, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "expo.out", delay: 0.2 });
        liens[0]?.focus({ preventScroll: true });
      }
    };
    bouton.addEventListener("click", () => basculer(bouton.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && rideau.classList.contains("ouvert")) { basculer(false); bouton.focus(); }
    });
  }

  /* ---------- Transitions entre pages (voile en forme de galet) ---------- */
  const voile = document.querySelector(".voile span");
  if (voile && anime) {
    let entree = false;
    try { entree = sessionStorage.getItem("voile") === "1"; sessionStorage.removeItem("voile"); } catch (e) { /* stockage indisponible */ }
    if (entree) {
      G.fromTo(voile, { scale: 1 }, { scale: 0, duration: 0.9, ease: "expo.inOut", onComplete: () => doc.classList.remove("voile-entree") });
    } else {
      doc.classList.remove("voile-entree");
    }

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html?$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem("voile", "1"); } catch (err) { /* pas grave */ }
      G.fromTo(voile, { scale: 0 }, { scale: 1, duration: 0.65, ease: "expo.in", onComplete: () => { location.href = url.href; } });
    });
    // Retour arrière (cache du navigateur) : on enlève le voile
    window.addEventListener("pageshow", (e) => { if (e.persisted) G.set(voile, { scale: 0 }); });
  } else {
    doc.classList.remove("voile-entree");
  }

  /* ---------- Compose ton plateau ---------- */
  const compose = document.querySelector("[data-compose]");
  if (compose) {
    const statut = compose.querySelector("[data-statut]");
    const majPlateau = () => {
      let pleins = 0;
      ["entree", "plat", "dessert"].forEach((service) => {
        const choisi = compose.querySelector(`input[name="${service}"]:checked`);
        const caseSvg = compose.querySelector(`[data-case="${service}"]`);
        if (caseSvg) caseSvg.classList.toggle("plein", Boolean(choisi));
        const drapeau = compose.querySelector(`[data-drapeau-case="${service}"]`);
        if (drapeau) {
          if (choisi) drapeau.setAttribute("href", `assets/img/drapeaux/${choisi.dataset.drapeau}.svg`);
          drapeau.classList.toggle("visible", Boolean(choisi));
        }
        if (choisi) pleins += 1;
      });
      if (statut) {
        const manque = 3 - pleins;
        statut.textContent = manque === 0
          ? "Plateau complet : une entrée, un plat, un dessert. Total : 1 €."
          : `Encore ${manque} choix pour compléter ton plateau.`;
      }
    };
    compose.addEventListener("change", (e) => {
      majPlateau();
      if (anime && e.target.matches("input")) {
        G.fromTo(`[data-case="${e.target.name}"], [data-drapeau-case="${e.target.name}"]`, { scale: 0.7, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.8, ease: "expo.out" });
      }
    });
    majPlateau();
  }

  /* ---------- Compte à rebours ---------- */
  const rebours = document.querySelector("[data-rebours]");
  if (rebours) {
    const cible = new Date(rebours.dataset.rebours).getTime();
    const champs = {
      j: rebours.querySelector("[data-j]"),
      h: rebours.querySelector("[data-h]"),
      m: rebours.querySelector("[data-m]"),
      s: rebours.querySelector("[data-s]"),
      unite: rebours.querySelector("[data-unite]"),
    };
    const deux = (n) => String(n).padStart(2, "0");
    const tic = () => {
      const reste = cible - Date.now();
      if (reste <= 0) {
        champs.j.textContent = "0";
        if (champs.unite) champs.unite.textContent = "le jour est arrivé";
        return false;
      }
      const j = Math.floor(reste / 864e5);
      champs.j.textContent = j;
      if (champs.unite) champs.unite.textContent = j > 1 ? "jours avant le repas" : "jour avant le repas";
      champs.h.textContent = deux(Math.floor((reste / 36e5) % 24));
      champs.m.textContent = deux(Math.floor((reste / 6e4) % 60));
      champs.s.textContent = deux(Math.floor((reste / 1e3) % 60));
      return true;
    };
    if (tic()) {
      const id = setInterval(() => { if (!tic()) clearInterval(id); }, 1000);
    }
  }

  /* ---------- Cartes du menu : retourner ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".plat-retourner");
    if (!b) return;
    const plat = b.closest(".plat");
    const retourne = plat.classList.toggle("retourne");
    const [face, dos] = plat.querySelectorAll(".plat-face");
    face.inert = retourne;
    dos.inert = !retourne;
    (retourne ? dos : face).querySelector(".plat-retourner")?.focus({ preventScroll: true });
  });

  /* ---------- Chemin des étapes : tracé courbe entre les jalons ---------- */
  const chemin = document.querySelector("[data-chemin]");
  const tracerChemin = () => {
    if (!chemin) return null;
    const svg = chemin.querySelector(".chemin-trace");
    const ronds = [...chemin.querySelectorAll(".rond")];
    if (!svg || ronds.length < 2) return null;
    const base = chemin.getBoundingClientRect();
    const pts = ronds.map((r) => {
      const b = r.getBoundingClientRect();
      return [b.left - base.left + b.width / 2, b.top - base.top + b.height / 2];
    });
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const dy = (y1 - y0) * 0.55;
      d += ` C${x0},${y0 + dy} ${x1},${y1 - dy} ${x1},${y1}`;
    }
    svg.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);
    svg.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
    return svg.querySelector(".trait");
  };
  const trait = tracerChemin();
  if (trait && !anime) trait.style.display = "none";

  /* ---------- Carte des infos pratiques (MapLibre + OpenFreeMap, recolorée) ---------- */
  const carteEl = document.querySelector("[data-carte]");
  if (carteEl) {
    const CLE = "carte-acceptee";
    const bouton = carteEl.querySelector("[data-carte-charger]");
    const charger = () => {
      if (carteEl.dataset.etat) return;
      carteEl.dataset.etat = "chargement";
      if (bouton) bouton.textContent = "Chargement…";
      const lien = document.createElement("link");
      lien.rel = "stylesheet"; lien.href = "assets/css/maplibre-gl.css";
      document.head.append(lien);
      const script = document.createElement("script");
      script.src = "assets/js/vendor/maplibre-gl.js";
      script.onload = () => initCarte(carteEl, calme);
      script.onerror = () => echecCarte(carteEl);
      document.body.append(script);
      try { localStorage.setItem(CLE, "1"); } catch (e) { /* stockage indisponible */ }
    };
    bouton?.addEventListener("click", charger);
    let dejaAcceptee = false;
    try { dejaAcceptee = localStorage.getItem(CLE) === "1"; } catch (e) { /* idem */ }
    if (dejaAcceptee) charger();
  }

  /* Menu (page Le menu) : rendu à partir de assets/js/menu-data.js */
  const carte = document.getElementById("carte");
  if (window.MENU) { rendreChoix(window.MENU); rendreGrille(window.MENU); }
  if (carte && window.MENU) rendreMenu(carte, window.MENU);

  if (!anime) return;

  /* ======================================================================
     À partir d'ici : animations GSAP (ignorées si mouvement réduit)
     ====================================================================== */
  const ST = window.ScrollTrigger;

  /* Découpe en mots pour les titres [data-split] */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const mots = el.textContent.trim().split(/[ \n\t]+/); // garde les espaces insécables
    el.setAttribute("aria-label", el.textContent.trim());
    const colle = el.classList.contains("autocollant");
    el.innerHTML = mots
      .map((m) => `<span class="mot-cadre" aria-hidden="true"><span class="mot" style="display:inline-block"${colle ? ` data-t="${m}"` : ""}>${m}</span></span>`)
      .join(" ");
    if (colle) el.classList.add("est-decoupe");
    G.from(el.querySelectorAll(".mot"), {
      yPercent: 110, rotate: 6, duration: 1.1, ease: "expo.out", stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  /* Apparitions simples [data-reveal] */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    G.from(el, {
      y: 50, opacity: 0, rotate: el.dataset.reveal === "tourne" ? -4 : 0,
      duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
  document.querySelectorAll("[data-cascade]").forEach((groupe) => {
    G.from(groupe.children, {
      y: 60, opacity: 0, scale: 0.94, duration: 1, ease: "expo.out", stagger: 0.12,
      scrollTrigger: { trigger: groupe, start: "top 85%", once: true },
    });
  });

  /* ---------- Scène d'accueil ---------- */
  const scene = document.querySelector(".scene");
  if (scene) {
    const tl = G.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
    tl.from(".scene-fond .forme", { scale: 0, duration: 1.6, stagger: 0.12 })
      .from(".plateau-assiette", { scale: 0.4, rotate: -40, opacity: 0, duration: 1.4 }, 0.1)
      .from(".galet", { scale: 0, duration: 1, stagger: { each: 0.06, from: "random" }, ease: "expo.out" }, 0.5)
      .from(".prix-piece", { rotate: -200, scale: 0, duration: 1.5 }, 0.6)
      .from(".plateau-anneau", { opacity: 0, rotate: -90, duration: 1.8 }, 0.5)
      .from(".scene-etiquettes .etiquette", { y: 80, opacity: 0, rotate: () => G.utils.random(-25, 25), duration: 1.2, stagger: 0.1 }, 0.8)
      .from(".scene-h1", { y: 20, opacity: 0, duration: 1 }, 1.1);

    // Rotation continue : le plateau tourne, l'anneau de texte en sens inverse
    const boucles = [
      G.to(".plateau-galets", { rotate: 360, duration: 70, repeat: -1, ease: "none" }),
      G.to(".plateau-anneau", { rotate: -360, duration: 55, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
      G.fromTo(".prix-piece", { rotate: -7 }, { rotate: 7, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.3 }),
    ];
    ST.create({ trigger: scene, start: "top bottom", end: "bottom top", onToggle: (st) => boucles.forEach((b) => (st.isActive ? b.resume() : b.pause())) });

    // Parallaxe à la souris
    const couches = [...scene.querySelectorAll("[data-profondeur]")].map((el) => ({
      p: parseFloat(el.dataset.profondeur),
      x: G.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
      y: G.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
    }));
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) scene.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      couches.forEach((c) => { c.x(nx * c.p * 60); c.y(ny * c.p * 60); });
    });

    // En quittant la scène, le plateau s'éloigne en tournant
    G.to(".plateau", {
      scale: 0.75, rotate: 25, yPercent: 15, ease: "none",
      scrollTrigger: { trigger: scene, start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ---------- Texte qui coule le long de la vague ---------- */
  document.querySelectorAll(".vague-texte").forEach((bloc) => {
    const tp = bloc.querySelector("textPath");
    if (!tp) return;
    const etat = { o: 0 };
    const appliquer = () => tp.setAttribute("startOffset", `${etat.o}%`);
    const derive = G.to(etat, { o: -50, duration: 30, ease: "none", repeat: -1, onUpdate: appliquer });
    ST.create({ trigger: bloc, start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? derive.resume() : derive.pause()) });
    G.fromTo(bloc.querySelector(".ruban"), { strokeDasharray: "0 3000" }, {
      strokeDasharray: "3000 0", ease: "none",
      scrollTrigger: { trigger: bloc, start: "top 95%", end: "bottom 40%", scrub: true },
    });
  });

  /* ---------- Défilement horizontal du plateau à composer ---------- */
  const piste = document.querySelector(".compose-piste");
  if (piste) {
    G.matchMedia().add("(min-width: 861px)", () => {
      const distance = () => piste.scrollWidth - innerWidth;
      const tween = G.to(piste, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: ".compose", start: "top top", end: () => `+=${distance()}`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      piste.querySelectorAll(".numero").forEach((n) => {
        G.from(n, {
          yPercent: 60, rotate: -12, opacity: 0, ease: "none",
          scrollTrigger: { trigger: n.parentElement, containerAnimation: tween, start: "left 85%", end: "left 35%", scrub: true },
        });
      });
      return () => tween.scrollTrigger?.kill();
    });
  }

  /* ---------- Compte à rebours : le chiffre grimpe à l'arrivée ---------- */
  const jours = document.querySelector("[data-j]");
  if (jours) {
    ST.create({
      trigger: jours, start: "top 85%", once: true,
      onEnter: () => {
        const fin = parseInt(jours.textContent, 10) || 0;
        const o = { v: 0 };
        G.to(o, { v: fin, duration: 2, ease: "expo.out", onUpdate: () => { jours.textContent = Math.round(o.v); } });
      },
    });
  }

  /* ---------- Chemin : se dessine pendant le défilement ---------- */
  if (trait) {
    const longueur = () => trait.getTotalLength();
    G.fromTo(trait, { strokeDasharray: () => longueur(), strokeDashoffset: () => longueur() }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: chemin, start: "top 70%", end: "bottom 60%", scrub: 0.6, invalidateOnRefresh: true },
    });
    chemin.querySelectorAll("li").forEach((li, i) => {
      G.from(li, {
        x: i % 2 ? 80 : -80, opacity: 0, rotate: i % 2 ? 6 : -6, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: li, start: "top 85%", once: true },
      });
    });
    ST.addEventListener("refreshInit", tracerChemin);
  }

  /* ---------- Valeurs : les mots glissent l'un vers l'autre ---------- */
  document.querySelectorAll(".valeurs").forEach((v) => {
    const mots = v.querySelectorAll("span:not(.et)");
    G.fromTo(mots, { x: (i) => (i - 1) * 180, rotate: (i) => (i - 1) * 8 }, {
      x: 0, rotate: 0, ease: "none",
      scrollTrigger: { trigger: v, start: "top 95%", end: "center 55%", scrub: true },
    });
  });

  /* ---------- Formes de fond : légère parallaxe au défilement ---------- */
  document.querySelectorAll("[data-flotte]").forEach((el) => {
    G.to(el, {
      yPercent: parseFloat(el.dataset.flotte) || -20, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- Boutons aimantés ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".bouton").forEach((el) => {
      const x = G.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const y = G.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      const cible = el.closest(".porte") || el;
      cible.addEventListener("pointermove", (e) => {
        const b = el.getBoundingClientRect();
        x((e.clientX - b.left - b.width / 2) * 0.25);
        y((e.clientY - b.top - b.height / 2) * 0.35);
      });
      cible.addEventListener("pointerleave", () => { x(0); y(0); });
    });
  }

  /* Les polices chargées changent les hauteurs : on recalcule */
  document.fonts?.ready.then(() => ST.refresh());
})();

/* Rendu des cartes du menu, hors de la fermeture pour rester lisible.
   Les données vivent dans assets/js/menu-data.js. */
/* Accueil (« Compose ton plateau ») et page L'événement (« Le principe ») :
   les plats viennent de assets/js/menu-data.js, seul fichier à modifier. */
function echapper(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function rendreChoix(menu) {
  const SERVICES_MENU = { entree: "entrees", plat: "plats", dessert: "desserts" };
  document.querySelectorAll("fieldset.choix").forEach((fs) => {
    const service = Object.keys(SERVICES_MENU).find((s) => fs.classList.contains(`choix--${s}`));
    const plats = service && menu[SERVICES_MENU[service]];
    if (!plats || !plats.length) return;
    const legende = fs.querySelector("legend").outerHTML;
    fs.innerHTML = legende + plats.map((p, i) => {
      const id = `${service}-${i + 1}`;
      return `<input type="radio" name="${service}" id="${id}" value="${i + 1}" data-drapeau="${echapper(p.drapeau)}">` +
        `<label for="${id}"><span class="choix-visuel"><span class="choix-photo">${p.photo ? `<img src="${echapper(p.photo)}" alt="" loading="lazy">` : ""}</span>` +
        `${p.drapeau ? `<img class="choix-drapeau" src="assets/img/drapeaux/${echapper(p.drapeau)}.svg" alt="" width="32" height="32">` : ""}</span>` +
        `<span class="choix-nom">${echapper(p.nom) || "À venir"}</span><small>${echapper(p.pays)}</small></label>`;
    }).join("");
  });
}

function rendreGrille(menu) {
  const SERVICES_MENU = { entree: "entrees", plat: "plats", dessert: "desserts" };
  document.querySelectorAll(".grille-9 .g-ligne").forEach((ligne, n) => {
    const plats = menu[Object.values(SERVICES_MENU)[n]];
    const liste = ligne.querySelector(".g-plats");
    if (!plats || !liste) return;
    liste.innerHTML = plats.map((p) =>
      `<li class="g"><span class="g-photo">${p.photo ? `<img src="${echapper(p.photo)}" alt="" loading="lazy">` : ""}` +
      `${p.drapeau ? `<img class="g-drapeau" src="assets/img/drapeaux/${echapper(p.drapeau)}.svg" alt="" width="24" height="24">` : ""}</span>` +
      `<span class="g-nom">${echapper(p.nom) || "À venir"}</span><small>${echapper(p.pays)}</small></li>`).join("");
  });
}

function rendreMenu(racine, menu) {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const AV = '<span class="a-venir">À venir</span>';
  const val = (v) => (v && String(v).trim() ? esc(v) : AV);
  const services = [
    { cle: "entrees", titre: "Les entrées", classe: "entree" },
    { cle: "plats", titre: "Les plats", classe: "plat" },
    { cle: "desserts", titre: "Les desserts", classe: "dessert" },
  ];
  const regime = (oui, libelle) =>
    `<span class="regime${oui === true ? " oui" : ""}">${libelle}${oui === true ? "" : oui === false ? " : non" : " : à venir"}</span>`;

  racine.innerHTML = services.map(({ cle, titre, classe }) => {
    const plats = menu[cle] || [];
    return `
    <section class="service" aria-labelledby="titre-${cle}">
      <div class="service-titre">
        <h2 id="titre-${cle}">${titre}</h2>
        <span class="compte">${plats.length} cuisines, 1 au choix</span>
      </div>
      <div class="plats" data-cascade>
        ${plats.map((p, i) => `
        <article class="plat plat--${classe}">
          <div class="plat-interieur">
            <div class="plat-face">
              <div class="plat-visuel">
                <div class="plat-photo">${p.photo ? `<img src="${esc(p.photo)}" alt="Photo d'illustration : ${esc(p.nom)}" loading="lazy"><span class="plat-legende">Photo d'illustration</span>` : AV.replace("À venir", "Photo à venir")}</div>
                ${p.drapeau ? `<img class="plat-drapeau" src="assets/img/drapeaux/${esc(p.drapeau)}.svg" alt="" width="56" height="56">` : ""}
              </div>
              <span class="plat-pays">${p.pays ? esc(p.pays) : "Pays à venir"}</span>
              <h3>${p.nom ? esc(p.nom) : `${titre.charAt(4).toUpperCase()}${titre.slice(5, -1)} n°${i + 1}`}</h3>
              <p>${p.presentation ? esc(p.presentation) : "Présentation à venir, après le sondage et la validation avec le Crous et les chefs."}</p>
              <button class="plat-retourner" type="button">Ingrédients et allergènes <span aria-hidden="true">↻</span></button>
            </div>
            <div class="plat-face plat-face--dos" inert>
              <dl>
                <div><dt>Ingrédients</dt><dd>${val(p.ingredients)}</dd></div>
                <div><dt>Allergènes</dt><dd>${Array.isArray(p.allergenes) ? (p.allergenes.length ? esc(p.allergenes.join(", ")) : "Aucun des 14 allergènes réglementaires") : AV}</dd></div>
                <div><dt>Régimes</dt><dd class="regimes">${regime(p.vegan, "Végan")}${regime(p.vegetarien, "Végétarien")}${regime(p.sansGluten, "Sans gluten")}</dd></div>
              </dl>
              ${p.ingredients ? '<p class="plat-indicatif">Recette traditionnelle, à titre indicatif : ingrédients et allergènes confirmés avec le Crous mi-janvier 2027.</p>' : ""}
              <button class="plat-retourner" type="button"><span aria-hidden="true">↺</span> Retour</button>
            </div>
          </div>
        </article>`).join("")}
      </div>
    </section>`;
  }).join("");
}

/* Carte interactive : appelée une fois MapLibre chargé.
   Le style OpenFreeMap est recoloré aux couleurs du site. */
function echecCarte(el) {
  el.dataset.etat = "";
  const b = el.querySelector("[data-carte-charger]");
  if (b) b.textContent = "Carte indisponible, réessayer";
}

const COULEURS_CARTE = {
  fond: "#f8e9cf", residentiel: "#f1e0c4", parc: "#cdd0b4", eau: "#dadcc4",
  batiment: "#e8d5b5", rueMineure: "#fcf5e9", rueMajeure: "#fcf5e9", bordure: "#e8d8c0",
  autoroute: "#f5d496", bordureAutoroute: "#e4a788", rail: "#bdbe9b", texte: "#766357", halo: "#f8e9cf",
};

function recolorerStyle(style) {
  const C = COULEURS_CARTE;
  const peindre = (l, props) => { l.paint = { ...(l.paint || {}), ...props }; };
  style.layers = style.layers.filter((l) => !/^boundary|shield|^road_shield|aeroway|ice|glacier|^airport/.test(l.id));
  style.layers.forEach((l) => {
    const id = l.id;
    if (l.type === "background") peindre(l, { "background-color": C.fond });
    else if (id === "park" || id === "landcover_wood") peindre(l, { "fill-color": C.parc, "fill-opacity": 0.75 });
    else if (id === "water") peindre(l, { "fill-color": C.eau });
    else if (id === "waterway") peindre(l, { "line-color": C.eau });
    else if (id === "landuse_residential") peindre(l, { "fill-color": C.residentiel, "fill-opacity": 0.8 });
    else if (/casing/.test(id) && /motorway/.test(id)) peindre(l, { "line-color": C.bordureAutoroute });
    else if (/motorway/.test(id)) peindre(l, { "line-color": C.autoroute });
    else if (/casing/.test(id)) peindre(l, { "line-color": C.bordure });
    else if (/^highway|road_pier/.test(id) && l.type === "line") peindre(l, { "line-color": /major/.test(id) ? C.rueMajeure : C.rueMineure });
    else if (/^railway/.test(id)) peindre(l, { "line-color": C.rail });
    else if (l.type === "symbol") peindre(l, { "text-color": C.texte, "text-halo-color": C.halo, "text-halo-width": 1.6 });
  });
  // Bâtiments en relief, couleur argile
  const iBat = style.layers.findIndex((l) => l.id === "building");
  if (iBat > -1) {
    style.layers[iBat] = {
      id: "batiments-3d", type: "fill-extrusion", source: "openmaptiles", "source-layer": "building", minzoom: 14,
      paint: {
        "fill-extrusion-color": C.batiment,
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.92,
      },
    };
  }
  return style;
}

async function initCarte(el, calme) {
  const ml = window.maplibregl;
  if (!ml) return echecCarte(el);
  let style;
  try {
    const rep = await fetch("https://tiles.openfreemap.org/styles/positron");
    if (!rep.ok) throw new Error(rep.status);
    style = recolorerStyle(await rep.json());
  } catch (e) { return echecCarte(el); }

  const lieu = [parseFloat(el.dataset.lon), parseFloat(el.dataset.lat)];
  const arret = [parseFloat(el.dataset.arretLon), parseFloat(el.dataset.arretLat)];
  const carte = new ml.Map({
    container: el.querySelector(".carte-leaflet"),
    style,
    center: lieu, zoom: 14.6,
    cooperativeGestures: true,
    attributionControl: { compact: true },
    locale: {
      "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer sur la carte",
      "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer sur la carte",
      "CooperativeGesturesHandler.MobileHelpText": "Utilise deux doigts pour déplacer la carte",
      "NavigationControl.ZoomIn": "Zoomer", "NavigationControl.ZoomOut": "Dézoomer",
    },
  });
  carte.addControl(new ml.NavigationControl({ showCompass: false }), "top-left");

  const repere = (classe, texte) => {
    const n = document.createElement("div");
    n.className = `pin ${classe}`;
    n.innerHTML = `<span class="pin-onde"></span><span class="pin-forme"></span><span class="pin-etiquette">${texte}</span>`;
    return n;
  };
  new ml.Marker({ element: repere("pin--lieu", el.dataset.etiquette || "Le lieu"), anchor: "bottom" }).setLngLat(lieu).addTo(carte);
  new ml.Marker({ element: repere("pin--arret", "Arrêt Constellations / IUT"), anchor: "center" }).setLngLat(arret).addTo(carte);

  carte.once("load", () => {
    el.classList.add("chargee");
    el.dataset.etat = "ok";
    // Petite arrivée en vol, sauf si l'utilisateur préfère moins d'animations
    // Sur petit écran, on décale la vue pour laisser la place à l'étiquette de l'arrêt
    const etroit = el.clientWidth < 600;
    const vue = { center: [(lieu[0] + arret[0]) / 2, (lieu[1] + arret[1]) / 2], zoom: etroit ? 16.9 : 16.4, pitch: 45, bearing: -18, offset: etroit ? [0, -10] : [0, 0] };
    if (calme) carte.jumpTo(vue);
    else carte.flyTo({ ...vue, duration: 2600, essential: false });
  });
  carte.on("error", (e) => { if (!el.classList.contains("chargee")) console.warn("Carte :", e.error?.message); });
}
