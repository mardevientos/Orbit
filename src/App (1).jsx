import { useState, useEffect, useRef } from "react";

/* ── PALETTE VIVACE ── */
const GRADIENTS=["#F4A7B9","#F28B82","#E05C5C","#C0392B","#FFCBA4","#F4A261","#E8874A","#D4622A","#FFF176","#F9C74F","#F4B400","#E09B00","#CCFF90","#B5E48C","#8BC34A","#558B2F","#A5D6A7","#52C77A","#2E9B5A","#1B5E20","#B2EBF2","#48CAE4","#00ACC1","#006064","#B3D9FF","#74B3E8","#2196F3","#0D47A1","#C5CAE9","#748FEB","#3F51B5","#1A237E","#D1C4E9","#A78BFA","#7C3AED","#4A148C","#F3E5F5","#C77DFF","#AB47BC","#6A1B9A","#FCE4EC","#F472B6","#E91E8C","#880E4F"];


const CAT_COLORS = {
  "Cucina":"#FF6B35","Viaggi":"#00B4D8","Fotografia":"#9B5DE5",
  "Videomaker":"#7B2D8B","Moda":"#F15BB5","Fitness":"#00F5D4",
  "Musica":"#FEE440","Arte":"#FF99C8","Tecnologia":"#4CC9F0",
  "Scienza":"#4361EE","Geopolitica":"#E63946","Storia":"#A8763E",
  "Divulgazione":"#06D6A0","Nutrizione":"#80B918","Giardino":"#55A630",
  "Social Media":"#FB5607","Giornalismo":"#C77DFF","Argentina":"#74B3CE",
  "Italiano":"#E8A838","Spagnolo":"#D62828","Latino":"#F4A261",
  "Glamour":"#FF99C8","Cinema":"#FFBE0B","Sport":"#3A86FF",
};
function getCatColor(c){
  if(CAT_COLORS[c]) return CAT_COLORS[c];
  // Per categorie nuove usa la palette completa ciclicamente
  const FULL_PALETTE=[
    "#F28B82","#E05C5C","#C0392B",
    "#FFCBA4","#F4A261","#E8874A",
    "#FFF176","#F9C74F","#F4B400",
    "#CCFF90","#B5E48C","#8BC34A",
    "#A5D6A7","#52C77A","#2E9B5A",
    "#B2EBF2","#48CAE4","#00ACC1",
    "#B3D9FF","#74B3E8","#2196F3",
    "#C5CAE9","#748FEB","#3F51B5",
    "#D1C4E9","#A78BFA","#7C3AED",
    "#F3E5F5","#C77DFF","#AB47BC",
    "#FCE4EC","#F472B6","#E91E8C",
    "#F4A7B9","#FFF9C4","#DCEDC8",
  ];
  let h=0; for(let i=0;i<c.length;i++) h=(h*31+c.charCodeAt(i))>>>0;
  return FULL_PALETTE[h%FULL_PALETTE.length];
}
function getCatBg(cat){ return getCatColor(cat)+"18"; }
function getCatBorder(cat){ return getCatColor(cat)+"40"; }

function getGradient(str=""){
  let h=0; for(let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))>>>0;
  return GRADIENTS[h%GRADIENTS.length];
}

const PLATFORM_COLORS={instagram:"#E1306C",tiktok:"#010101",youtube:"#FF0000",twitter:"#1DA1F2",facebook:"#1877F2",pinterest:"#E60023",linkedin:"#0A66C2",altro:"#888"};
const PLATFORM_LABELS={instagram:"IG",tiktok:"TK",youtube:"YT",twitter:"TW",facebook:"FB",pinterest:"PI",linkedin:"LI",altro:"??"};

const C={
  bg:"#0D0D0D", card:"#1A1A1A", text:"#FFFFFF", muted:"#888",
  border:"#2A2A2A", overlay:"rgba(0,0,0,0.75)", accent:"#FFFFFF",
};

function detectPlatform(url=""){
  if(url.includes("instagram")) return "instagram";
  if(url.includes("tiktok"))    return "tiktok";
  if(url.includes("youtube"))   return "youtube";
  if(url.includes("twitter")||url.includes("x.com")) return "twitter";
  if(url.includes("facebook"))  return "facebook";
  if(url.includes("pinterest")) return "pinterest";
  if(url.includes("linkedin"))  return "linkedin";
  return "altro";
}

