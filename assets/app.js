/* FORMIDABLE — panier, catalogue et commande WhatsApp (aucun compte requis) */
(function(){
  const F = window.FORMIDABLE; if(!F) return;
  const P = F.produits;
  const CAT = {classic:"FORMIDABLE Classic", shamballa:"FORMIDABLE Shamballa", stones:"FORMIDABLE Stones", duo:"FORMIDABLE Duo"};
  const DISPO = {"en-stock":"En stock","sur-commande":"Sur commande","epuise":"Épuisé"};
  const racine = document.body.dataset.racine || "/";
  const img = f => racine + "assets/img/" + f;
  const fcfa = n => n.toLocaleString("fr-FR").replace(/ | /g," ") + " F CFA";
  const $ = (s,c=document) => c.querySelector(s), $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M12 11v5M9.5 13.5h5"/></svg>';
  const ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.5-.7-4-3.5-4.1-3.7-1-1.3-1-2.5.6-1.8.9-2 .5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.5-.4.4c-.1.2-.3.3-.1.6s.7 1.2 1.6 2a7 7 0 0 0 2.2 1.4c.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.3s0 .7-.2 1.3z"/></svg>';

  /* ---------- panier (mémorisé sur l'appareil) ---------- */
  let panier = [];
  try { panier = JSON.parse(localStorage.getItem("formidable-panier") || "[]"); } catch(e){ panier = []; }
  const sauver = () => { try { localStorage.setItem("formidable-panier", JSON.stringify(panier)); } catch(e){} majPanier(); };
  const cle = l => l.id + "|" + (l.options||"");
  function ajouter(id, qte=1, options=""){
    const p = P.find(x=>x.id===id); if(!p || p.stock==="epuise") return;
    const l = panier.find(x=>cle(x)===id+"|"+options);
    if(l) l.qte += qte; else panier.push({id, qte, options});
    sauver(); toast(p.nom + " ajouté au panier");
  }
  function toast(t){ let el=$(".toast"); if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el)} el.textContent=t; el.classList.add("on"); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove("on"),2200); }
  function lienWA(texte){ return "https://wa.me/" + F.whatsapp + "?text=" + encodeURIComponent(texte); }
  function messagePanier(){
    let total = 0, lignes = panier.map(l=>{ const p=P.find(x=>x.id===l.id); if(!p) return ""; total += p.prix*l.qte;
      return "• " + p.nom + (l.options? " ("+l.options+")":"") + " × " + l.qte + " — " + fcfa(p.prix*l.qte); }).filter(Boolean);
    return "Bonjour FORMIDABLE, je souhaite commander :\n" + lignes.join("\n") + "\n\nTotal : " + fcfa(total) +
      "\n\nNom :\nQuartier / ville :\nLivraison ou retrait :";
  }
  function majPanier(){
    const n = panier.reduce((a,l)=>a+l.qte,0);
    $$(".compteur").forEach(c=>{c.textContent=n||"";c.dataset.n=n});
    const liste = $("#panierListe"); if(!liste) return;
    if(!panier.length){ liste.innerHTML = '<p class="vide" style="margin-top:20px">Votre panier est vide.<br><a href="'+racine+'boutique/">Voir la collection</a></p>'; }
    else liste.innerHTML = panier.map((l,i)=>{ const p=P.find(x=>x.id===l.id); if(!p) return "";
      return `<div class="ligne-p"><img src="${img(p.photos[0])}" alt=""><div><b>${esc(p.nom)}</b>${l.options?`<small>${esc(l.options)}</small>`:""}<small>${fcfa(p.prix)}</small>
      <div class="q"><button type="button" data-moins="${i}" aria-label="Retirer un">−</button><span>${l.qte}</span><button type="button" data-plus="${i}" aria-label="Ajouter un">+</button></div></div>
      <button type="button" class="suppr" data-suppr="${i}">Retirer</button></div>`; }).join("");
    const total = panier.reduce((a,l)=>{const p=P.find(x=>x.id===l.id);return a+(p?p.prix*l.qte:0)},0);
    $("#panierTotal").textContent = fcfa(total);
    const b = $("#panierCommander"); b.href = lienWA(messagePanier()); b.toggleAttribute("disabled", !panier.length);
    if(!panier.length) b.setAttribute("aria-disabled","true"); else b.removeAttribute("aria-disabled");
  }
  function ouvrirPanier(o){ $(".panier").classList.toggle("ouvert",o); $(".voile").classList.toggle("ouvert",o); $(".panier").setAttribute("aria-hidden",!o); if(o) $(".panier .icone").focus(); }
  document.addEventListener("click", e=>{
    const t = e.target.closest("[data-ajout],[data-moins],[data-plus],[data-suppr],[data-panier],.voile,#fermerPanier,#menuBtn");
    if(!t) return;
    if(t.dataset.ajout){ e.preventDefault(); const p=P.find(x=>x.id===t.dataset.ajout); if(p && (p.initiales || p.composition)){ location.href = racine+"produit/?m="+p.id; return; } ajouter(t.dataset.ajout); }
    else if(t.dataset.moins!==undefined){ const l=panier[+t.dataset.moins]; l.qte--; if(l.qte<1) panier.splice(+t.dataset.moins,1); sauver(); }
    else if(t.dataset.plus!==undefined){ panier[+t.dataset.plus].qte++; sauver(); }
    else if(t.dataset.suppr!==undefined){ panier.splice(+t.dataset.suppr,1); sauver(); }
    else if(t.dataset.panier!==undefined){ ouvrirPanier(true); }
    else if(t.classList.contains("voile") || t.id==="fermerPanier"){ ouvrirPanier(false); }
    else if(t.id==="menuBtn"){ const n=$(".nav"); const o=!n.classList.contains("ouvert"); n.classList.toggle("ouvert",o); t.setAttribute("aria-expanded",o); }
  });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") ouvrirPanier(false); });

  /* ---------- cartes ---------- */
  function carte(p){
    return `<article class="carte"><a class="photo" href="${racine}produit/?m=${p.id}"><img src="${img(p.photos[0])}" alt="${esc(p.nom)}" loading="lazy" width="900" height="1125">${p.badge?`<span class="badge${p.categorie==='stones'?' olive':''}">${esc(p.badge)}</span>`:""}</a>
      <h3><a href="${racine}produit/?m=${p.id}">${esc(p.nom)}</a></h3><p class="court">${esc(p.court)}</p>
      <div class="bas"><div><span class="prix">${fcfa(p.prix)}</span><div class="dispo ${p.stock}">${DISPO[p.stock]||""}</div></div>
      <button class="ajout" type="button" data-ajout="${p.id}" aria-label="Ajouter ${esc(p.nom)} au panier" ${p.stock==="epuise"?"disabled":""}>${ICON_PLUS}</button></div></article>`;
  }
  const pop = $("#populaires"); if(pop) pop.innerHTML = P.filter(p=>p.populaire).slice(0,4).map(carte).join("");

  /* ---------- boutique + filtres ---------- */
  const grille = $("#catalogue");
  if(grille){
    const q = new URLSearchParams(location.search); let cat = q.get("cat") || "tout";
    const f = { cat, couleur:"tout", prix:"tout", dispo:"tout", tri:"defaut" };
    function rendre(){
      let l = P.filter(p => (f.cat==="tout"||p.categorie===f.cat) && (f.couleur==="tout"||p.couleur===f.couleur) && (f.prix==="tout"||p.prix<=+f.prix) && (f.dispo==="tout"||p.stock==="en-stock"));
      if(f.tri==="asc") l.sort((a,b)=>a.prix-b.prix); if(f.tri==="desc") l.sort((a,b)=>b.prix-a.prix);
      grille.innerHTML = l.length ? l.map(carte).join("") : '<p class="vide" style="grid-column:1/-1">Aucun bracelet ne correspond à ces filtres.</p>';
      $$("[data-cat]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.cat===f.cat));
      const t=$("#titreCat"); if(t) t.textContent = f.cat==="tout" ? "Toute la collection" : CAT[f.cat];
    }
    $$("[data-cat]").forEach(b=>b.addEventListener("click",()=>{ f.cat=b.dataset.cat; const u=new URL(location); f.cat==="tout"?u.searchParams.delete("cat"):u.searchParams.set("cat",f.cat); history.replaceState(null,"",u); rendre(); }));
    [["fCouleur","couleur"],["fPrix","prix"],["fDispo","dispo"],["fTri","tri"]].forEach(([id,k])=>{ const s=$("#"+id); if(s) s.addEventListener("change",()=>{f[k]=s.value;rendre()}); });
    rendre();
  }

  /* ---------- fiche produit ---------- */
  const fiche = $("#fiche");
  if(fiche){
    const id = new URLSearchParams(location.search).get("m"); const p = P.find(x=>x.id===id) || P[0];
    document.title = p.nom + " — " + fcfa(p.prix) + " | FORMIDABLE";
    const md = document.querySelector('meta[name="description"]'); if(md) md.setAttribute("content", p.court + " " + fcfa(p.prix) + ". Commande sur WhatsApp, livraison au Bénin.");
    const lettres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const sel = n => `<select id="ini${n}" aria-label="Initiale ${n}">${lettres.map(l=>`<option>${l}</option>`).join("")}</select>`;
    fiche.innerHTML = `
      <div class="galerie"><div class="principale"><img id="photoP" src="${img(p.photos[0])}" alt="${esc(p.nom)}" width="900" height="1125"></div>
        ${p.photos.length>1?`<div class="vignettes">${p.photos.map((ph,i)=>`<button type="button" data-ph="${ph}" aria-current="${i===0}" aria-label="Photo ${i+1}"><img src="${img(ph)}" alt=""></button>`).join("")}</div>`:""}</div>
      <div class="infos-p">
        <p class="eyebrow">${CAT[p.categorie]}</p>
        <h1 style="margin-top:8px">${esc(p.nom)}</h1>
        <span class="prix">${fcfa(p.prix)}</span>
        <div class="dispo ${p.stock}" style="font-size:14px;margin-top:6px">● ${DISPO[p.stock]}</div>
        <p class="desc">${esc(p.description)}</p>
        ${p.initiales?`<div class="champ"><span class="lbl">${p.initiales>1?"Vos deux initiales":"Votre initiale"}</span><div class="choix-lettres">${sel(1)}${p.initiales>1?sel(2):""}</div></div>`:""}
        ${p.composition?`<div class="champ"><label for="compo">Composition du duo</label><select id="compo">${p.composition.map(c=>`<option>${esc(c)}</option>`).join("")}</select></div>`:""}
        <div class="champ"><span class="lbl">Taille</span><p>Ajustable grâce au nœud coulissant.</p></div>
        <div class="champ"><span class="lbl">Quantité</span><div class="qte"><button type="button" id="qMoins" aria-label="Moins">−</button><output id="qVal">1</output><button type="button" id="qPlus" aria-label="Plus">+</button></div></div>
        <div class="actions-fiche">
          <a class="btn wa" id="cmdWA" href="#" target="_blank" rel="noopener">${ICON_WA} Commander sur WhatsApp</a>
          <button class="btn" type="button" id="ajoutP" ${p.stock==="epuise"?"disabled":""}>Ajouter au panier</button>
          ${p.chariow && F.chariowDomaine?`<button class="btn bronze js-pay" type="button">Payer en ligne (Mobile Money / carte)</button>`:""}
        </div>
        <dl class="matieres">${p.matieres.map(m=>`<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join("")}<div><dt>Couleur</dt><dd>${p.couleur==="noir"?"Noir":"Marron miel"}</dd></div></dl>
        <p class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h13l5 5v5h-3"/><path d="M3 7v10h2"/><circle cx="8" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><path d="M10 17h6"/></svg> Livraison au Bénin. Frais et délai confirmés sur WhatsApp avant validation de votre commande.</p>
      </div>`;
    const fil=$("#filNom"); if(fil) fil.textContent=p.nom;
    let qte=1; const opt=()=>{ const o=[]; if(p.initiales){ o.push((p.initiales>1?"initiales ":"initiale ")+[1,2].slice(0,p.initiales).map(n=>$("#ini"+n).value).join(" + ")); } if(p.composition) o.push($("#compo").value); return o.join(", "); };
    const majWA=()=>{ $("#qVal").textContent=qte; $("#cmdWA").href = lienWA("Bonjour FORMIDABLE, je souhaite commander :\n• "+p.nom+(opt()?" ("+opt()+")":"")+" × "+qte+" — "+fcfa(p.prix*qte)+"\n\nNom :\nQuartier / ville :\nLivraison ou retrait :"); };
    $("#qMoins").onclick=()=>{qte=Math.max(1,qte-1);majWA()}; $("#qPlus").onclick=()=>{qte=Math.min(20,qte+1);majWA()};
    $$("select",fiche).forEach(s=>s.addEventListener("change",majWA));
    $("#ajoutP").onclick=()=>{ ajouter(p.id,qte,opt()); };
    $$("[data-ph]").forEach(b=>b.onclick=()=>{ $("#photoP").src=img(b.dataset.ph); $$("[data-ph]").forEach(x=>x.setAttribute("aria-current",x===b)); });
    majWA();
    const autres=$("#autres"); if(autres) autres.innerHTML=P.filter(x=>x.id!==p.id).slice(0,4).map(carte).join("");
    if(p.chariow && F.chariowDomaine){
      const w=document.createElement("div"); w.className="sr"; w.innerHTML=`<div id="chariow-widget" data-product-id="${p.chariow}" data-store-domain="${F.chariowDomaine}" data-style="tap" data-locale="fr" data-primary-color="#302B26" data-background-color="#F1ECE3"></div>`; document.body.appendChild(w);
      const s=document.createElement("script"); s.src="https://js.chariowcdn.com/v1/widget.min.js"; s.async=true; document.head.appendChild(s);
      const l=document.createElement("link"); l.rel="stylesheet"; l.href="https://js.chariowcdn.com/v1/widget.min.css"; document.head.appendChild(l);
      document.addEventListener("click",e=>{ if(!e.target.closest(".js-pay")) return; const r=document.querySelector("#chariow-widget button, #chariow-widget a"); if(!r) return; e.preventDefault(); setTimeout(()=>r.click(),30); });
    }
  }

  /* liens WhatsApp génériques */
  $$("[data-wa]").forEach(a=>a.href=lienWA(a.dataset.wa||"Bonjour FORMIDABLE, je souhaite des informations sur vos bracelets."));
  $$("[data-wa-num]").forEach(e=>e.textContent=F.whatsappAffiche);
  majPanier();
})();
