import { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
// ── Project SVG Icons ──
function IconVillas41({size=32}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Palm leaf inspired by The 41 Villas logo */}
      <path d="M16 28 C16 28 8 20 10 12 C12 6 16 4 16 4 C16 4 20 6 22 12 C24 20 16 28 16 28Z"
        fill="url(#gold1)" opacity="0.9"/>
      <path d="M16 4 C16 4 13 8 12 14 C11 18 12 22 14 26"
        stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6"/>
      <path d="M16 4 C18 7 20 11 19 16 C18 20 17 24 16 28"
        stroke="#a07830" strokeWidth="0.8" fill="none" opacity="0.6"/>
      {/* Veins */}
      <path d="M16 8 C18 9 20 10 21 12" stroke="#e8c56a" strokeWidth="0.6" fill="none"/>
      <path d="M16 11 C18 12 20 13 21 15" stroke="#e8c56a" strokeWidth="0.6" fill="none"/>
      <path d="M16 14 C18 15 19 17 20 18" stroke="#e8c56a" strokeWidth="0.6" fill="none"/>
      <path d="M16 8 C14 9 12 10 11 12" stroke="#e8c56a" strokeWidth="0.6" fill="none"/>
      <path d="M16 11 C14 12 12 13 11 15" stroke="#e8c56a" strokeWidth="0.6" fill="none"/>
      <defs>
        <linearGradient id="gold1" x1="10" y1="4" x2="22" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5d78e"/>
          <stop offset="50%" stopColor="#c9a84c"/>
          <stop offset="100%" stopColor="#8b6914"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconForestGarden({size=32}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* House/dome shape inspired by Forest Garden logo */}
      <path d="M16 4 C16 4 10 8 8 12 L24 12 C22 8 16 4 16 4Z"
        fill="#10b981" opacity="0.85"/>
      <rect x="10" y="12" width="12" height="2" rx="1" fill="#10b981" opacity="0.7"/>
      {/* Concentric arcs - wifi/garden waves */}
      <path d="M10 17 Q16 14 22 17" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M11 20 Q16 17 21 20" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M12 23 Q16 20 20 23" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M13 26 Q16 23 19 26" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="16" cy="13" r="1.5" fill="#059669"/>
    </svg>
  );
}

const PROJECTS = {
  villas41: { id:"villas41", name:"The 41 Villas", color:"#c9a84c", accent:"#a07830", icon:"🏡",
    Logo: ({size=32}) => <IconVillas41 size={size}/> },
  forest:   { id:"forest",   name:"Forest Garden", color:"#10b981", accent:"#059669", icon:"🌿",
    Logo: ({size=32}) => <IconForestGarden size={size}/> },
};

// WhatsApp link helper
function waLink(tel, name) {
  const clean = tel.replace(/\D/g,"");
  const full = clean.startsWith("0") ? "212" + clean.slice(1) : clean;
  const msg = encodeURIComponent("Bonjour " + name + ", je vous contacte concernant votre intérêt pour notre projet immobilier.");
  return "https://wa.me/" + full + "?text=" + msg;
}

const CREDENTIALS = {
  mohamed: { pass:"Mohamed123", role:"admin",      name:"Mohamed", color:"#f59e0b" },
  zakaria: { pass:"Zakaria123", role:"commercial", name:"Zakaria", color:"#6366f1" },
  yassine: { pass:"Yassine123", role:"commercial", name:"Yassine", color:"#ec4899" },
};

{ key:"new",          label:"Nouveau Lead",   color:"#64748b", step:0 },
  { key:"contacted",    label:"Contacté",        color:"#3b82f6", step:1 },
  { key:"qualified",    label:"Qualifié",        color:"#f59e0b", step:2 },
  { key:"rdv",          label:"RDV",             color:"#8b5cf6", step:3 },
  { key:"visited",      label:"Visité",          color:"#10b981", step:4 },
  { key:"nonqualified", label:"Non Qualifié",    color:"#f97316", step:5 },
  { key:"lost",         label:"Perdu",           color:"#ef4444", step:6 },
];

const SOURCES    = ["Facebook","TikTok","LinkedIn","Google","Site Web","Autre"];
const ACT_TYPES  = ["WhatsApp","Appel","SMS","Email","RDV","Visite","Autre"];
const BUDGETS    = ["< 500k","500k - 1M","1M - 2M","2M - 3M","3M+","Non défini"];

const DEFAULT_ACTIONS = [
  "WhatsApp Message","Appel Normal","SMS","Email","WhatsApp Appel",
  "Rendez-vous Planifié","Rendez-vous Confirmé","Visite Site",
  "Proposition Envoyée","Négociation","Réservation / Parapha",
];

const DATE_RANGES = [
  {key:"all",label:"Tout"},{key:"1",label:"1j"},{key:"3",label:"3j"},{key:"4",label:"4j"},{key:"7",label:"7j"},
  {key:"15",label:"15j"},{key:"30",label:"30j"},{key:"90",label:"3m"},
];

const today   = new Date();
const dAgo    = n => new Date(today - n*864e5).toISOString().split("T")[0];
const todayStr= dAgo(0);

// ── Demo Data ──
const DEMO = [
  {id:1,project:"villas41",nom:"Karim Bennani",  tel:"0661111111",email:"karim@gmail.com",  budget:"1M - 2M",  source:"Facebook",assigned:"zakaria",status:"qualified",  createdAt:dAgo(2), rdvDate:"",rdvTime:"", actions:[{type:"WhatsApp",note:"Premier contact",date:dAgo(2),done:true}]},
  {id:2,project:"villas41",nom:"Salma Idrissi",  tel:"0662222222",email:"salma@gmail.com",  budget:"2M - 3M",  source:"TikTok",  assigned:"yassine",status:"rdv",         createdAt:dAgo(3), rdvDate:dAgo(-2),rdvTime:"10:00", actions:[{type:"RDV",note:"Visite samedi",date:dAgo(1),done:false}]},
  {id:3,project:"villas41",nom:"Hassan Tazi",    tel:"0663333333",email:"hassan@gmail.com", budget:"3M+",      source:"LinkedIn",assigned:"zakaria",status:"contacted",   createdAt:dAgo(5), rdvDate:"",rdvTime:"", actions:[{type:"Appel",note:"Très intéressé",date:dAgo(5),done:true}]},
  {id:4,project:"villas41",nom:"Nadia Ouali",    tel:"0664444444",email:"nadia@gmail.com",  budget:"500k - 1M",source:"Facebook",assigned:"yassine",status:"new",          createdAt:dAgo(1), rdvDate:"",rdvTime:"", actions:[]},
  {id:5,project:"forest",  nom:"Omar Chraibi",   tel:"0665555555",email:"omar@gmail.com",   budget:"1M - 2M",  source:"Facebook",assigned:"zakaria",status:"rdv",          createdAt:dAgo(3), rdvDate:dAgo(-1),rdvTime:"14:30", actions:[{type:"WhatsApp",note:"Contact initial",date:dAgo(3),done:true}]},
  {id:6,project:"forest",  nom:"Fatima Berrada", tel:"0666666666",email:"fatima@gmail.com", budget:"2M - 3M",  source:"TikTok",  assigned:"yassine",status:"qualified",   createdAt:dAgo(5), rdvDate:"",rdvTime:"", actions:[{type:"Email",note:"Brochure envoyée",date:dAgo(5),done:true}]},
  {id:7,project:"forest",  nom:"Youssef Amrani", tel:"0667777777",email:"youssef@gmail.com",budget:"< 500k",   source:"Site Web",assigned:"zakaria",status:"new",          createdAt:dAgo(1), rdvDate:"",rdvTime:"", actions:[]},
  {id:8,project:"forest",  nom:"Zineb Moussaoui",tel:"0668888888",email:"zineb@gmail.com",  budget:"1M - 2M",  source:"Google",  assigned:"yassine",status:"contacted",   createdAt:dAgo(4), rdvDate:"",rdvTime:"", actions:[{type:"Appel",note:"RDV fixé",date:dAgo(4),done:true}]},
];