function Spinner({dark}){
  return <span style={{width:16,height:16,border:`2px solid ${dark?"rgba(0,0,0,.2)":"rgba(255,255,255,.3)"}`,borderTopColor:dark?"#000":"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>;
}

const DEFAULT_CATS=["Cucina","Viaggi","Fotografia","Videomaker","Moda","Fitness","Musica","Arte","Tecnologia","Scienza","Geopolitica","Storia","Divulgazione","Nutrizione","Giardino","Social Media","Giornalismo","Argentina","Italiano","Spagnolo","Latino","Glamour","Cinema","Sport"];

function formatFollowers(n){
  if(!n) return null;
  if(n>=1000000) return (n/1000000).toFixed(1).replace(".0","")+"M";
  if(n>=1000) return (n/1000).toFixed(1).replace(".0","")+"K";
  return n.toString();
}

const DEMO=[
  {id:1,url:"https://www.instagram.com/joaquinsanchezm",platform:"instagram",name:"Joaquín Sánchez M.",username:"@joaquinsanchezm",bio:"Giornalista internazionale, geopolitica e attualità",categories:["Giornalismo","Geopolitica"],notes:"Ottimo per news latam",photo:null,followers:48000,date:"2025-03-01"},
  {id:2,url:"https://www.tiktok.com/@eltanoandrea",platform:"tiktok",name:"El Tano Andrea",username:"@eltanoandrea",bio:"Italiano in Argentina, vita quotidiana e cultura",categories:["Argentina","Italiano"],notes:"",photo:null,followers:125000,date:"2025-03-05"},
  {id:3,url:"https://www.tiktok.com/@vovatestardi",platform:"tiktok",name:"Vova Testardi",username:"@vovatestardi",bio:"Cucina italiana e lifestyle glamour",categories:["Cucina","Glamour"],notes:"Ricette veloci",photo:null,followers:890000,date:"2025-03-08"},
  {id:4,url:"https://www.tiktok.com/@yur2i",platform:"tiktok",name:"Yuri",username:"@yur2i",bio:"Fotografo e videomaker freelance",categories:["Fotografia","Videomaker"],notes:"",photo:null,followers:32000,date:"2025-03-10"},
  {id:5,url:"https://www.instagram.com/enteoriaok/",platform:"instagram",name:"En Teoría OK",username:"@enteoriaok",bio:"Divulgazione scientifica in spagnolo",categories:["Divulgazione","Scienza","Argentina"],notes:"",photo:null,followers:210000,date:"2025-03-11"},
  {id:6,url:"https://www.tiktok.com/@dr.tizianoscarparo",platform:"tiktok",name:"Dr. Tiziano Scarparo",username:"@dr.tizianoscarparo",bio:"Nutrizionista, consigli di alimentazione sana",categories:["Nutrizione"],notes:"",photo:null,followers:1400000,date:"2025-03-12"},
  {id:7,url:"https://www.instagram.com/doc.verde",platform:"instagram",name:"Doc Verde",username:"@doc.verde",bio:"Giardinaggio urbano e cura delle piante",categories:["Giardino"],notes:"",photo:null,followers:67000,date:"2025-03-13"},
  {id:8,url:"https://www.instagram.com/brihistorica_/",platform:"instagram",name:"Bri Histórica",username:"@brihistorica_",bio:"Storia e curiosità storiche",categories:["Storia"],notes:"",photo:null,followers:345000,date:"2025-03-14"},
  {id:9,url:"https://www.tiktok.com/@elisa_aisocialstrategist",platform:"tiktok",name:"Elisa AI",username:"@elisa_aisocialstrategist",bio:"Social media strategy e AI per creator",categories:["Social Media"],notes:"",photo:null,followers:28000,date:"2025-03-15"},
];

/* ════════════════════════════════════════════════════════ */
export default function Orbit(){
  const [profiles,    setProfiles]   = useState([]);
  const [ready,       setReady]      = useState(false);
  const [tab,         setTab]        = useState("grid");
  const [selected,    setSelected]   = useState(null);
  const [search,      setSearch]     = useState("");
  const [filterCat,   setFilterCat]  = useState("Tutte");
  const [sortBy,      setSortBy]      = useState("date");
  const [toast,       setToast]      = useState(null);
  const [importUrl,   setImportUrl]  = useState("");
  const [importing,   setImporting]  = useState(false);
  const [categories,  setCategories] = useState(DEFAULT_CATS);
  const [newCat,      setNewCat]     = useState("");
  const [editModal,   setEditModal]  = useState(null);
  const [showImport,  setShowImport] = useState(false);
  const photoRef = useRef(null);
  const editPhotoRef = useRef(null);

  useEffect(()=>{
    try{
      const p=localStorage.getItem("orbit:profiles");
      const c=localStorage.getItem("orbit:categories");
      setProfiles(p?JSON.parse(p):DEMO);
      setCategories(c?JSON.parse(c):DEFAULT_CATS);
    }catch{ setProfiles(DEMO); }
    setReady(true);
  },[]);
  useEffect(()=>{ if(ready) localStorage.setItem("orbit:profiles",JSON.stringify(profiles)); },[profiles,ready]);
  useEffect(()=>{ if(ready) localStorage.setItem("orbit:categories",JSON.stringify(categories)); },[categories,ready]);

  const showToast=(msg,err=false)=>{ setToast({msg,err}); setTimeout(()=>setToast(null),3000); };

  const filtered=[...profiles].filter(p=>{
    const q=search.trim().toLowerCase();
    const mQ=!q||p.name.toLowerCase().includes(q)||(p.username||"").toLowerCase().includes(q)||(p.bio||"").toLowerCase().includes(q)||p.categories.some(c=>c.toLowerCase().includes(q));
    const mC=filterCat==="Tutte"||p.categories.includes(filterCat);
    return mQ&&mC;
  }).sort((a,b)=>{
    if(sortBy==="followers") return (b.followers||0)-(a.followers||0);
    if(sortBy==="name") return a.name.localeCompare(b.name);
    return new Date(b.date)-new Date(a.date);
  });

  const catCounts={};
  profiles.forEach(p=>p.categories.forEach(c=>{ catCounts[c]=(catCounts[c]||0)+1; }));

  /* ── Import con AI ── */
  async function importProfile(){
    if(!importUrl.trim()) return;
    setImporting(true);
    try{
      const platform=detectPlatform(importUrl);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,
          system:`Analizza profili social. Dall'URL estrai info. Rispondi SOLO con JSON valido:
{"name":"...","username":"@...","bio":"max 100 caratteri descrizione","suggestedCategories":["cat1","cat2"],"followers":50000}
- followers: stima approssimativa del numero di follower basandoti sul profilo (numero intero)
Categorie disponibili: ${categories.join(", ")}`,
          messages:[{role:"user",content:`Profilo: ${importUrl}`}]})});
      const d=await res.json();
      const parsed=JSON.parse((d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
      const prof={id:Date.now(),url:importUrl,platform,
        name:parsed.name||parsed.username||"Nuovo profilo",
        username:parsed.username||"",bio:parsed.bio||"",
        categories:parsed.suggestedCategories||[],
        followers:parsed.followers||0,
        notes:"",photo:null,date:new Date().toISOString().split("T")[0]};
      setImportUrl("");
      setShowImport(false);
      setEditModal(prof);
    }catch{ showToast("❌ Errore. Riprova.",true); }
    setImporting(false);
  }

  function saveProfile(prof){
    if(profiles.find(p=>p.id===prof.id)){
      setProfiles(prev=>prev.map(p=>p.id===prof.id?prof:p));
      setSelected(prof);
    } else {
      setProfiles(prev=>[prof,...prev]);
    }
    setEditModal(null);
    showToast("✅ Profilo salvato!");
  }

  function deleteProfile(id){
    setProfiles(prev=>prev.filter(p=>p.id!==id));
    setSelected(null);
    setTab("grid");
    showToast("Profilo eliminato");
  }

  function toggleCat(prof,cat){
    const has=prof.categories.includes(cat);
    return {...prof,categories:has?prof.categories.filter(c=>c!==cat):[...prof.categories,cat]};
  }

  function handlePhoto(e,forEdit){
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const url=ev.target.result;
      if(forEdit){ setEditModal(p=>({...p,photo:url})); }
      else if(selected){
        const updated={...selected,photo:url};
        setProfiles(prev=>prev.map(p=>p.id===selected.id?updated:p));
        setSelected(updated);
        showToast("📸 Foto aggiornata!");
      }
    };
    reader.readAsDataURL(file);
  }

  async function doShare(prof){
    const text=`${prof.name}\n${prof.username}\n${prof.url}\n${prof.bio}\n${prof.categories.join(", ")}`;
    if(navigator.share){ try{ await navigator.share({title:prof.name,text}); return; }catch(e){ if(e.name==="AbortError") return; } }
    try{ await navigator.clipboard.writeText(text); }catch{}
    showToast("📋 Copiato!");
  }

  /* ── Avatar / Foto ── */
  function ProfilePhoto({prof,size=60,fontSize=22}){
    if(prof.photo) return <img src={prof.photo} alt={prof.name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>;
    const initials=(prof.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const grad=getGradient(prof.name+prof.username);
    return(
      <div style={{width:size,height:size,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize,fontWeight:700,color:"#fff",flexShrink:0,letterSpacing:-0.5}}>
        {initials}
      </div>
    );
  }

  if(!ready) return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:36,fontWeight:800,color:"#fff",letterSpacing:-1}}>Orbit 🪐</div>
      <Spinner/>
    </div>
  );

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:C.text,position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:0}
        input,textarea,select,button{font-family:'DM Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tap:active{transform:scale(.95);transition:transform .1s}
      `}</style>

      {/* INPUT FILE */}
      <input ref={photoRef}     type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhoto(e,false)}/>
      <input ref={editPhotoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhoto(e,true)}/>

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:toast.err?"#EF4444":"#fff",color:toast.err?"#fff":"#000",padding:"10px 18px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",animation:"fadeUp .3s",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
          {toast.msg}
        </div>
      )}

      {/* MODAL IMPORT */}
      {showImport&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:700,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowImport(false)}>
          <div style={{background:"#1A1A1A",borderRadius:"24px 24px 0 0",width:"100%",padding:24,animation:"fadeUp .25s"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:18,fontWeight:700,marginBottom:16}}>Aggiungi profilo 🪐</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={importUrl} onChange={e=>setImportUrl(e.target.value)}
                placeholder="Link profilo (IG, TikTok, YouTube...)"
                style={{flex:1,background:"#2A2A2A",border:"1.5px solid #333",borderRadius:12,padding:"12px 14px",fontSize:14,color:"#fff",outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&importProfile()}
                autoFocus/>
              <button onClick={importProfile} disabled={importing}
                style={{background:"#fff",color:"#000",border:"none",borderRadius:12,padding:"12px 18px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                {importing?<Spinner dark/>:"Aggiungi"}
              </button>
            </div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>
              L'AI legge automaticamente nome, username e suggerisce le categorie.
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT/NUOVO PROFILO */}
      {editModal&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:800,display:"flex",alignItems:"flex-end",overflowY:"auto"}}>
          <div style={{background:"#1A1A1A",borderRadius:"24px 24px 0 0",width:"100%",padding:24,maxHeight:"92vh",overflowY:"auto",animation:"fadeUp .25s"}}>

            {/* Avatar + foto */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div style={{position:"relative"}} onClick={()=>editPhotoRef.current?.click()}>
                {editModal.photo
                  ? <img src={editModal.photo} alt="" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover"}}/>
                  : <div style={{width:64,height:64,borderRadius:"50%",background:getGradient(editModal.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#fff"}}>
                      {(editModal.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
                    </div>
                }
                <div style={{position:"absolute",bottom:0,right:0,background:"#fff",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer"}}>📷</div>
              </div>
              <div style={{flex:1}}>
                <input value={editModal.name} onChange={e=>setEditModal(p=>({...p,name:e.target.value}))}
                  placeholder="Nome..."
                  style={{width:"100%",background:"#2A2A2A",border:"1.5px solid #333",borderRadius:10,padding:"9px 12px",fontSize:15,fontWeight:600,color:"#fff",outline:"none",marginBottom:6}}/>
                <input value={editModal.username} onChange={e=>setEditModal(p=>({...p,username:e.target.value}))}
                  placeholder="@username..."
                  style={{width:"100%",background:"#2A2A2A",border:"1.5px solid #333",borderRadius:10,padding:"8px 12px",fontSize:13,color:C.muted,outline:"none"}}/>
              </div>
            </div>

            {/* Followers */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>👥 Follower stimati dall'AI</div>
              <input type="number" value={editModal.followers||""} onChange={e=>setEditModal(p=>({...p,followers:Number(e.target.value)}))}
                placeholder="es. 50000"
                style={{width:"100%",background:"#2A2A2A",border:"1.5px solid #333",borderRadius:12,padding:"10px 12px",fontSize:13,color:"#fff",outline:"none"}}/>
            </div>

            {/* Bio */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Bio</div>
              <textarea value={editModal.bio} onChange={e=>setEditModal(p=>({...p,bio:e.target.value}))}
                rows={2} placeholder="Descrizione breve..."
                style={{width:"100%",background:"#2A2A2A",border:"1.5px solid #333",borderRadius:12,padding:"10px 12px",fontSize:13,color:"#fff",outline:"none",resize:"none"}}/>
            </div>

            {/* Categorie */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>
                Categorie {editModal.categories.length>0&&<span style={{color:"#fff"}}>({editModal.categories.length} selezionate)</span>}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {categories.map(c=>{
                  const sel=editModal.categories.includes(c);
                  return(
                    <button key={c} onClick={()=>setEditModal(p=>toggleCat(p,c))} className="tap"
                      style={{background:sel?"#fff":"#2A2A2A",color:sel?"#000":"#888",border:`1.5px solid ${sel?"#fff":"#333"}`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                      {sel?"✓ ":""}{c}
                    </button>
                  );
                })}
              </div>
              {/* Aggiungi categoria */}
              <div style={{display:"flex",gap:8}}>
                <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="+ Nuova categoria..."
                  onKeyDown={e=>{if(e.key==="Enter"&&newCat.trim()&&!categories.includes(newCat.trim())){ setCategories(prev=>[...prev,newCat.trim()]); setNewCat(""); }}}
                  style={{flex:1,background:"#2A2A2A",border:"1.5px dashed #444",borderRadius:10,padding:"8px 12px",fontSize:12,color:"#888",outline:"none"}}/>
              </div>
            </div>

            {/* Note */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Note personali</div>
              <textarea value={editModal.notes||""} onChange={e=>setEditModal(p=>({...p,notes:e.target.value}))}
                rows={2} placeholder="Appunti, perché lo segui..."
                style={{width:"100%",background:"#2A2A2A",border:"1.5px solid #333",borderRadius:12,padding:"10px 12px",fontSize:13,color:"#fff",outline:"none",resize:"none"}}/>
            </div>

            <button onClick={()=>saveProfile(editModal)} className="tap"
              style={{width:"100%",background:"#fff",color:"#000",border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>
              💾 Salva profilo
            </button>
            <button onClick={()=>setEditModal(null)} style={{width:"100%",background:"transparent",color:C.muted,border:"1px solid #333",borderRadius:14,padding:"13px",fontSize:14,cursor:"pointer"}}>
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* ════ GRIGLIA ════ */}
      {tab==="grid"&&(
        <div style={{paddingBottom:88}}>

          {/* Header */}
          <div style={{padding:"24px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:-1}}>Orbit</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>🪐 {profiles.length} profili nel tuo orbita</div>
            </div>
            <button onClick={()=>setShowImport(true)} className="tap"
              style={{background:"#fff",color:"#000",border:"none",borderRadius:24,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              + Aggiungi
            </button>
          </div>

          {/* Ricerca */}
          <div style={{padding:"0 20px 10px",position:"relative"}}>
            <span style={{position:"absolute",left:34,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca profili o categorie..."
              style={{width:"100%",background:"#1A1A1A",border:"1px solid #2A2A2A",borderRadius:24,padding:"10px 14px 10px 38px",fontSize:13,color:"#fff",outline:"none"}}/>
          </div>

          {/* Sort */}
          <div style={{padding:"0 20px 10px",display:"flex",gap:6}}>
            {[["date","🕐 Recenti"],["followers","👥 Follower"],["name","🔤 Nome"]].map(([key,label])=>(
              <button key={key} onClick={()=>setSortBy(key)} className="tap"
                style={{flexShrink:0,background:sortBy===key?"#fff":"transparent",color:sortBy===key?"#000":C.muted,border:`1px solid ${sortBy===key?"#fff":"#333"}`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Filtro categorie */}
          <div style={{overflowX:"auto",padding:"0 20px 14px",display:"flex",gap:6}}>
            {["Tutte",...categories].map(c=>(
              <button key={c} onClick={()=>setFilterCat(c)} className="tap"
                style={{flexShrink:0,background:filterCat===c?"#fff":"transparent",color:filterCat===c?"#000":C.muted,border:`1.5px solid ${filterCat===c?"#fff":c==="Tutte"?"#333":getCatColor(c)+"66"}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
                {c}{c!=="Tutte"&&catCounts[c]?` ${catCounts[c]}`:""}</button>
              );
            })}
          </div>

          {/* GRIGLIA INSTAGRAM */}
          <div style={{padding:"0 4px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>
            {filtered.map((p,i)=>{
              const initials=(p.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
              const platColor=PLATFORM_COLORS[p.platform]||"#888";
              return(
                <div key={p.id} className="tap"
                  style={{position:"relative",aspectRatio:"1",cursor:"pointer",overflow:"hidden",animation:`fadeUp .3s ${i*.03}s both`}}
                  onClick={()=>{setSelected(p);setTab("detail");}}>
                  <div style={{position:"absolute",inset:0,border:`2px solid ${p.categories[0]?getCatColor(p.categories[0])+"66":"transparent"}`,zIndex:2,pointerEvents:"none"}}/>
                  {/* Foto o gradiente */}
                  {p.photo
                    ? <img src={p.photo} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <div style={{width:"100%",height:"100%",background:"#3A3A3A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"rgba(255,255,255,.7)"}}>{initials}</div>
                  }
                  {/* Overlay gradient bottom */}
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.75) 100%)"}}/>
                  {/* Badge piattaforma */}
                  <div style={{position:"absolute",top:6,right:6,background:platColor,borderRadius:6,padding:"2px 6px",fontSize:9,fontWeight:800,color:"#fff"}}>
                    {PLATFORM_LABELS[p.platform]}
                  </div>
                  {/* Nome + followers */}
                  <div style={{position:"absolute",bottom:6,left:6,right:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.2,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.7)",marginTop:1,display:"flex",gap:4,alignItems:"center"}}>
                      {p.followers?<span>👥 {formatFollowers(p.followers)}</span>:p.categories[0]&&<span style={{color:getCatColor(p.categories[0])}}>{p.categories[0]}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cella aggiungi */}
            <div className="tap" onClick={()=>setShowImport(true)}
              style={{aspectRatio:"1",background:"#1A1A1A",border:"1.5px dashed #333",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:6}}>
              <div style={{fontSize:28,color:"#333"}}>+</div>
              <div style={{fontSize:10,color:"#444",fontWeight:600}}>Aggiungi</div>
            </div>
          </div>

          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"60px 20px",color:C.muted}}>
              <div style={{fontSize:40,marginBottom:12}}>🪐</div>
              <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>Nessun profilo</div>
              <div style={{fontSize:13,marginTop:4}}>Aggiungi il primo profilo al tuo orbita</div>
            </div>
          )}
        </div>
      )}

      {/* ════ DETTAGLIO ════ */}
      {tab==="detail"&&selected&&(
        <div style={{paddingBottom:100,minHeight:"100vh"}}>
          {/* Hero foto */}
          <div style={{position:"relative",height:320}}>
            {selected.photo
              ? <img src={selected.photo} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <div style={{width:"100%",height:"100%",background:"#3A3A3A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,fontWeight:800,color:"rgba(255,255,255,.7)"}}>
                  {(selected.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
                </div>
            }
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.3) 0%,transparent 40%,rgba(0,0,0,.8) 100%)"}}/>
            {/* Torna indietro */}
            <button onClick={()=>setTab("grid")} style={{position:"absolute",top:16,left:16,background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"none",borderRadius:"50%",width:40,height:40,fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
            {/* Cambia foto */}
            <button onClick={()=>photoRef.current?.click()} className="tap"
              style={{position:"absolute",top:16,right:60,background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"none",borderRadius:20,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",color:"#fff"}}>📷</button>
            {/* Condividi */}
            <button onClick={()=>doShare(selected)} className="tap"
              style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"none",borderRadius:"50%",width:40,height:40,fontSize:16,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>↗️</button>
            {/* Info overlay */}
            <div style={{position:"absolute",bottom:20,left:20,right:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{background:PLATFORM_COLORS[selected.platform],borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:800,color:"#fff"}}>{PLATFORM_LABELS[selected.platform]} {selected.platform}</div>
              </div>
              <div style={{fontSize:24,fontWeight:800,color:"#fff",lineHeight:1.2}}>{selected.name}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,.7)",marginTop:2,display:"flex",alignItems:"center",gap:8}}>
                <span>{selected.username}</span>
                {selected.followers&&<span style={{background:"rgba(255,255,255,.15)",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>👥 {formatFollowers(selected.followers)}</span>}
              </div>
            </div>
          </div>

          <div style={{padding:"20px 20px 0"}}>
            {/* Bio */}
            {selected.bio&&(
              <div style={{background:"#1A1A1A",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #2A2A2A"}}>
                <div style={{fontSize:14,color:"rgba(255,255,255,.8)",lineHeight:1.65}}>{selected.bio}</div>
              </div>
            )}

            {/* Categorie */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Categorie</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {selected.categories.map(c=>(
                  <span key={c} style={{background:getCatColor(c)+"15",color:getCatColor(c)+"CC",fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:20,border:`1px solid ${getCatColor(c)}30`}}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Note */}
            {selected.notes&&(
              <div style={{background:"#1A1A1A",borderRadius:14,padding:14,marginBottom:16,borderLeft:"3px solid #fff"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Note</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>{selected.notes}</div>
              </div>
            )}

            {/* CTA apri profilo */}
            <a href={selected.url} target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:PLATFORM_COLORS[selected.platform]||"#fff",color:"#fff",borderRadius:16,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10,textDecoration:"none"}}>
              Apri su {selected.platform.charAt(0).toUpperCase()+selected.platform.slice(1)} ↗
            </a>

            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <button onClick={()=>setEditModal({...selected})} className="tap"
                style={{flex:1,background:"#2A2A2A",color:"#fff",border:"1px solid #3A3A3A",borderRadius:14,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>✏️ Modifica</button>
              <button onClick={()=>doShare(selected)} className="tap"
                style={{flex:1,background:"#2A2A2A",color:"#fff",border:"1px solid #3A3A3A",borderRadius:14,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>↗️ Condividi</button>
              <button onClick={()=>deleteProfile(selected.id)} className="tap"
                style={{flex:0.6,background:"#2A1A1A",color:"#EF4444",border:"1px solid #3A2A2A",borderRadius:14,padding:"13px",fontSize:13,cursor:"pointer"}}>🗑️</button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      {tab!=="detail"&&(
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#111",borderTop:"1px solid #2A2A2A",display:"flex",justifyContent:"space-around",padding:"12px 0 20px",zIndex:200}}>
          {[["grid","⬛","Orbit"],["cats","🏷️","Categorie"]].map(([key,icon,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"0 20px",opacity:tab===key?1:0.35,transition:"all .2s"}}>
              <span style={{fontSize:22}}>{icon}</span>
              <span style={{fontSize:10,fontWeight:700,color:tab===key?"#fff":C.muted}}>{label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* TAB CATEGORIE */}
      {tab==="cats"&&(
        <div style={{paddingBottom:88}}>
          <div style={{padding:"24px 20px 16px",borderBottom:"1px solid #2A2A2A"}}>
            <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>Categorie</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>{categories.length} categorie</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
              {categories.map(c=>(
                <div key={c} style={{background:getCatColor(c)+"12",border:`1px solid ${getCatColor(c)}30`,borderRadius:24,padding:"8px 16px",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600}}>
                  <span style={{color:getCatColor(c)+"BB"}}>{c}</span>
                  {catCounts[c]&&<span style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",fontSize:11,padding:"2px 8px",borderRadius:20}}>{catCounts[c]}</span>}
                  <span onClick={()=>setCategories(prev=>prev.filter(x=>x!==c))} style={{cursor:"pointer",color:"rgba(255,255,255,.3)",fontSize:16}}>×</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Nuova categoria..."
                onKeyDown={e=>{ if(e.key==="Enter"&&newCat.trim()&&!categories.includes(newCat.trim())){ setCategories(prev=>[...prev,newCat.trim()]); setNewCat(""); showToast("Categoria aggiunta!"); } }}
                style={{flex:1,background:"#1A1A1A",border:"1.5px solid #333",borderRadius:12,padding:"12px 14px",fontSize:14,color:"#fff",outline:"none"}}/>
              <button onClick={()=>{ if(newCat.trim()&&!categories.includes(newCat.trim())){ setCategories(prev=>[...prev,newCat.trim()]); setNewCat(""); showToast("Categoria aggiunta!"); } }}
                style={{background:"#fff",color:"#000",border:"none",borderRadius:12,padding:"12px 18px",fontSize:14,fontWeight:700,cursor:"pointer"}}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