const store = {
  get:(k,d)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
};

function byDate(leads,r) {
  if(r==="all") return leads;
  const cut=new Date(today-parseInt(r)*864e5);
  return leads.filter(l=>new Date(l.createdAt)>=cut);
}
function pct(n,t){ return t?Math.round(n/t*100):0; }

// ── Icons ──
const IC={
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus:"M12 5v14M5 12h14", check:"M20 6L9 17l-5-5", x:"M18 6L6 18M6 6l12 12",
  trash:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  calendar:"M3 4h18v18H3z M16 2v4M8 2v4M3 10h18",
  key:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  import:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
};
function Icon({name,size=16}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(IC[name]||"").split(" M").map((d,i)=><path key={i} d={i===0?d:"M"+d}/>)}
    </svg>
  );
}

// ── Donut ──
function Donut({data,total,size=150}){
  const r=56,cx=75,cy=75,circ=2*Math.PI*r;
  let off=0;
  const sl=data.filter(d=>d.count>0).map(d=>{
    const s={...d,dash:d.count/(total||1)*circ,gap:(1-d.count/(total||1))*circ,offset:off};
    off+=s.dash; return s;
  });
  return(
    <svg width={size} height={size} viewBox="0 0 150 150">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="18"/>
      {sl.map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="18"
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset}
          style={{transform:"rotate(-90deg)",transformOrigin:"75px 75px",transition:"stroke-dasharray 0.8s"}}/>
      ))}
      <text x={cx} y={cy-5} textAnchor="middle" fill="#f1f5f9" fontSize="20" fontWeight="800" fontFamily="Georgia,serif">{total}</text>
      <text x={cx} y={cy+13} textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="1">LEADS</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App(){
  const [user,setUser]       = useState(null);
  const [leads,setLeads]     = useState(()=>store.get("crm3_leads",DEMO));
  const [actions41,setAct]   = useState(()=>store.get("crm3_actions",DEFAULT_ACTIONS));
  const [project,setProject] = useState("villas41");
  const [view,setView]       = useState("dashboard");
  const [selId,setSelId]     = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [toast,setToast]     = useState(null);
  const [dateRange,setDR]    = useState("all");
  const [comFocus,setCF]     = useState("both");
  const [stFilter,setSF]     = useState("all");

  useEffect(()=>{store.set("crm3_leads",leads);},[leads]);
  useEffect(()=>{store.set("crm3_actions",actions41);},[actions41]);

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const proj=PROJECTS[project];

  const myLeads=useMemo(()=>{
    let base=leads.filter(l=>l.project===project);
    if(user?.role==="commercial") base=base.filter(l=>l.assigned===user.id);
    if(user?.role==="admin"&&comFocus!=="both") base=base.filter(l=>l.assigned===comFocus);
    base=byDate(base,dateRange);
    if(stFilter!=="all") base=base.filter(l=>l.status===stFilter);
    return base;
  },[leads,user,project,dateRange,comFocus,stFilter]);

  const addLead=data=>{
    const zk=leads.filter(l=>l.assigned==="zakaria"&&l.project===project).length;
    const yn=leads.filter(l=>l.assigned==="yassine"&&l.project===project).length;
    const assigned=zk<=yn?"zakaria":"yassine";
    setLeads(p=>[{...data,id:Date.now(),assigned,project,status:"new",createdAt:dAgo(0),rdvDate:"",rdvTime:"",actions:[]},...p]);
    notify("Lead ajouté → "+CREDENTIALS[assigned].name);
  };
  const updateLead=(id,patch)=>setLeads(p=>p.map(l=>l.id===id?{...l,...patch}:l));
  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));notify("Supprimé","err");};
  const addAction=(lid,act)=>setLeads(p=>p.map(l=>l.id===lid?{...l,actions:[...(l.actions||[]),{...act,date:dAgo(0),done:false}]}:l));
  const toggleAct=(lid,idx)=>setLeads(p=>p.map(l=>l.id===lid?{...l,actions:l.actions.map((a,i)=>i===idx?{...a,done:!a.done}:a)}:l));

  const selLead=leads.find(l=>l.id===selId);

  if(!user) return <Login onLogin={setUser}/>;

  // All RDV leads for calendar (both projects for admin)
  const rdvLeads=leads.filter(l=>{
    if(l.status!=="rdv"||!l.rdvDate) return false;
    if(user.role==="commercial") return l.assigned===user.id;
    return true;
  });

  const navItems=[
    {key:"dashboard",icon:"home",label:"Dashboard"},
    {key:"leads",icon:"users",label:"Leads"},
    {key:"calendar",icon:"calendar",label:"Calendrier RDV"},
    ...(user.role==="admin"?[
      {key:"zakaria",icon:"activity",label:"Zakaria"},
      {key:"yassine",icon:"activity",label:"Yassine"},
      {key:"settings",icon:"settings",label:"Paramètres"},
    ]:[]),
  ];

  return(
    <div style={S.app}>
      {toast&&<div style={{...S.toast,background:toast.type==="err"?"#ef4444":"#10b981"}}>{toast.msg}</div>}

      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <div style={{...S.logoBox,background:"#1e293b",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <proj.Logo size={26}/>
          </div>
          <div>
            <div style={{color:"#f1f5f9",fontWeight:900,fontSize:12,letterSpacing:1}}>{proj.name}</div>
            <div style={{color:"#64748b",fontSize:9}}>CRM Platform</div>
          </div>
        </div>

        {/* Project Switcher */}
        {(
          <div style={S.projSwitch}>
            {Object.values(PROJECTS).map(p=>(
              <button key={p.id} onClick={()=>{setProject(p.id);setView("dashboard");}}
                style={{...S.projBtn,...(project===p.id?{background:p.color+"22",borderColor:p.color,color:p.color}:{})}}>
                <p.Logo size={20}/>
                <span style={{fontSize:10,fontWeight:700}}>{p.name}</span>
                <span style={{marginLeft:"auto",fontSize:9,color:"#64748b"}}>{leads.filter(l=>l.project===p.id).length}</span>
              </button>
            ))}
          </div>
        )}

        {/* User */}
        <div style={S.userCard}>
          <div style={{...S.avatar,background:CREDENTIALS[user.id].color}}>{user.name[0]}</div>
          <div>
            <div style={{color:"#f1f5f9",fontWeight:700,fontSize:12}}>{user.name}</div>
            <div style={{color:"#64748b",fontSize:9}}>{user.role==="admin"?"Administrateur":"Commercial"}</div>
          </div>
        </div>

        {/* Filters */}
        {user.role==="admin"&&(
          <div style={S.filters}>
            <div style={S.fLbl}>Période</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
              {DATE_RANGES.map(d=>(
                <button key={d.key} onClick={()=>setDR(d.key)}
                  style={{...S.chip,...(dateRange===d.key?{borderColor:proj.color,color:proj.color,background:proj.color+"11"}:{})}}>
                  {d.label}
                </button>
              ))}
            </div>
            <div style={S.fLbl}>Commercial</div>
            <div style={{display:"flex",gap:3}}>
              {[["both","Les 2"],["zakaria","Zak"],["yassine","Yas"]].map(([k,l])=>(
                <button key={k} onClick={()=>setCF(k)}
                  style={{...S.chip,...(comFocus===k?{borderColor:proj.color,color:proj.color,background:proj.color+"11"}:{})}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          {navItems.map(n=>(
            <button key={n.key} onClick={()=>setView(n.key)}
              style={{...S.navBtn,...(view===n.key?{background:proj.color+"22",color:proj.color}:{})}}>
              <Icon name={n.icon} size={14}/><span>{n.label}</span>
              {(n.key==="zakaria"||n.key==="yassine")&&(
                <span style={S.nbadge}>{leads.filter(l=>l.assigned===n.key&&l.project===project).length}</span>
              )}
              {n.key==="calendar"&&(
                <span style={{...S.nbadge,background:"#8b5cf633",color:"#8b5cf6"}}>{rdvLeads.length}</span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={()=>setUser(null)} style={S.logout}>
          <Icon name="logout" size={13}/><span>Déconnexion</span>
        </button>
      </aside>

      <main style={S.main}>
        {view==="dashboard"&&(
          <Dashboard leads={myLeads} allLeads={leads} user={user} proj={proj}
            project={project} dateRange={dateRange} actions41={actions41}/>
        )}
        {view==="leads"&&(
          <LeadsView leads={myLeads} user={user} proj={proj}
            stFilter={stFilter} setSF={setSF}
            onAdd={()=>setShowAdd(true)} onSel={setSelId}
            onDel={deleteLead} onUpd={updateLead} actions41={actions41}/>
        )}
        {view==="calendar"&&(
          <CalendarView rdvLeads={rdvLeads} user={user} proj={proj}
            onSel={setSelId} allProjects={PROJECTS}/>
        )}
        {(view==="zakaria"||view==="yassine")&&user.role==="admin"&&(
          <CommView com={view} proj={proj} project={project}
            leads={byDate(leads.filter(l=>l.assigned===view&&l.project===project),dateRange)}
            onSel={setSelId} actions41={actions41}/>
        )}
        {view==="settings"&&user.role==="admin"&&(
          <Settings actions41={actions41} setAct={setAct} leads={leads} setLeads={setLeads} notify={notify} project={project}/>
        )}
      </main>

      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={addLead} proj={proj}/>}
      {selLead&&(
        <LeadModal lead={selLead} user={user} actions41={actions41}
          onClose={()=>setSelId(null)} onAdd={addAction} onToggle={toggleAct}
          onUpd={updateLead} proj={PROJECTS[selLead.project]}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function Login({onLogin}){
  const [sel,setSel]=useState(null);
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const submit=()=>{
    if(CREDENTIALS[sel]?.pass===pwd) onLogin({id:sel,...CREDENTIALS[sel]});
    else{setErr("Mot de passe incorrect");setTimeout(()=>setErr(""),2000);}
  };
  return(
    <div style={S.loginBg}>
      <div style={S.loginCard}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:18}}>
          {Object.values(PROJECTS).map(p=>(
            <div key={p.id} style={{textAlign:"center"}}>
              <div style={{width:46,height:46,borderRadius:12,background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px"}}>
                <p.Logo size={36}/>
              </div>
              <div style={{color:p.color,fontSize:9,fontWeight:800,letterSpacing:1}}>{p.name.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <p style={{color:"#64748b",fontSize:11,textAlign:"center",marginBottom:26}}>CRM Multi-Projets Immobilier</p>
        {!sel?(
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {Object.entries(CREDENTIALS).map(([id,u])=>(
              <button key={id} onClick={()=>setSel(id)}
                style={{...S.loginBtn,borderColor:u.color+"55"}}>
                <div style={{...S.avatar,background:u.color,width:36,height:36,fontSize:16}}>{u.name[0]}</div>
                <div>
                  <div style={{color:"#f1f5f9",fontWeight:700,fontSize:13}}>{u.name}</div>
                  <div style={{color:"#64748b",fontSize:10}}>{u.role==="admin"?"Administrateur — Accès total":"Commercial"}</div>
                </div>
              </button>
            ))}
          </div>
        ):(
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{...S.avatar,background:CREDENTIALS[sel].color,width:42,height:42,fontSize:19}}>{CREDENTIALS[sel].name[0]}</div>
              <div>
                <div style={{color:"#f1f5f9",fontWeight:700}}>{CREDENTIALS[sel].name}</div>
                <button onClick={()=>{setSel(null);setPwd("");}} style={{color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontSize:11}}>← Changer</button>
              </div>
            </div>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              placeholder="Mot de passe" style={{...S.input,marginBottom:7}} autoFocus/>
            {err&&<div style={{color:"#ef4444",fontSize:11,marginBottom:7}}>{err}</div>}
            <button onClick={submit} style={{...S.primaryBtn,width:"100%",justifyContent:"center"}}>Connexion</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({leads,allLeads,user,proj,project,dateRange,actions41}){
  const isAdmin=user.role==="admin";
  const total=leads.length;
  const donut=STATUSES.map(s=>({...s,count:leads.filter(l=>l.status===s.key).length}));
  const srcBar=SOURCES.map(s=>({label:s,value:leads.filter(l=>l.source===s).length}));
  const maxSrc=Math.max(...srcBar.map(s=>s.value),1);
  const zkL=byDate(allLeads.filter(l=>l.assigned==="zakaria"&&l.project===project),dateRange);
  const ynL=byDate(allLeads.filter(l=>l.assigned==="yassine"&&l.project===project),dateRange);

  const crossStats=Object.values(PROJECTS).map(p=>({
    ...p,
    total:allLeads.filter(l=>l.project===p.id).length,
    rdv:allLeads.filter(l=>l.project===p.id&&l.status==="rdv").length,
    qualified:allLeads.filter(l=>l.project===p.id&&l.status==="qualified").length,
  }));

  // Upcoming RDVs
  const upcomingRDV=allLeads.filter(l=>l.status==="rdv"&&l.rdvDate&&l.rdvDate>=todayStr&&(isAdmin||l.assigned===user.id))
    .sort((a,b)=>a.rdvDate.localeCompare(b.rdvDate)).slice(0,4);

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{proj.icon}</span>
            <h1 style={{...S.pageTitle,color:proj.color}}>{proj.name}</h1>
          </div>
          <span style={S.pageSub}>{total} leads</span>
        </div>
      </div>

      {/* Cross-project (admin) */}
      {isAdmin&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
          {crossStats.map(p=>(
            <div key={p.id} style={{...S.kpi,borderLeft:`4px solid ${p.color}`,display:"flex",alignItems:"center",gap:12}}>
              <p.Logo size={36}/>
              <div style={{flex:1}}>
                <div style={{color:p.color,fontWeight:800,fontSize:12}}>{p.name}</div>
                <div style={{color:"#f1f5f9",fontSize:20,fontWeight:900,fontFamily:"Georgia,serif"}}>{p.total} <span style={{fontSize:11,color:"#64748b"}}>leads</span></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:"#8b5cf6",fontSize:12,fontWeight:700}}>{p.rdv} RDV</div>
                <div style={{color:"#f59e0b",fontSize:12}}>{p.qualified} qualifiés</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9,marginBottom:18}}>
        {STATUSES.map(s=>{
          const cnt=leads.filter(l=>l.status===s.key).length;
          return(
            <div key={s.key} style={{...S.kpi,borderTop:`3px solid ${s.color}`}}>
              <div style={{color:"#64748b",fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:4,lineHeight:1.2}}>{s.step}. {s.label}</div>
              <div style={{color:s.color,fontSize:22,fontWeight:900,fontFamily:"Georgia,serif"}}>{cnt}</div>
              <div style={{color:"#334155",fontSize:9}}>{pct(cnt,total)}%</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isAdmin?"1.2fr 1fr 1fr":"1.2fr 1fr",gap:14,marginBottom:14}}>
        {/* Donut */}
        <div style={S.card}>
          <div style={S.cardT}>Répartition Statuts</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Donut data={donut} total={total} size={145}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
              {donut.filter(d=>d.count>0).map(d=>(
                <div key={d.key}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:d.color}}/>
                      <span style={{color:"#94a3b8",fontSize:10}}>{d.label}</span>
                    </div>
                    <span style={{color:d.color,fontWeight:700,fontSize:10}}>{d.count} · {pct(d.count,total)}%</span>
                  </div>
                  <div style={{height:3,background:"#1e293b",borderRadius:2}}>
                    <div style={{height:"100%",width:`${pct(d.count,total)}%`,background:d.color,borderRadius:2,transition:"width 0.8s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources */}
        <div style={S.card}>
          <div style={S.cardT}>Sources</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {srcBar.filter(s=>s.value>0).map((s,i)=>{
              const cols=["#6366f1","#f59e0b","#10b981","#3b82f6","#ec4899","#64748b"];
              return(
                <div key={s.label}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:6,height:6,borderRadius:2,background:cols[i%6]}}/>
                      <span style={{color:"#94a3b8",fontSize:10}}>{s.label}</span>
                    </div>
                    <span style={{color:cols[i%6],fontWeight:700,fontSize:10}}>{pct(s.value,total)}%</span>
                  </div>
                  <div style={{height:3,background:"#1e293b",borderRadius:2}}>
                    <div style={{height:"100%",width:`${s.value/maxSrc*100}%`,background:cols[i%6],borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commerciaux */}
        {isAdmin&&(
          <div style={S.card}>
            <div style={S.cardT}>Commerciaux</div>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:12}}>
              {[{id:"zakaria",ls:zkL},{id:"yassine",ls:ynL}].map(({id,ls})=>{
                const u=CREDENTIALS[id];
                const r=30,circ=2*Math.PI*r,fill=(ls.length/(allLeads.filter(l=>l.project===project).length||1))*circ;
                return(
                  <div key={id} style={{textAlign:"center"}}>
                    <svg width={74} height={74} viewBox="0 0 74 74">
                      <circle cx={37} cy={37} r={r} fill="none" stroke="#1e293b" strokeWidth="6"/>
                      <circle cx={37} cy={37} r={r} fill="none" stroke={u.color} strokeWidth="6"
                        strokeDasharray={`${fill} ${circ-fill}`} strokeDashoffset={circ/4}
                        style={{transition:"stroke-dasharray 0.8s"}} strokeLinecap="round"/>
                      <text x={37} y={41} textAnchor="middle" fill="#f1f5f9" fontSize="13" fontWeight="800" fontFamily="Georgia,serif">{ls.length}</text>
                    </svg>
                    <div style={{color:u.color,fontSize:11,fontWeight:700}}>{u.name}</div>
                    <div style={{color:"#64748b",fontSize:9}}>{ls.filter(l=>l.status==="rdv").length} RDV</div>
                  </div>
                );
              })}
            </div>
            {STATUSES.map(s=>{
              const zk=zkL.filter(l=>l.status===s.key).length;
              const yn=ynL.filter(l=>l.status===s.key).length;
              if(!zk&&!yn) return null;
              return(
                <div key={s.key} style={{marginBottom:5}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{color:"#64748b",fontSize:9}}>{s.label}</span>
                    <span style={{fontSize:9}}>
                      <span style={{color:CREDENTIALS.zakaria.color}}>{zk}</span>
                      {" vs "}
                      <span style={{color:CREDENTIALS.yassine.color}}>{yn}</span>
                    </span>
                  </div>
                  <div style={{display:"flex",height:4,borderRadius:2,overflow:"hidden",gap:1}}>
                    <div style={{flex:zk||0.01,background:CREDENTIALS.zakaria.color,transition:"flex 0.8s"}}/>
                    <div style={{flex:yn||0.01,background:CREDENTIALS.yassine.color,transition:"flex 0.8s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming RDVs */}
      {upcomingRDV.length>0&&(
        <div style={S.card}>
          <div style={S.cardT}><Icon name="clock" size={11}/> Prochains RDV</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {upcomingRDV.map(l=>{
              const p=PROJECTS[l.project];
              const u=CREDENTIALS[l.assigned];
              return(
                <div key={l.id} style={{padding:"10px 12px",background:"#0f172a",borderRadius:8,borderLeft:`3px solid ${p.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:p.color,fontSize:9,fontWeight:700}}>{p.icon} {p.name}</span>
                    <span style={{color:u.color,fontSize:9}}>{u.name}</span>
                  </div>
                  <div style={{color:"#f1f5f9",fontWeight:700,fontSize:12,marginBottom:2}}>{l.nom}</div>
                  <div style={{color:"#64748b",fontSize:10}}>{l.tel}</div>
                  <div style={{color:"#8b5cf6",fontSize:10,marginTop:4,fontWeight:600}}>
                    📅 {l.rdvDate} {l.rdvTime&&`à ${l.rdvTime}`}
                  </div>
                  {l.budget&&<div style={{color:"#f59e0b",fontSize:9,marginTop:2}}>💰 {l.budget}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CALENDAR VIEW
// ─────────────────────────────────────────────
function CalendarView({rdvLeads,user,proj,onSel,allProjects}){
  const [calDate,setCalDate]=useState(new Date());
  const [calView,setCalView]=useState("month"); // month | week | list

  const year=calDate.getFullYear();
  const month=calDate.getMonth();

  // Days in month
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const adjustedFirst=(firstDay+6)%7; // Monday first

  const getRDVsForDate=dateStr=>rdvLeads.filter(l=>l.rdvDate===dateStr);

  const monthNames=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const dayNames=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  // Week view
  const getWeekDays=()=>{
    const d=new Date(calDate);
    const day=d.getDay();
    const diff=d.getDate()-(day===0?6:day-1);
    const monday=new Date(d.setDate(diff));
    return Array.from({length:7},(_,i)=>{
      const dd=new Date(monday);
      dd.setDate(monday.getDate()+i);
      return dd;
    });
  };

  const fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <div>
          <h1 style={S.pageTitle}><Icon name="calendar" size={20}/> Calendrier RDV</h1>
          <span style={S.pageSub}>{rdvLeads.length} rendez-vous planifiés</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          {["month","week","list"].map(v=>(
            <button key={v} onClick={()=>setCalView(v)}
              style={{...S.chip,...(calView===v?{borderColor:"#8b5cf6",color:"#8b5cf6",background:"#8b5cf611"}:{}),padding:"6px 14px"}}>
              {v==="month"?"Mois":v==="week"?"Semaine":"Liste"}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <button onClick={()=>{ const d=new Date(calDate); calView==="week"?d.setDate(d.getDate()-7):d.setMonth(d.getMonth()-1); setCalDate(new Date(d)); }}
          style={{...S.iconBtn,padding:"8px 14px"}}>‹</button>
        <div style={{color:"#f1f5f9",fontWeight:700,fontSize:15,minWidth:160,textAlign:"center"}}>
          {calView==="week"
            ?`Sem. ${getWeekDays()[0].getDate()}–${getWeekDays()[6].getDate()} ${monthNames[month]}`
            :`${monthNames[month]} ${year}`}
        </div>
        <button onClick={()=>{ const d=new Date(calDate); calView==="week"?d.setDate(d.getDate()+7):d.setMonth(d.getMonth()+1); setCalDate(new Date(d)); }}
          style={{...S.iconBtn,padding:"8px 14px"}}>›</button>
        <button onClick={()=>setCalDate(new Date())} style={{...S.chip,padding:"6px 12px",borderColor:"#8b5cf6",color:"#8b5cf6"}}>Aujourd'hui</button>
      </div>

      {/* MONTH VIEW */}
      {calView==="month"&&(
        <div style={S.card}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:4}}>
            {dayNames.map(d=><div key={d} style={{textAlign:"center",color:"#64748b",fontSize:10,fontWeight:700,padding:"4px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {Array.from({length:adjustedFirst},(_,i)=>(
              <div key={`empty-${i}`} style={{minHeight:80}}/>
            ))}
            {Array.from({length:daysInMonth},(_,i)=>{
              const day=i+1;
              const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const dayRDVs=getRDVsForDate(dateStr);
              const isToday=dateStr===todayStr;
              return(
                <div key={day} style={{minHeight:80,background:isToday?"#8b5cf611":"#0f172a",borderRadius:8,padding:6,border:`1px solid ${isToday?"#8b5cf6":"#1e293b"}`}}>
                  <div style={{color:isToday?"#8b5cf6":"#64748b",fontWeight:isToday?800:400,fontSize:11,marginBottom:3}}>{day}</div>
                  {dayRDVs.map(l=>{
                    const p=allProjects[l.project];
                    const u=CREDENTIALS[l.assigned];
                    return(
                      <div key={l.id} onClick={()=>onSel(l.id)}
                        style={{background:p.color+"22",border:`1px solid ${p.color}44`,borderRadius:4,padding:"2px 5px",marginBottom:2,cursor:"pointer"}}>
                        <div style={{color:p.color,fontSize:9,fontWeight:700,lineHeight:1.3}}>{p.icon} {l.nom}</div>
                        {l.rdvTime&&<div style={{color:"#94a3b8",fontSize:8}}>{l.rdvTime}</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {calView==="week"&&(
        <div style={S.card}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
            {getWeekDays().map((d,i)=>{
              const dateStr=fmt(d);
              const dayRDVs=getRDVsForDate(dateStr);
              const isToday=dateStr===todayStr;
              return(
                <div key={i} style={{background:isToday?"#8b5cf611":"#0f172a",borderRadius:10,padding:10,border:`1px solid ${isToday?"#8b5cf6":"#1e293b"}`,minHeight:160}}>
                  <div style={{color:isToday?"#8b5cf6":"#64748b",fontWeight:700,fontSize:10,marginBottom:6,textAlign:"center"}}>
                    {dayNames[i]}<br/>
                    <span style={{fontSize:16,fontFamily:"Georgia,serif",color:isToday?"#8b5cf6":"#f1f5f9"}}>{d.getDate()}</span>
                  </div>
                  {dayRDVs.map(l=>{
                    const p=allProjects[l.project];
                    const u=CREDENTIALS[l.assigned];
                    return(
                      <div key={l.id} onClick={()=>onSel(l.id)}
                        style={{background:p.color+"22",border:`1px solid ${p.color}55`,borderRadius:6,padding:"5px 7px",marginBottom:5,cursor:"pointer"}}>
                        <div style={{color:p.color,fontSize:9,fontWeight:700}}>{p.icon} {p.name}</div>
                        <div style={{color:"#f1f5f9",fontSize:11,fontWeight:600,marginTop:1}}>{l.nom}</div>
                        <div style={{color:"#64748b",fontSize:9}}>{l.tel}</div>
                        {l.rdvTime&&<div style={{color:"#8b5cf6",fontSize:9,marginTop:2}}>⏰ {l.rdvTime}</div>}
                        {l.budget&&<div style={{color:"#f59e0b",fontSize:9}}>💰 {l.budget}</div>}
                        <div style={{color:u.color,fontSize:9,marginTop:1}}>👤 {u.name}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {calView==="list"&&(
        <div style={S.card}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {rdvLeads.length===0&&<div style={S.empty}>Aucun RDV planifié</div>}
            {rdvLeads.sort((a,b)=>a.rdvDate.localeCompare(b.rdvDate)).map(l=>{
              const p=allProjects[l.project];
              const u=CREDENTIALS[l.assigned];
              const isPast=l.rdvDate<todayStr;
              return(
                <div key={l.id} onClick={()=>onSel(l.id)}
                  style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"#0f172a",borderRadius:10,border:`1px solid ${isPast?"#1e293b":p.color+"44"}`,cursor:"pointer",opacity:isPast?0.6:1}}>
                  <div style={{textAlign:"center",minWidth:50}}>
                    <div style={{color:p.color,fontSize:18,fontWeight:900,fontFamily:"Georgia,serif"}}>{l.rdvDate?.split("-")[2]}</div>
                    <div style={{color:"#64748b",fontSize:9}}>{monthNames[parseInt(l.rdvDate?.split("-")[1])-1]?.slice(0,3)}</div>
                  </div>
                  <div style={{width:1,height:40,background:"#1e293b"}}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <span style={{color:p.color,fontSize:10,fontWeight:700}}>{p.icon} {p.name}</span>
                      <span style={{color:u.color,fontSize:10}}>— {u.name}</span>
                      {isPast&&<span style={{color:"#64748b",fontSize:9}}>✓ Passé</span>}
                    </div>
                    <div style={{color:"#f1f5f9",fontWeight:700,fontSize:13}}>{l.nom}</div>
                    <div style={{color:"#64748b",fontSize:11}}>{l.tel} · {l.email}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {l.rdvTime&&<div style={{color:"#8b5cf6",fontWeight:700,fontSize:13}}>⏰ {l.rdvTime}</div>}
                    {l.budget&&<div style={{color:"#f59e0b",fontSize:11}}>💰 {l.budget}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LEADS VIEW
// ─────────────────────────────────────────────
function LeadsView({leads,user,proj,stFilter,setSF,onAdd,onSel,onDel,onUpd,actions41}){
  const isAdmin=user.role==="admin";
  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <div>
          <h1 style={{...S.pageTitle,color:proj.color}}>{proj.icon} Leads — {proj.name}</h1>
          <span style={S.pageSub}>{leads.length} lead(s)</span>
        </div>
        <button onClick={onAdd} style={{...S.primaryBtn,background:`linear-gradient(135deg,${proj.color},${proj.accent})`}}>
          <Icon name="plus" size={14}/> Nouveau Lead
        </button>
      </div>

      <div style={S.filterBar}>
        <button onClick={()=>setSF("all")} style={{...S.fBtn,...(stFilter==="all"?S.fBtnOn:{})}}>Tous</button>
        {STATUSES.map(s=>(
          <button key={s.key} onClick={()=>setSF(s.key)}
            style={{...S.fBtn,...(stFilter===s.key?{...S.fBtnOn,borderColor:s.color,color:s.color}:{})}}>
            {s.step}. {s.label}
          </button>
        ))}
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr style={S.thead}>
            <th style={S.th}>Lead</th>
            <th style={S.th}>Budget</th>
            <th style={S.th}>Source</th>
            {isAdmin&&<th style={S.th}>Assigné</th>}
            <th style={S.th}>Statut</th>
            <th style={S.th}>RDV</th>
            <th style={S.th}>%</th>
            <th style={S.th}></th>
          </tr></thead>
          <tbody>
            {leads.map(lead=>{
              const st=STATUSES.find(s=>s.key===lead.status);
              const ac=lead.actions?.length||0;
              return(
                <tr key={lead.id} style={S.tr} onClick={()=>onSel(lead.id)}>
                  <td style={S.td}>
                    <div style={{fontWeight:700,color:"#f1f5f9",fontSize:13}}>{lead.nom}</div>
                    <a href={waLink(lead.tel, lead.nom)} target="_blank" rel="noreferrer"
                    onClick={e=>e.stopPropagation()}
                    style={{fontSize:10,color:"#25D366",textDecoration:"none",display:"flex",alignItems:"center",gap:3}}>
                    <span>📱</span>{lead.tel}
                  </a>
                  </td>
                  <td style={S.td}>
                    {lead.status==="rdv"&&lead.budget&&<span style={{color:"#f59e0b",fontSize:11,fontWeight:600}}>💰 {lead.budget}</span>}
                  </td>
                  <td style={S.td}><SrcBadge src={lead.source}/></td>
                  {isAdmin&&(
                    <td style={S.td}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:CREDENTIALS[lead.assigned]?.color}}/>
                        <span style={{color:"#94a3b8",fontSize:11}}>{CREDENTIALS[lead.assigned]?.name}</span>
                      </div>
                    </td>
                  )}
                  <td style={S.td}>
                    {(()=>{const st=STATUSES.find(s=>s.key===lead.status);return <span style={{...S.badge2,background:st?.color+"22",color:st?.color,border:`1px solid ${st?.color}44`,fontSize:9}}>{st?.step}. {st?.label}</span>;})()}
                  </td>
                  <td style={S.td}>
                    {lead.rdvDate?(
                      <div>
                        <div style={{color:"#8b5cf6",fontSize:10,fontWeight:600}}>📅 {lead.rdvDate}</div>
                        {lead.rdvTime&&<div style={{color:"#64748b",fontSize:9}}>⏰ {lead.rdvTime}</div>}
                      </div>
                    ):<span style={{color:"#334155",fontSize:10}}>—</span>}
                  </td>
                  <td style={S.td}>
                    <div style={{display:"flex",alignItems:"center",gap:4,minWidth:65}}>
                      <div style={{flex:1,height:4,background:"#1e293b",borderRadius:2}}>
                        <div style={{height:"100%",width:`${ac/actions41.length*100}%`,background:proj.color,borderRadius:2}}/>
                      </div>
                      <span style={{color:"#64748b",fontSize:9}}>{Math.round(ac/actions41.length*100)}%</span>
                    </div>
                  </td>
                  <td style={S.td} onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={()=>onSel(lead.id)} style={S.iconBtn}><Icon name="eye" size={12}/></button>
                      <button onClick={()=>onDel(lead.id)} style={{...S.iconBtn,color:"#ef4444"}}><Icon name="trash" size={12}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leads.length===0&&<div style={S.empty}>Aucun lead</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMMERCIAL VIEW
// ─────────────────────────────────────────────
function CommView({com,proj,project,leads,onSel,actions41}){
  const u=CREDENTIALS[com];
  const total=leads.length;
  const donut=STATUSES.map(s=>({...s,count:leads.filter(l=>l.status===s.key).length}));
  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{...S.avatar,background:u.color,width:48,height:48,fontSize:20}}>{u.name[0]}</div>
          <div>
            <h1 style={{...S.pageTitle,color:u.color}}>{u.name}</h1>
            <span style={S.pageSub}>{proj.icon} {proj.name} · {total} leads</span>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[
          {label:"Total",value:total,color:u.color},
          {label:"Qualifiés",value:leads.filter(l=>l.status==="qualified").length,color:"#f59e0b"},
          {label:"RDV",value:leads.filter(l=>l.status==="rdv").length,color:"#8b5cf6"},
          {label:"Perdus",value:leads.filter(l=>l.status==="lost").length,color:"#ef4444"},
        ].map(k=>(
          <div key={k.label} style={{...S.kpi,borderTop:`3px solid ${k.color}`}}>
            <div style={{color:"#64748b",fontSize:9,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{k.label}</div>
            <div style={{color:k.color,fontSize:22,fontWeight:900,fontFamily:"Georgia,serif"}}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card,marginBottom:14}}>
        <div style={S.cardT}>Répartition</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Donut data={donut} total={total} size={130}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
            {donut.filter(d=>d.count>0).map(d=>(
              <div key={d.key}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:d.color}}/>
                    <span style={{color:"#94a3b8",fontSize:10}}>{d.label}</span>
                  </div>
                  <span style={{color:d.color,fontWeight:700,fontSize:10}}>{d.count} · {pct(d.count,total)}%</span>
                </div>
                <div style={{height:3,background:"#1e293b",borderRadius:2}}>
                  <div style={{height:"100%",width:`${pct(d.count,total)}%`,background:d.color,borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr style={S.thead}>
            <th style={S.th}>Lead</th><th style={S.th}>Budget</th><th style={S.th}>Statut</th><th style={S.th}>RDV</th><th style={S.th}>%</th><th style={S.th}></th>
          </tr></thead>
          <tbody>
            {leads.map(lead=>{
              const st=STATUSES.find(s=>s.key===lead.status);
              const ac=lead.actions?.length||0;
              return(
                <tr key={lead.id} style={S.tr}>
                  <td style={S.td}><div style={{fontWeight:700,color:"#f1f5f9",fontSize:12}}>{lead.nom}</div><div style={{fontSize:10,color:"#64748b"}}>{lead.tel}</div></td>
                  <td style={S.td}>{lead.budget&&<span style={{color:"#f59e0b",fontSize:10}}>💰 {lead.budget}</span>}</td>
                  <td style={S.td}><span style={{...S.badge2,background:st?.color+"22",color:st?.color,border:`1px solid ${st?.color}44`,fontSize:9}}>{st?.step}. {st?.label}</span></td>
                  <td style={S.td}>{lead.rdvDate?<span style={{color:"#8b5cf6",fontSize:10}}>📅 {lead.rdvDate}{lead.rdvTime?` ${lead.rdvTime}`:""}</span>:<span style={{color:"#334155",fontSize:10}}>—</span>}</td>
                  <td style={S.td}>
                    <div style={{display:"flex",alignItems:"center",gap:4,minWidth:60}}>
                      <div style={{flex:1,height:3,background:"#1e293b",borderRadius:2}}>
                        <div style={{height:"100%",width:`${ac/actions41.length*100}%`,background:u.color,borderRadius:2}}/>
                      </div>
                      <span style={{color:"#64748b",fontSize:9}}>{ac}/{actions41.length}</span>
                    </div>
                  </td>
                  <td style={S.td}><button onClick={()=>onSel(lead.id)} style={S.iconBtn}><Icon name="eye" size={12}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leads.length===0&&<div style={S.empty}>Aucun lead</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
function Settings({actions41,setAct,leads,setLeads,notify,project}){
  const [newA,setNewA]=useState("");
  const [imp,setImp]=useState("");
  const addA=()=>{if(!newA.trim())return;setAct(p=>[...p,newA.trim()]);setNewA("");notify("Action ajoutée");};
  const delA=i=>{setAct(p=>p.filter((_,idx)=>idx!==i));notify("Supprimée","err");};
  const doImp=()=>{
    try{
      const lines=imp.trim().split("\n").filter(Boolean);
      let zk=leads.filter(l=>l.assigned==="zakaria"&&l.project===project).length;
      let yn=leads.filter(l=>l.assigned==="yassine"&&l.project===project).length;
      const nl=lines.map(line=>{
        const p=line.split(",").map(x=>x.trim());
        const assigned=zk<=yn?"zakaria":"yassine";
        if(zk<=yn)zk++;else yn++;
        return{id:Date.now()+Math.random(),nom:p[0]||"—",tel:p[1]||"",email:p[2]||"",budget:p[3]||"Non défini",source:p[4]||"Autre",assigned,project,status:"new",createdAt:dAgo(0),rdvDate:"",rdvTime:"",actions:[]};
      });
      setLeads(p=>[...nl,...p]);setImp("");notify(`${nl.length} leads importés`);
    }catch{notify("Erreur","err");}
  };
  return(
    <div style={S.page}>
      <div style={S.pageHead}><h1 style={S.pageTitle}>Paramètres</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div style={S.card}>
          <div style={S.cardT}>Actions ({actions41.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10,maxHeight:250,overflowY:"auto"}}>
            {actions41.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 9px",background:"#0f172a",borderRadius:6}}>
                <span style={{color:"#6366f1",fontWeight:800,fontSize:10,width:18}}>{i+1}.</span>
                <span style={{flex:1,color:"#94a3b8",fontSize:11}}>{a}</span>
                <button onClick={()=>delA(i)} style={{color:"#ef4444",background:"none",border:"none",cursor:"pointer"}}><Icon name="x" size={11}/></button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7}}>
            <input value={newA} onChange={e=>setNewA(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addA()} placeholder="Nouvelle action..." style={S.input}/>
            <button onClick={addA} style={S.primaryBtn}><Icon name="plus" size={13}/></button>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardT}>Import CSV</div>
          <p style={{color:"#64748b",fontSize:10,marginBottom:8}}>Nom, Téléphone, Email, Budget, Source</p>
          <textarea value={imp} onChange={e=>setImp(e.target.value)}
            placeholder={"Ahmed, 0661111, ahmed@mail.com, 1M - 2M, Facebook\nSara, 0662222, sara@mail.com, 2M - 3M, TikTok"}
            style={{...S.input,height:100,resize:"vertical",fontFamily:"monospace",fontSize:10}}/>
          <button onClick={doImp} style={{...S.primaryBtn,marginTop:9,width:"100%",justifyContent:"center"}}>
            <Icon name="import" size={13}/> Importer
          </button>
        </div>
      </div>
      <div style={{...S.card,marginTop:16}}>
        <div style={S.cardT}><Icon name="key" size={11}/> Mots de passe</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
          {Object.entries(CREDENTIALS).map(([id,u])=>(
            <div key={id} style={{padding:"9px 12px",background:"#0f172a",borderRadius:7,borderLeft:`3px solid ${u.color}`}}>
              <div style={{color:u.color,fontWeight:700,fontSize:12}}>{u.name}</div>
              <div style={{color:"#64748b",fontFamily:"monospace",fontSize:11,marginTop:2}}>{u.pass}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LEAD MODAL
// ─────────────────────────────────────────────
function LeadModal({lead,user,actions41,onClose,onAdd,onToggle,onUpd,proj}){
  const [aType,setAT]=useState(ACT_TYPES[0]);
  const [aNote,setAN]=useState("");
  const [rdvDate,setRdvDate]=useState(lead.rdvDate||"");
  const [rdvTime,setRdvTime]=useState(lead.rdvTime||"");
  const ac=lead.actions?.length||0;

  const handleAdd=()=>{if(!aNote.trim())return;onAdd(lead.id,{type:aType,note:aNote});setAN("");};
  const saveRDV=()=>onUpd(lead.id,{rdvDate,rdvTime});
  const st=STATUSES.find(s=>s.key===lead.status);

  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <h2 style={{color:"#f1f5f9",margin:0,fontSize:17,fontFamily:"Georgia,serif"}}>{lead.nom}</h2>
            <div style={{fontSize:11,marginTop:2,display:"flex",alignItems:"center",gap:8}}>
              <a href={waLink(lead.tel, lead.nom)} target="_blank" rel="noreferrer"
                style={{color:"#25D366",textDecoration:"none",display:"flex",alignItems:"center",gap:4,fontWeight:600}}>
                <span style={{fontSize:14}}>💬</span> {lead.tel}
              </a>
              <span style={{color:"#64748b"}}>· {lead.email}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5,flexWrap:"wrap"}}>
              <SrcBadge src={lead.source}/>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:CREDENTIALS[lead.assigned]?.color}}/>
                <span style={{color:"#94a3b8",fontSize:10}}>{CREDENTIALS[lead.assigned]?.name}</span>
              </div>
              <span style={{color:proj.color,fontSize:10}}>{proj.icon} {proj.name}</span>
              {lead.status==="rdv"&&lead.budget&&<span style={{color:"#f59e0b",fontSize:10}}>💰 {lead.budget}</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <select value={lead.status} onChange={e=>onUpd(lead.id,{status:e.target.value})} style={{...S.input,width:"auto",padding:"5px 8px",fontSize:11}}>
              {STATUSES.map(s=><option key={s.key} value={s.key}>{s.step}. {s.label}</option>)}
            </select>
            <button onClick={onClose} style={{...S.iconBtn,color:"#ef4444"}}><Icon name="x" size={15}/></button>
          </div>
        </div>

        {/* Budget Field - editable by commercial */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 14px",background:"#0f172a",borderRadius:8,border:"1px solid #f59e0b33"}}>
          <span style={{color:"#f59e0b",fontSize:13}}>💰</span>
          <span style={{color:"#64748b",fontSize:11,minWidth:50}}>Budget:</span>
          <input
            type="text"
            value={lead.budget||""}
            onChange={e=>onUpd(lead.id,{budget:e.target.value})}
            placeholder="Ex: 1.5M, 2M-3M..."
            style={{...S.input,flex:1,padding:"5px 10px",fontSize:11,borderColor:"#f59e0b33",color:"#f59e0b"}}/>
        </div>

        {/* RDV Section */}
        {lead.status==="rdv"&&(
          <div style={{padding:"12px 14px",background:"#0f172a",borderRadius:9,border:"1px solid #8b5cf633",marginBottom:14}}>
            <div style={{color:"#8b5cf6",fontWeight:700,fontSize:11,marginBottom:8}}>📅 Planifier le RDV</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"flex-end"}}>
              <div>
                <label style={{color:"#64748b",fontSize:10,display:"block",marginBottom:4}}>Date</label>
                <input type="date" value={rdvDate} onChange={e=>setRdvDate(e.target.value)} style={{...S.input,fontSize:11}}/>
              </div>
              <div>
                <label style={{color:"#64748b",fontSize:10,display:"block",marginBottom:4}}>Heure</label>
                <input type="time" value={rdvTime} onChange={e=>setRdvTime(e.target.value)} style={{...S.input,fontSize:11}}/>
              </div>
              <button onClick={saveRDV} style={{...S.primaryBtn,background:"#8b5cf6",padding:"8px 14px"}}>Sauver</button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{color:"#94a3b8",fontSize:10}}>Progression</span>
            <span style={{color:proj.color,fontWeight:700,fontSize:10}}>{ac}/{actions41.length} · {Math.round(ac/actions41.length*100)}%</span>
          </div>
          <div style={{height:6,background:"#1e293b",borderRadius:3}}>
            <div style={{height:"100%",width:`${ac/actions41.length*100}%`,background:`linear-gradient(90deg,${proj.color},${proj.accent})`,borderRadius:3,transition:"width 0.5s"}}/>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          {STATUSES.map(s=>(
            <div key={s.key} style={{flex:1,height:4,borderRadius:2,background:s.key===lead.status?s.color:s.step<(st?.step||0)?s.color+"66":"#1e293b",transition:"background 0.3s"}}/>
          ))}
        </div>

        {/* Actions */}
        <div style={{...S.cardT,marginBottom:8}}>Actions ({ac})</div>
        <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:180,overflowY:"auto",marginBottom:12}}>
          {lead.actions?.map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:7,padding:"7px 9px",background:"#0f172a",borderRadius:6,border:`1px solid ${a.done?"#10b98133":"#1e293b"}`}}>
              <button onClick={()=>onToggle(lead.id,i)}
                style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${a.done?"#10b981":"#334155"}`,background:a.done?"#10b981":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                {a.done&&<Icon name="check" size={8}/>}
              </button>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:1}}>
                  <span style={{color:proj.color,fontWeight:800,fontSize:9}}>{i+1}.</span>
                  <span style={{color:"#f1f5f9",fontSize:11,fontWeight:600}}>{a.type}</span>
                  <span style={{color:"#64748b",fontSize:9}}>· {a.date}</span>
                  {a.done&&<span style={{color:"#10b981",fontSize:8,marginLeft:"auto"}}>✓</span>}
                </div>
                <div style={{color:"#64748b",fontSize:10}}>{a.note}</div>
              </div>
            </div>
          ))}
          {(!lead.actions||lead.actions.length===0)&&<div style={{color:"#64748b",textAlign:"center",padding:14,fontSize:11}}>Aucune action</div>}
        </div>

        {/* Add action */}
        <div style={{display:"flex",gap:6,paddingTop:10,borderTop:"1px solid #1e293b"}}>
          <select value={aType} onChange={e=>setAT(e.target.value)} style={{...S.input,width:"auto",padding:"6px 8px",fontSize:11}}>
            {ACT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <input value={aNote} onChange={e=>setAN(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            placeholder="Note..." style={{...S.input,flex:1,fontSize:11}}/>
          <button onClick={handleAdd} style={{...S.primaryBtn,background:`linear-gradient(135deg,${proj.color},${proj.accent})`}}><Icon name="plus" size={13}/></button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD LEAD MODAL
// ─────────────────────────────────────────────
function AddModal({onClose,onAdd,proj}){
  const [f,setF]=useState({nom:"",tel:"",email:"",budget:"Non défini",source:"Facebook"});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:440}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{color:"#f1f5f9",margin:0,fontSize:15}}>{proj.icon} Nouveau Lead — {proj.name}</h2>
          <button onClick={onClose} style={S.iconBtn}><Icon name="x" size={15}/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {[{l:"Nom Complet *",k:"nom",t:"text",p:"Ahmed Alami"},{l:"Téléphone *",k:"tel",t:"tel",p:"0661234567"},{l:"Email",k:"email",t:"email",p:"ahmed@gmail.com"}].map(x=>(
            <div key={x.k}>
              <label style={{color:"#64748b",fontSize:10,display:"block",marginBottom:4}}>{x.l}</label>
              <input type={x.t} value={f[x.k]} onChange={e=>set(x.k,e.target.value)} placeholder={x.p} style={S.input}/>
            </div>
          ))}
          <div>
            <label style={{color:"#64748b",fontSize:10,display:"block",marginBottom:4}}>💰 Budget</label>
            <select value={f.budget} onChange={e=>set("budget",e.target.value)} style={S.input}>
              {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{color:"#64748b",fontSize:10,display:"block",marginBottom:4}}>Source</label>
            <select value={f.source} onChange={e=>set("source",e.target.value)} style={S.input}>
              {SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{padding:"7px 11px",background:"#0f172a",borderRadius:6,borderLeft:`3px solid ${proj.color}`}}>
            <div style={{color:proj.color,fontSize:10,fontWeight:700}}>Distribution automatique 50/50</div>
          </div>
          <button onClick={()=>{if(!f.nom||!f.tel)return;onAdd(f);onClose();}}
            style={{...S.primaryBtn,width:"100%",justifyContent:"center",background:`linear-gradient(135deg,${proj.color},${proj.accent})`}}>
            <Icon name="plus" size={13}/> Ajouter le Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────
function SrcBadge({src}){
  const c={Facebook:"#3b82f6",TikTok:"#ec4899",LinkedIn:"#0ea5e9",Google:"#f59e0b","Site Web":"#10b981",Autre:"#64748b"}[src]||"#64748b";
  return <span style={{...S.badge2,background:c+"22",color:c,border:`1px solid ${c}44`,fontSize:9}}>{src}</span>;
}
function StPill({status,onChange}){
  const [open,setOpen]=useState(false);
  const st=STATUSES.find(s=>s.key===status)||STATUSES[0];
  return(
    <div style={{position:"relative",display:"inline-block"}} onClick={e=>{e.stopPropagation();e.preventDefault();}}>
      <button
        onMouseDown={e=>{e.stopPropagation();e.preventDefault();setOpen(o=>!o);}}
        style={{...S.badge2,background:st.color+"22",color:st.color,border:`1px solid ${st.color}44`,cursor:"pointer",fontSize:9,whiteSpace:"nowrap"}}>
        {st.step}. {st.label} ▾
      </button>
      {open&&(
        <>
          <div
            style={{position:"fixed",inset:0,zIndex:9}}
            onMouseDown={e=>{e.stopPropagation();setOpen(false);}}
          />
          <div style={{position:"absolute",top:"110%",left:0,zIndex:10,background:"#0a0f1e",border:"1px solid #334155",borderRadius:8,overflow:"hidden",minWidth:140,boxShadow:"0 8px 24px #0008"}}>
            {STATUSES.map(s=>(
              <button key={s.key}
                onMouseDown={e=>{e.stopPropagation();e.preventDefault();onChange(s.key);setOpen(false);}}
                style={{display:"block",width:"100%",padding:"8px 12px",background:s.key===status?"#1e293b22":"none",border:"none",color:s.color,cursor:"pointer",textAlign:"left",fontSize:10,fontWeight:s.key===status?700:400}}>
                {s.step}. {s.label} {s.key===status?"✓":""}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S={
  app:      {display:"flex",height:"100vh",background:"#0f172a",color:"#f1f5f9",fontFamily:"'DM Sans',-apple-system,sans-serif",overflow:"hidden"},
  sidebar:  {width:238,background:"#070d1a",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",padding:"16px 12px",flexShrink:0,overflowY:"auto"},
  logoWrap: {display:"flex",alignItems:"center",gap:9,marginBottom:14},
  logoBox:  {width:36,height:36,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  projSwitch:{display:"flex",flexDirection:"column",gap:4,marginBottom:12,padding:"8px",background:"#1e293b22",borderRadius:9,border:"1px solid #1e293b"},
  projBtn:  {display:"flex",alignItems:"center",gap:7,padding:"6px 9px",borderRadius:7,background:"none",border:"1px solid #1e293b",color:"#64748b",cursor:"pointer",fontSize:11},
  userCard: {display:"flex",alignItems:"center",gap:7,padding:"8px 9px",background:"#1e293b22",borderRadius:8,marginBottom:10,border:"1px solid #1e293b"},
  avatar:   {width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"white",flexShrink:0},
  filters:  {padding:"9px",background:"#1e293b22",borderRadius:8,border:"1px solid #1e293b",marginBottom:10},
  fLbl:     {color:"#64748b",fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:5},
  chip:     {padding:"2px 6px",borderRadius:5,background:"#1e293b",border:"1px solid #334155",color:"#64748b",cursor:"pointer",fontSize:9},
  navBtn:   {display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:6,background:"none",border:"none",color:"#64748b",cursor:"pointer",width:"100%",textAlign:"left",fontSize:11},
  nbadge:   {marginLeft:"auto",background:"#1e293b",color:"#94a3b8",fontSize:8,padding:"1px 5px",borderRadius:7},
  logout:   {display:"flex",alignItems:"center",gap:6,padding:"7px 9px",borderRadius:6,background:"none",border:"none",color:"#ef444488",cursor:"pointer",fontSize:11},
  main:     {flex:1,overflow:"auto",background:"#0f172a"},
  page:     {padding:22},
  pageHead: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18},
  pageTitle:{color:"#f1f5f9",fontSize:19,fontWeight:900,margin:0,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:8},
  pageSub:  {color:"#64748b",fontSize:10,marginTop:3,display:"block"},
  kpi:      {padding:"11px 13px",background:"#070d1a",borderRadius:9,border:"1px solid #1e293b"},
  card:     {padding:16,background:"#070d1a",borderRadius:9,border:"1px solid #1e293b"},
  cardT:    {color:"#94a3b8",fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:10,fontWeight:700,display:"flex",alignItems:"center",gap:5},
  filterBar:{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"},
  fBtn:     {padding:"4px 11px",borderRadius:16,background:"#070d1a",border:"1px solid #1e293b",color:"#64748b",cursor:"pointer",fontSize:10},
  fBtnOn:   {background:"#6366f122",color:"#6366f1",borderColor:"#6366f1"},
  tableWrap:{background:"#070d1a",borderRadius:9,border:"1px solid #1e293b",overflow:"hidden"},
  table:    {width:"100%",borderCollapse:"collapse"},
  thead:    {background:"#0a0f1e"},
  th:       {padding:"8px 11px",color:"#64748b",fontSize:8,textTransform:"uppercase",letterSpacing:1,textAlign:"left",fontWeight:700},
  tr:       {borderTop:"1px solid #1e293b",cursor:"pointer"},
  td:       {padding:"9px 11px",verticalAlign:"middle"},
  badge2:   {display:"inline-block",padding:"2px 7px",borderRadius:16,fontSize:10,fontWeight:600},
  empty:    {textAlign:"center",color:"#64748b",padding:28,fontSize:11},
  primaryBtn:{display:"flex",alignItems:"center",gap:6,padding:"7px 15px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:8,color:"white",cursor:"pointer",fontSize:11,fontWeight:700},
  iconBtn:  {padding:"5px",background:"#1e293b",border:"none",borderRadius:4,color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center"},
  input:    {width:"100%",padding:"7px 10px",background:"#1e293b",border:"1px solid #334155",borderRadius:6,color:"#f1f5f9",fontSize:12,boxSizing:"border-box",outline:"none"},
  overlay:  {position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16},
  modal:    {background:"#070d1a",borderRadius:13,border:"1px solid #1e293b",padding:20,width:"100%",maxWidth:640,maxHeight:"92vh",overflowY:"auto"},
  toast:    {position:"fixed",top:16,right:16,padding:"9px 15px",borderRadius:8,color:"white",fontWeight:700,fontSize:11,zIndex:999,boxShadow:"0 8px 24px #0008"},
  loginBg:  {minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 30% 50%,#0f172a 0%,#070d1a 100%)"},
  loginCard:{background:"#070d1a",border:"1px solid #1e293b",borderRadius:16,padding:38,width:380,boxShadow:"0 32px 80px #0009"},
  loginBtn: {display:"flex",alignItems:"center",gap:11,padding:"11px 13px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:9,cursor:"pointer",width:"100%",textAlign:"left"},
};
