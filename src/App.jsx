import { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────
// CREDENTIALS
// ─────────────────────────────────────────────
const CREDENTIALS = {
  mohamed: "Mohamed123",
  zakaria: "Zakaria123",
  yassine: "Yassine123",
};

const USERS = {
  mohamed: { id: "mohamed", name: "Mohamed", role: "admin", color: "#10b981" },
  zakaria: { id: "zakaria", name: "Zakaria", role: "commercial", color: "#6366f1" },
  yassine: { id: "yassine", name: "Yassine", role: "commercial", color: "#f59e0b" },
};

const DEFAULT_ACTIONS = [
  "WhatsApp Message","Appel Normal","SMS","Email","WhatsApp Appel",
  "Rendez-vous Planifié","Rendez-vous Confirmé","Visite Site",
  "Proposition Envoyée","Négociation","Réservation / Parapha",
];

const STATUSES = [
  { key: "new",       label: "Nouveau",   color: "#64748b" },
  { key: "qualified", label: "Qualifié",  color: "#f59e0b" },
  { key: "confirmed", label: "Confirmé",  color: "#3b82f6" },
  { key: "rdv",       label: "RDV",       color: "#8b5cf6" },
  { key: "parapha",   label: "Parapha",   color: "#10b981" },
  { key: "lost",      label: "Perdu",     color: "#ef4444" },
];

const SOURCES = ["Facebook","TikTok","LinkedIn","Google","Autre"];
const ACTION_TYPES = ["WhatsApp","Appel","SMS","Email","RDV","Visite","Autre"];
const DATE_RANGES = [
  { key:"all", label:"Tout" },{ key:"4", label:"4 jours" },{ key:"7", label:"7 jours" },
  { key:"15", label:"15 jours" },{ key:"30", label:"30 jours" },{ key:"90", label:"3 mois" },
];

const today = new Date();
const daysAgo = (n) => new Date(today - n*864e5).toISOString().split("T")[0];

const DEMO_LEADS = [
  { id:1,  nom:"Karim Bennani",   tel:"0661234567", email:"karim@gmail.com",   source:"Facebook", assigned:"zakaria", status:"qualified", createdAt:daysAgo(2),  actions:[{type:"WhatsApp",note:"Premier contact",date:daysAgo(2),done:true},{type:"Appel",note:"Intéressé villa T4",date:daysAgo(1),done:true}] },
  { id:2,  nom:"Salma Idrissi",   tel:"0662345678", email:"salma@gmail.com",   source:"TikTok",   assigned:"yassine", status:"rdv",       createdAt:daysAgo(3),  actions:[{type:"WhatsApp",note:"Contact initial",date:daysAgo(3),done:true},{type:"RDV",note:"Visite samedi 10h",date:daysAgo(1),done:false}] },
  { id:3,  nom:"Hassan Tazi",     tel:"0663456789", email:"hassan@gmail.com",  source:"LinkedIn", assigned:"zakaria", status:"confirmed",  createdAt:daysAgo(5),  actions:[{type:"Email",note:"Envoi brochure",date:daysAgo(5),done:true}] },
  { id:4,  nom:"Nadia Ouali",     tel:"0664567890", email:"nadia@gmail.com",   source:"Facebook", assigned:"yassine", status:"new",        createdAt:daysAgo(1),  actions:[] },
  { id:5,  nom:"Omar Chraibi",    tel:"0665678901", email:"omar@gmail.com",    source:"Google",   assigned:"zakaria", status:"parapha",    createdAt:daysAgo(20), actions:[{type:"WhatsApp",note:"Suivi",date:daysAgo(20),done:true},{type:"Appel",note:"Très intéressé",date:daysAgo(18),done:true},{type:"RDV",note:"Visite confirmée",date:daysAgo(15),done:true},{type:"Visite",note:"Visite effectuée",date:daysAgo(12),done:true},{type:"RDV",note:"2ème RDV signature",date:daysAgo(8),done:true}] },
  { id:6,  nom:"Fatima Berrada",  tel:"0666789012", email:"fatima@gmail.com",  source:"TikTok",   assigned:"yassine", status:"qualified",  createdAt:daysAgo(6),  actions:[{type:"SMS",note:"Envoi info",date:daysAgo(6),done:true}] },
  { id:7,  nom:"Youssef Amrani",  tel:"0667890123", email:"youssef@gmail.com", source:"Facebook", assigned:"zakaria", status:"new",        createdAt:daysAgo(1),  actions:[] },
  { id:8,  nom:"Zineb Moussaoui", tel:"0668901234", email:"zineb@gmail.com",   source:"TikTok",   assigned:"yassine", status:"confirmed",  createdAt:daysAgo(10), actions:[{type:"WhatsApp",note:"Contact",date:daysAgo(10),done:true},{type:"Email",note:"Brochure envoyée",date:daysAgo(8),done:true}] },
  { id:9,  nom:"Rachid Filali",   tel:"0669012345", email:"rachid@gmail.com",  source:"LinkedIn", assigned:"zakaria", status:"qualified",  createdAt:daysAgo(4),  actions:[{type:"Appel",note:"Intéressé",date:daysAgo(4),done:true}] },
  { id:10, nom:"Houda Lahlou",    tel:"0660123456", email:"houda@gmail.com",   source:"Facebook", assigned:"yassine", status:"lost",       createdAt:daysAgo(25), actions:[{type:"WhatsApp",note:"Pas de réponse",date:daysAgo(25),done:true},{type:"SMS",note:"Relance",date:daysAgo(20),done:true}] },
];

const store = {
  get: (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch { return d; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} },
};

function filterByDate(leads, range) {
  if (range==="all") return leads;
  const cutoff = new Date(today - parseInt(range)*864e5);
  return leads.filter(l => new Date(l.createdAt) >= cutoff);
}
function pct(n,total) { return total ? Math.round(n/total*100) : 0; }

// ── ICONS ──
const paths = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus:"M12 5v14M5 12h14", check:"M20 6L9 17l-5-5", x:"M18 6L6 18M6 6l12 12",
  trash:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2", lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  calendar:"M3 4h18v18H3z M16 2v4M8 2v4M3 10h18", filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  import:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  key:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  chart:"M18 20V10M12 20V4M6 20v-6",
};
function Icon({ name, size=16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(paths[name]||"").split(" M").map((d,i) => <path key={i} d={i===0?d:"M"+d} />)}
    </svg>
  );
}

// ── DONUT ──
function DonutChart({ data, total, size=160 }) {
  const r=58,cx=80,cy=80,circ=2*Math.PI*r;
  let off=0;
  const slices = data.filter(d=>d.count>0).map(d=>{
    const s={...d,dash:d.count/(total||1)*circ,gap:(1-d.count/(total||1))*circ,offset:off};
    off+=s.dash; return s;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="20"/>
      {slices.map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="20"
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset}
          style={{transform:"rotate(-90deg)",transformOrigin:"80px 80px",transition:"stroke-dasharray 0.8s"}}/>
      ))}
      <text x={cx} y={cy-6} textAnchor="middle" fill="#f1f5f9" fontSize="22" fontWeight="800" fontFamily="Georgia,serif">{total}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill="#64748b" fontSize="10">LEADS</text>
    </svg>
  );
}

// ── BAR CHART ──
function BarChart({ data, color="#6366f1" }) {
  const max=Math.max(...data.map(d=>d.value),1);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{color:"#94a3b8",fontSize:10,fontWeight:700}}>{d.value||""}</span>
          <div style={{width:"100%",background:"#1e293b",borderRadius:"4px 4px 0 0",height:56,display:"flex",alignItems:"flex-end"}}>
            <div style={{width:"100%",background:color,borderRadius:"4px 4px 0 0",height:`${d.value/max*100}%`,transition:"height 0.8s",minHeight:d.value>0?4:0}}/>
          </div>
          <span style={{color:"#64748b",fontSize:9,textAlign:"center",lineHeight:1.2}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── RING ──
function RingMeter({ value, max, color, label, sublabel }) {
  const r=36,circ=2*Math.PI*r,fill=(value/(max||1))*circ;
  return (
    <div style={{textAlign:"center"}}>
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={r} fill="none" stroke="#1e293b" strokeWidth="8"/>
        <circle cx={45} cy={45} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${circ-fill}`} strokeDashoffset={circ/4}
          style={{transition:"stroke-dasharray 0.8s"}} strokeLinecap="round"/>
        <text x={45} y={49} textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="800" fontFamily="Georgia,serif">{value}</text>
      </svg>
      <div style={{color:"#f1f5f9",fontSize:13,fontWeight:700,marginTop:4}}>{label}</div>
      {sublabel&&<div style={{color:"#64748b",fontSize:11}}>{sublabel}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// APP
// ────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [leads, setLeads]             = useState(()=>store.get("crm41_leads",DEMO_LEADS));
  const [actions41, setActions41]     = useState(()=>store.get("crm41_actions",DEFAULT_ACTIONS));
  const [view, setView]               = useState("dashboard");
  const [selectedId, setSelectedId]   = useState(null);
  const [showAdd, setShowAdd]         = useState(false);
  const [toast, setToast]             = useState(null);
  const [dateRange, setDateRange]     = useState("all");
  const [comFocus, setComFocus]       = useState("both");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(()=>{ store.set("crm41_leads",leads); },[leads]);
  useEffect(()=>{ store.set("crm41_actions",actions41); },[actions41]);

  const notify = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const myLeads = useMemo(()=>{
    let base = currentUser?.role==="commercial"
      ? leads.filter(l=>l.assigned===currentUser.id)
      : leads;
    if (currentUser?.role==="admin" && comFocus!=="both") base=base.filter(l=>l.assigned===comFocus);
    base = filterByDate(base, dateRange);
    if (statusFilter!=="all") base=base.filter(l=>l.status===statusFilter);
    return base;
  },[leads,currentUser,dateRange,comFocus,statusFilter]);

  const addLead = (data) => {
    const zk=leads.filter(l=>l.assigned==="zakaria").length;
    const yn=leads.filter(l=>l.assigned==="yassine").length;
    const assigned=zk<=yn?"zakaria":"yassine";
    setLeads(p=>[{...data,id:Date.now(),assigned,status:"new",createdAt:daysAgo(0),actions:[]},...p]);
    notify("Lead ajouté → "+USERS[assigned].name);
  };
  const updateLead = (id,patch) => setLeads(p=>p.map(l=>l.id===id?{...l,...patch}:l));
  const deleteLead = (id) => { setLeads(p=>p.filter(l=>l.id!==id)); notify("Lead supprimé","err"); };
  const addAction  = (lid,act) => setLeads(p=>p.map(l=>l.id===lid?{...l,actions:[...(l.actions||[]),{...act,date:daysAgo(0),done:false}]}:l));
  const toggleAct  = (lid,idx) => setLeads(p=>p.map(l=>l.id===lid?{...l,actions:l.actions.map((a,i)=>i===idx?{...a,done:!a.done}:a)}:l));

  const selectedLead = leads.find(l=>l.id===selectedId);

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;

  const navItems=[
    {key:"dashboard",icon:"home",label:"Dashboard"},
    {key:"leads",icon:"users",label:currentUser.role==="admin"?"Tous les Leads":"Mes Leads"},
    ...(currentUser.role==="admin"?[
      {key:"zakaria",icon:"activity",label:"Zakaria"},
      {key:"yassine",icon:"activity",label:"Yassine"},
      {key:"settings",icon:"settings",label:"Paramètres"},
    ]:[]),
  ];

  return (
    <div style={S.app}>
      {toast&&<div style={{...S.toast,background:toast.type==="err"?"#ef4444":"#10b981"}}>{toast.msg}</div>}

      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoBox}>41</div>
          <div><div style={S.logoName}>VILLAS</div><div style={S.logoSub}>CRM Platform</div></div>
        </div>

        <div style={S.userCard}>
          <div style={{...S.avatar,background:USERS[currentUser.id].color}}>{currentUser.name[0]}</div>
          <div>
            <div style={{color:"#f1f5f9",fontWeight:700,fontSize:14}}>{currentUser.name}</div>
            <div style={{color:"#64748b",fontSize:11}}>{currentUser.role==="admin"?"Administrateur":"Commercial"}</div>
          </div>
        </div>

        {currentUser.role==="admin"&&(
          <div style={S.sideFilter}>
            <div style={S.sfLabel}><Icon name="calendar" size={11}/> Période</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {DATE_RANGES.map(d=>(
                <button key={d.key} onClick={()=>setDateRange(d.key)}
                  style={{...S.chip,...(dateRange===d.key?S.chipOn:{})}}>{d.label}</button>
              ))}
            </div>
            <div style={{...S.sfLabel,marginTop:10}}><Icon name="filter" size={11}/> Commercial</div>
            <div style={{display:"flex",gap:4}}>
              {[["both","Les deux"],["zakaria","Zakaria"],["yassine","Yassine"]].map(([k,l])=>(
                <button key={k} onClick={()=>setComFocus(k)}
                  style={{...S.chip,...(comFocus===k?{...S.chipOn,borderColor:k==="zakaria"?"#6366f1":k==="yassine"?"#f59e0b":"#10b981",color:k==="zakaria"?"#6366f1":k==="yassine"?"#f59e0b":"#10b981"}:{})}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
          {navItems.map(n=>(
            <button key={n.key} onClick={()=>setView(n.key)}
              style={{...S.navBtn,...(view===n.key?S.navOn:{})}}>
              <Icon name={n.icon} size={15}/>
              <span>{n.label}</span>
              {(n.key==="zakaria"||n.key==="yassine")&&(
                <span style={S.navBadge}>{leads.filter(l=>l.assigned===n.key).length}</span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={()=>setCurrentUser(null)} style={S.logoutBtn}>
          <Icon name="logout" size={14}/><span>Déconnexion</span>
        </button>
      </aside>

      <main style={S.main}>
        {view==="dashboard"&&(
          <DashboardView leads={myLeads} allLeads={leads} currentUser={currentUser}
            dateRange={dateRange} comFocus={comFocus} actions41={actions41}/>
        )}
        {view==="leads"&&(
          <LeadsView leads={myLeads} currentUser={currentUser}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            onAdd={()=>setShowAdd(true)} onSelect={setSelectedId}
            onDelete={deleteLead} onUpdate={updateLead} actions41={actions41}/>
        )}
        {(view==="zakaria"||view==="yassine")&&currentUser.role==="admin"&&(
          <CommercialView commercial={USERS[view]}
            leads={filterByDate(leads.filter(l=>l.assigned===view),dateRange)}
            onSelect={setSelectedId} actions41={actions41}/>
        )}
        {view==="settings"&&currentUser.role==="admin"&&(
          <SettingsView actions41={actions41} setActions41={setActions41}
            leads={leads} setLeads={setLeads} notify={notify}/>
        )}
      </main>

      {showAdd&&<AddLeadModal onClose={()=>setShowAdd(false)} onAdd={addLead}/>}
      {selectedLead&&(
        <LeadModal lead={selectedLead} currentUser={currentUser} actions41={actions41}
          onClose={()=>setSelectedId(null)}
          onAddAction={addAction} onToggle={toggleAct} onUpdate={updateLead}/>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// LOGIN
// ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel,setSel]=useState(null);
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");

  const submit=()=>{
    if (CREDENTIALS[sel]===pwd) onLogin(USERS[sel]);
    else { setErr("Mot de passe incorrect"); setTimeout(()=>setErr(""),2000); }
  };

  return (
    <div style={S.loginBg}>
      <div style={S.loginCard}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:8}}>
          <div style={S.logoBox}>41</div>
          <div style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:4}}>VILLAS</div>
        </div>
        <p style={{color:"#64748b",fontSize:13,marginBottom:32,textAlign:"center"}}>CRM — Gestion des Leads Immobiliers</p>

        {!sel?(
          <>
            <p style={{color:"#94a3b8",fontSize:12,marginBottom:12,textAlign:"center"}}>Choisissez votre profil</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.values(USERS).map(u=>(
                <button key={u.id} onClick={()=>setSel(u.id)}
                  style={{...S.loginUserBtn,borderColor:u.color+"66"}}>
                  <div style={{...S.avatar,background:u.color,width:40,height:40,fontSize:18}}>{u.name[0]}</div>
                  <div style={{textAlign:"left"}}>
                    <div style={{color:"#f1f5f9",fontWeight:700}}>{u.name}</div>
                    <div style={{color:"#64748b",fontSize:11}}>{u.role==="admin"?"Administrateur":"Commercial"}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ):(
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <div style={{...S.avatar,background:USERS[sel].color,width:44,height:44,fontSize:20}}>{USERS[sel].name[0]}</div>
              <div>
                <div style={{color:"#f1f5f9",fontWeight:700,fontSize:16}}>{USERS[sel].name}</div>
                <button onClick={()=>{setSel(null);setPwd("");}} style={{color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontSize:12}}>← Changer</button>
              </div>
            </div>
            <label style={{color:"#64748b",fontSize:12,display:"block",marginBottom:6}}>Mot de passe</label>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              placeholder="Entrez votre mot de passe"
              style={{...S.input,marginBottom:8}} autoFocus/>
            {err&&<div style={{color:"#ef4444",fontSize:12,marginBottom:8}}>{err}</div>}
            <button onClick={submit} style={{...S.primaryBtn,width:"100%",justifyContent:"center"}}>Connexion</button>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────────────────────
function DashboardView({ leads, allLeads, currentUser, dateRange, comFocus, actions41 }) {
  const isAdmin=currentUser.role==="admin";
  const total=leads.length;
  const donutData=STATUSES.map(s=>({...s,count:leads.filter(l=>l.status===s.key).length}));
  const zkLeads=filterByDate(allLeads.filter(l=>l.assigned==="zakaria"),dateRange);
  const ynLeads=filterByDate(allLeads.filter(l=>l.assigned==="yassine"),dateRange);
  const sourceBar=SOURCES.map(s=>({label:s,value:leads.filter(l=>l.source===s).length}));
  const funnel=STATUSES.map(s=>({...s,count:leads.filter(l=>l.status===s.key).length,pct:pct(leads.filter(l=>l.status===s.key).length,total)}));

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <div>
          <h1 style={S.pageTitle}>Dashboard</h1>
          <span style={S.pageSub}>
            {dateRange!=="all"?`Derniers ${dateRange} jours · `:""}
            {isAdmin&&comFocus!=="both"?USERS[comFocus].name+" · ":""}
            {total} leads
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:22}}>
        {STATUSES.map(s=>{
          const cnt=leads.filter(l=>l.status===s.key).length;
          return (
            <div key={s.key} style={{...S.kpi,borderTop:`3px solid ${s.color}`}}>
              <div style={{color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.label}</div>
              <div style={{color:s.color,fontSize:26,fontWeight:900,fontFamily:"Georgia,serif"}}>{cnt}</div>
              <div style={{color:"#334155",fontSize:11}}>{pct(cnt,total)}%</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isAdmin?"1.2fr 1fr 1fr":"1.2fr 1fr",gap:18,marginBottom:18}}>
        {/* Donut */}
        <div style={S.card}>
          <div style={S.cardTitle}>Répartition des Statuts</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <DonutChart data={donutData} total={total} size={160}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
              {donutData.filter(d=>d.count>0).map(d=>(
                <div key={d.key}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                      <span style={{color:"#94a3b8",fontSize:12}}>{d.label}</span>
                    </div>
                    <span style={{color:d.color,fontWeight:700,fontSize:12}}>{d.count} · {pct(d.count,total)}%</span>
                  </div>
                  <div style={{height:5,background:"#1e293b",borderRadius:3}}>
                    <div style={{height:"100%",width:`${pct(d.count,total)}%`,background:d.color,borderRadius:3,transition:"width 0.8s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar source */}
        <div style={S.card}>
          <div style={S.cardTitle}>Sources des Leads</div>
          <BarChart data={sourceBar} color="#6366f1"/>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:12}}>
            {sourceBar.filter(s=>s.value>0).map((s,i)=>{
              const cols=["#6366f1","#f59e0b","#10b981","#3b82f6","#64748b"];
              return (
                <div key={s.label} style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:2,background:cols[i%5]}}/>
                    <span style={{color:"#94a3b8",fontSize:12}}>{s.label}</span>
                  </div>
                  <span style={{color:cols[i%5],fontWeight:700,fontSize:12}}>{pct(s.value,total)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commerciaux */}
        {isAdmin&&(
          <div style={S.card}>
            <div style={S.cardTitle}>Commerciaux</div>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:18}}>
              {[{u:USERS.zakaria,ls:zkLeads},{u:USERS.yassine,ls:ynLeads}].map(({u,ls})=>(
                <RingMeter key={u.id} value={ls.length} max={allLeads.length} color={u.color}
                  label={u.name} sublabel={`${ls.filter(l=>l.status==="parapha").length} paraphas`}/>
              ))}
            </div>
            {STATUSES.map(s=>{
              const zk=zkLeads.filter(l=>l.status===s.key).length;
              const yn=ynLeads.filter(l=>l.status===s.key).length;
              if (!zk&&!yn) return null;
              return (
                <div key={s.key} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:"#64748b",fontSize:11}}>{s.label}</span>
                    <span style={{fontSize:11}}>
                      <span style={{color:USERS.zakaria.color}}>{zk}</span>
                      {" vs "}
                      <span style={{color:USERS.yassine.color}}>{yn}</span>
                    </span>
                  </div>
                  <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",gap:1}}>
                    <div style={{flex:zk||0.01,background:USERS.zakaria.color,transition:"flex 0.8s"}}/>
                    <div style={{flex:yn||0.01,background:USERS.yassine.color,transition:"flex 0.8s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Funnel */}
      <div style={S.card}>
        <div style={S.cardTitle}>Entonnoir de Conversion</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100}}>
          {funnel.map(s=>(
            <div key={s.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{color:s.color,fontSize:12,fontWeight:700}}>{s.pct}%</span>
              <div style={{width:"100%",background:"#1e293b",borderRadius:"4px 4px 0 0",height:68,display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",background:s.color+"bb",borderRadius:"4px 4px 0 0",height:`${s.pct||2}%`,transition:"height 0.8s",minHeight:s.count>0?4:0}}/>
              </div>
              <span style={{color:"#64748b",fontSize:10,textAlign:"center"}}>{s.label}</span>
              <span style={{color:s.color,fontSize:13,fontWeight:800}}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// LEADS VIEW
// ────────────────────────────────────────────────────────────
function LeadsView({ leads, currentUser, statusFilter, setStatusFilter, onAdd, onSelect, onDelete, onUpdate, actions41 }) {
  const isAdmin=currentUser.role==="admin";
  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <div>
          <h1 style={S.pageTitle}>{isAdmin?"Tous les Leads":`Leads de ${currentUser.name}`}</h1>
          <span style={S.pageSub}>{leads.length} lead(s)</span>
        </div>
        <button onClick={onAdd} style={S.primaryBtn}><Icon name="plus" size={14}/> Nouveau Lead</button>
      </div>

      <div style={S.filterBar}>
        <button onClick={()=>setStatusFilter("all")} style={{...S.filterBtn,...(statusFilter==="all"?S.filterOn:{})}}>Tous</button>
        {STATUSES.map(s=>(
          <button key={s.key} onClick={()=>setStatusFilter(s.key)}
            style={{...S.filterBtn,...(statusFilter===s.key?{...S.filterOn,borderColor:s.color,color:s.color}:{})}}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr style={S.thead}>
            <th style={S.th}>Lead</th>
            <th style={S.th}>Source</th>
            {isAdmin&&<th style={S.th}>Assigné</th>}
            <th style={S.th}>Statut</th>
            <th style={S.th}>Actions</th>
            <th style={S.th}>Progression</th>
            <th style={S.th}></th>
          </tr></thead>
          <tbody>
            {leads.map(lead=>{
              const st=STATUSES.find(s=>s.key===lead.status);
              const actCnt=lead.actions?.length||0;
              return (
                <tr key={lead.id} style={S.tr} onClick={()=>onSelect(lead.id)}>
                  <td style={S.td}>
                    <div style={{fontWeight:700,color:"#f1f5f9"}}>{lead.nom}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{lead.tel} · {lead.email}</div>
                    <div style={{fontSize:10,color:"#334155",marginTop:2}}>{lead.createdAt}</div>
                  </td>
                  <td style={S.td}><SrcBadge src={lead.source}/></td>
                  {isAdmin&&(
                    <td style={S.td}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:USERS[lead.assigned]?.color}}/>
                        <span style={{color:"#94a3b8",fontSize:13}}>{USERS[lead.assigned]?.name}</span>
                      </div>
                    </td>
                  )}
                  <td style={S.td}>
                    <StatusPill status={lead.status} onChange={val=>onUpdate(lead.id,{status:val})}/>
                  </td>
                  <td style={S.td}><span style={{color:"#94a3b8",fontSize:13}}>{actCnt}/{actions41.length}</span></td>
                  <td style={S.td}>
                    <div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}>
                      <div style={{flex:1,height:5,background:"#1e293b",borderRadius:3}}>
                        <div style={{height:"100%",width:`${actCnt/actions41.length*100}%`,background:"#6366f1",borderRadius:3}}/>
                      </div>
                      <span style={{color:"#64748b",fontSize:11}}>{Math.round(actCnt/actions41.length*100)}%</span>
                    </div>
                  </td>
                  <td style={S.td} onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>onSelect(lead.id)} style={S.iconBtn}><Icon name="eye" size={13}/></button>
                      <button onClick={()=>onDelete(lead.id)} style={{...S.iconBtn,color:"#ef4444"}}><Icon name="trash" size={13}/></button>
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

// ────────────────────────────────────────────────────────────
// COMMERCIAL VIEW
// ────────────────────────────────────────────────────────────
function CommercialView({ commercial, leads, onSelect, actions41 }) {
  const total=leads.length;
  const donutData=STATUSES.map(s=>({...s,count:leads.filter(l=>l.status===s.key).length}));
  const sourceBar=SOURCES.map(s=>({label:s,value:leads.filter(l=>l.source===s).length}));
  const actDone=leads.reduce((a,l)=>a+(l.actions?.filter(x=>x.done).length||0),0);
  const actTotal=leads.reduce((a,l)=>a+(l.actions?.length||0),0);

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{...S.avatar,background:commercial.color,width:52,height:52,fontSize:22}}>{commercial.name[0]}</div>
          <div>
            <h1 style={S.pageTitle}>{commercial.name}</h1>
            <span style={S.pageSub}>{total} leads assignés</span>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        {[
          {label:"Total",value:total,color:commercial.color},
          {label:"Qualifiés",value:leads.filter(l=>l.status==="qualified").length,color:"#f59e0b"},
          {label:"Paraphas",value:leads.filter(l=>l.status==="parapha").length,color:"#10b981"},
          {label:"Actions",value:`${actDone}/${actTotal}`,color:"#8b5cf6"},
        ].map(k=>(
          <div key={k.label} style={{...S.kpi,borderTop:`3px solid ${k.color}`}}>
            <div style={{color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
            <div style={{color:k.color,fontSize:26,fontWeight:900,fontFamily:"Georgia,serif"}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:18,marginBottom:18}}>
        <div style={S.card}>
          <div style={S.cardTitle}>Statuts</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <DonutChart data={donutData} total={total} size={140}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
              {donutData.filter(d=>d.count>0).map(d=>(
                <div key={d.key}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                      <span style={{color:"#94a3b8",fontSize:12}}>{d.label}</span>
                    </div>
                    <span style={{color:d.color,fontWeight:700,fontSize:12}}>{d.count} · {pct(d.count,total)}%</span>
                  </div>
                  <div style={{height:5,background:"#1e293b",borderRadius:3}}>
                    <div style={{height:"100%",width:`${pct(d.count,total)}%`,background:d.color,borderRadius:3,transition:"width 0.8s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Sources</div>
          <BarChart data={sourceBar} color={commercial.color}/>
        </div>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr style={S.thead}>
            <th style={S.th}>Lead</th>
            <th style={S.th}>Source</th>
            <th style={S.th}>Statut</th>
            <th style={S.th}>Actions</th>
            <th style={S.th}>Progression</th>
            <th style={S.th}></th>
          </tr></thead>
          <tbody>
            {leads.map(lead=>{
              const st=STATUSES.find(s=>s.key===lead.status);
              const tot=lead.actions?.length||0;
              return (
                <tr key={lead.id} style={S.tr}>
                  <td style={S.td}>
                    <div style={{fontWeight:700,color:"#f1f5f9"}}>{lead.nom}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{lead.tel}</div>
                  </td>
                  <td style={S.td}><SrcBadge src={lead.source}/></td>
                  <td style={S.td}>
                    <span style={{...S.badge,background:st?.color+"22",color:st?.color,border:`1px solid ${st?.color}44`}}>{st?.label}</span>
                  </td>
                  <td style={S.td}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {lead.actions?.slice(0,5).map((a,i)=>(
                        <span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:a.done?"#10b98122":"#1e293b",color:a.done?"#10b981":"#64748b",border:`1px solid ${a.done?"#10b98144":"#334155"}`}}>{a.type}</span>
                      ))}
                      {(lead.actions?.length||0)>5&&<span style={{fontSize:10,color:"#64748b"}}>+{lead.actions.length-5}</span>}
                    </div>
                  </td>
                  <td style={S.td}>
                    <div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}>
                      <div style={{flex:1,height:5,background:"#1e293b",borderRadius:3}}>
                        <div style={{height:"100%",width:`${tot/actions41.length*100}%`,background:commercial.color,borderRadius:3}}/>
                      </div>
                      <span style={{color:"#64748b",fontSize:11}}>{tot}/{actions41.length}</span>
                    </div>
                  </td>
                  <td style={S.td}>
                    <button onClick={()=>onSelect(lead.id)} style={S.iconBtn}><Icon name="eye" size={13}/></button>
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

// ────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────
function SettingsView({ actions41, setActions41, leads, setLeads, notify }) {
  const [newAct,setNewAct]=useState("");
  const [imp,setImp]=useState("");

  const addAct=()=>{ if(!newAct.trim())return; setActions41(p=>[...p,newAct.trim()]); setNewAct(""); notify("Action ajoutée"); };
  const delAct=i=>{ setActions41(p=>p.filter((_,idx)=>idx!==i)); notify("Action supprimée","err"); };

  const doImport=()=>{
    try {
      const lines=imp.trim().split("\n").filter(Boolean);
      let zk=leads.filter(l=>l.assigned==="zakaria").length;
      let yn=leads.filter(l=>l.assigned==="yassine").length;
      const nl=lines.map(line=>{
        const p=line.split(",").map(x=>x.trim());
        const assigned=zk<=yn?"zakaria":"yassine";
        if(zk<=yn)zk++;else yn++;
        return {id:Date.now()+Math.random(),nom:p[0]||"—",tel:p[1]||"",email:p[2]||"",source:p[3]||"Autre",assigned,status:"new",createdAt:daysAgo(0),actions:[]};
      });
      setLeads(p=>[...nl,...p]);
      setImp(""); notify(`${nl.length} leads importés 50/50`);
    } catch { notify("Erreur import","err"); }
  };

  return (
    <div style={S.page}>
      <div style={S.pageHead}><h1 style={S.pageTitle}>Paramètres</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
        <div style={S.card}>
          <div style={S.cardTitle}>Actions de suivi ({actions41.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14,maxHeight:280,overflowY:"auto"}}>
            {actions41.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#0f172a",borderRadius:8}}>
                <span style={{color:"#6366f1",fontWeight:800,fontSize:12,width:22}}>{i+1}.</span>
                <span style={{flex:1,color:"#94a3b8",fontSize:13}}>{a}</span>
                <button onClick={()=>delAct(i)} style={{color:"#ef4444",background:"none",border:"none",cursor:"pointer"}}><Icon name="x" size={13}/></button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newAct} onChange={e=>setNewAct(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAct()} placeholder="Nouvelle action..." style={S.input}/>
            <button onClick={addAct} style={S.primaryBtn}><Icon name="plus" size={14}/></button>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Import Leads CSV</div>
          <p style={{color:"#64748b",fontSize:12,marginBottom:12}}>Format: <code style={{color:"#6366f1"}}>Nom, Téléphone, Email, Source</code><br/>Distribution 50/50 automatique.</p>
          <textarea value={imp} onChange={e=>setImp(e.target.value)}
            placeholder={"Ahmed Alami, 0661234567, ahmed@gmail.com, Facebook\nSarah Benali, 0662345678, sarah@gmail.com, TikTok"}
            style={{...S.input,height:120,resize:"vertical",fontFamily:"monospace",fontSize:12}}/>
          <button onClick={doImport} style={{...S.primaryBtn,marginTop:10,width:"100%",justifyContent:"center"}}>
            <Icon name="import" size={14}/> Importer
          </button>
        </div>
      </div>

      <div style={{...S.card,marginTop:20}}>
        <div style={S.cardTitle}><Icon name="key" size={12}/> Mots de passe actuels</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {Object.entries(CREDENTIALS).map(([u,p])=>(
            <div key={u} style={{padding:"12px 16px",background:"#0f172a",borderRadius:10,borderLeft:`3px solid ${USERS[u].color}`}}>
              <div style={{color:USERS[u].color,fontWeight:700,fontSize:14}}>{USERS[u].name}</div>
              <div style={{color:"#64748b",fontFamily:"monospace",fontSize:13,marginTop:4}}>{p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// LEAD MODAL
// ────────────────────────────────────────────────────────────
function LeadModal({ lead, currentUser, actions41, onClose, onAddAction, onToggle, onUpdate }) {
  const [actType,setActType]=useState(ACTION_TYPES[0]);
  const [actNote,setActNote]=useState("");
  const st=STATUSES.find(s=>s.key===lead.status);
  const actCnt=lead.actions?.length||0;

  const handleAdd=()=>{ if(!actNote.trim())return; onAddAction(lead.id,{type:actType,note:actNote}); setActNote(""); };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <h2 style={{color:"#f1f5f9",margin:0,fontSize:20,fontFamily:"Georgia,serif"}}>{lead.nom}</h2>
            <div style={{color:"#64748b",fontSize:13,marginTop:4}}>{lead.tel} · {lead.email}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <SrcBadge src={lead.source}/>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:USERS[lead.assigned]?.color}}/>
                <span style={{color:"#94a3b8",fontSize:12}}>{USERS[lead.assigned]?.name}</span>
              </div>
              <span style={{color:"#334155",fontSize:12}}>{lead.createdAt}</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <select value={lead.status} onChange={e=>onUpdate(lead.id,{status:e.target.value})}
              style={{...S.input,width:"auto",padding:"6px 10px"}}>
              {STATUSES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <button onClick={onClose} style={{...S.iconBtn,color:"#ef4444"}}><Icon name="x" size={18}/></button>
          </div>
        </div>

        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{color:"#94a3b8",fontSize:12}}>Progression du parcours</span>
            <span style={{color:"#6366f1",fontWeight:700,fontSize:12}}>{actCnt}/{actions41.length} · {Math.round(actCnt/actions41.length*100)}%</span>
          </div>
          <div style={{height:8,background:"#1e293b",borderRadius:4}}>
            <div style={{height:"100%",width:`${actCnt/actions41.length*100}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:4,transition:"width 0.5s"}}/>
          </div>
        </div>

        <div style={{...S.cardTitle,marginBottom:12}}>Suivi des actions ({actCnt})</div>
        <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:220,overflowY:"auto",marginBottom:14}}>
          {lead.actions?.map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",background:"#0f172a",borderRadius:8,border:`1px solid ${a.done?"#10b98133":"#1e293b"}`}}>
              <button onClick={()=>onToggle(lead.id,i)}
                style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${a.done?"#10b981":"#334155"}`,background:a.done?"#10b981":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                {a.done&&<Icon name="check" size={10}/>}
              </button>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{color:"#6366f1",fontWeight:800,fontSize:11}}>{i+1}.</span>
                  <span style={{color:"#f1f5f9",fontSize:13,fontWeight:600}}>{a.type}</span>
                  <span style={{color:"#64748b",fontSize:11}}>· {a.date}</span>
                  {a.done&&<span style={{color:"#10b981",fontSize:10,marginLeft:"auto"}}>✓ Fait</span>}
                </div>
                <div style={{color:"#64748b",fontSize:12}}>{a.note}</div>
              </div>
            </div>
          ))}
          {(!lead.actions||lead.actions.length===0)&&(
            <div style={{color:"#64748b",textAlign:"center",padding:20,fontSize:13}}>Aucune action enregistrée</div>
          )}
        </div>

        <div style={{display:"flex",gap:8,paddingTop:12,borderTop:"1px solid #1e293b"}}>
          <select value={actType} onChange={e=>setActType(e.target.value)} style={{...S.input,width:"auto",padding:"8px 10px"}}>
            {ACTION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <input value={actNote} onChange={e=>setActNote(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            placeholder="Note sur l'action..."
            style={{...S.input,flex:1}}/>
          <button onClick={handleAdd} style={S.primaryBtn}><Icon name="plus" size={14}/></button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ADD LEAD MODAL
// ────────────────────────────────────────────────────────────
function AddLeadModal({ onClose, onAdd }) {
  const [f,setF]=useState({nom:"",tel:"",email:"",source:"Facebook"});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{ if(!f.nom||!f.tel)return; onAdd(f); onClose(); };
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:460}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{color:"#f1f5f9",margin:0}}>Nouveau Lead</h2>
          <button onClick={onClose} style={S.iconBtn}><Icon name="x" size={18}/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{l:"Nom Complet *",k:"nom",t:"text",p:"Ahmed Alami"},{l:"Téléphone *",k:"tel",t:"tel",p:"0661234567"},{l:"Email",k:"email",t:"email",p:"ahmed@gmail.com"}].map(x=>(
            <div key={x.k}>
              <label style={{color:"#64748b",fontSize:12,display:"block",marginBottom:6}}>{x.l}</label>
              <input type={x.t} value={f[x.k]} onChange={e=>set(x.k,e.target.value)} placeholder={x.p} style={S.input}/>
            </div>
          ))}
          <div>
            <label style={{color:"#64748b",fontSize:12,display:"block",marginBottom:6}}>Source</label>
            <select value={f.source} onChange={e=>set("source",e.target.value)} style={S.input}>
              {SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{padding:"10px 14px",background:"#0f172a",borderRadius:8,borderLeft:"3px solid #6366f1"}}>
            <div style={{color:"#6366f1",fontSize:12,fontWeight:700}}>Distribution automatique 50/50</div>
            <div style={{color:"#64748b",fontSize:12,marginTop:2}}>Assigné automatiquement au commercial avec le moins de leads.</div>
          </div>
          <button onClick={submit} style={{...S.primaryBtn,width:"100%",justifyContent:"center",padding:"12px 0"}}>
            <Icon name="plus" size={14}/> Ajouter le Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ────────────────────────────────────────────────────────────
function SrcBadge({ src }) {
  const c={Facebook:"#3b82f6",TikTok:"#ec4899",LinkedIn:"#0ea5e9",Google:"#f59e0b",Autre:"#64748b"}[src]||"#64748b";
  return <span style={{...S.badge,background:c+"22",color:c,border:`1px solid ${c}44`,fontSize:11}}>{src}</span>;
}

function StatusPill({ status, onChange }) {
  const [open,setOpen]=useState(false);
  const st=STATUSES.find(s=>s.key===status);
  return (
    <div style={{position:"relative",display:"inline-block"}} onClick={e=>e.stopPropagation()}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{...S.badge,background:st?.color+"22",color:st?.color,border:`1px solid ${st?.color}44`,cursor:"pointer",fontSize:11}}>
        {st?.label} ▾
      </button>
      {open&&(
        <div style={{position:"absolute",top:"110%",left:0,zIndex:10,background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:8,overflow:"hidden",minWidth:120}}>
          {STATUSES.map(s=>(
            <button key={s.key} onClick={()=>{onChange(s.key);setOpen(false);}}
              style={{display:"block",width:"100%",padding:"8px 14px",background:"none",border:"none",color:s.color,cursor:"pointer",textAlign:"left",fontSize:12}}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────
const S = {
  app:      {display:"flex",height:"100vh",background:"#0f172a",color:"#f1f5f9",fontFamily:"'DM Sans',-apple-system,sans-serif",overflow:"hidden"},
  sidebar:  {width:248,background:"#070d1a",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",padding:"20px 14px",flexShrink:0,overflowY:"auto"},
  logo:     {display:"flex",alignItems:"center",gap:12,marginBottom:22},
  logoBox:  {width:40,height:40,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"white",flexShrink:0},
  logoName: {color:"#f1f5f9",fontWeight:900,fontSize:14,letterSpacing:3},
  logoSub:  {color:"#64748b",fontSize:10,marginTop:1},
  userCard: {display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#1e293b22",borderRadius:10,marginBottom:14,border:"1px solid #1e293b"},
  avatar:   {width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:"white",flexShrink:0},
  sideFilter:{padding:"10px 12px",background:"#1e293b22",borderRadius:10,border:"1px solid #1e293b",marginBottom:14},
  sfLabel:  {color:"#64748b",fontSize:10,display:"flex",alignItems:"center",gap:4,marginBottom:7,textTransform:"uppercase",letterSpacing:1},
  chip:     {padding:"3px 8px",borderRadius:6,background:"#1e293b",border:"1px solid #334155",color:"#64748b",cursor:"pointer",fontSize:11},
  chipOn:   {background:"#6366f122",borderColor:"#6366f1",color:"#6366f1"},
  navBtn:   {display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,background:"none",border:"none",color:"#64748b",cursor:"pointer",width:"100%",textAlign:"left",fontSize:13,position:"relative"},
  navOn:    {background:"#6366f122",color:"#6366f1"},
  navBadge: {marginLeft:"auto",background:"#1e293b",color:"#94a3b8",fontSize:10,padding:"2px 6px",borderRadius:10},
  logoutBtn:{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:8,background:"none",border:"none",color:"#ef444488",cursor:"pointer",fontSize:13},
  main:     {flex:1,overflow:"auto",background:"#0f172a"},
  page:     {padding:26},
  pageHead: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22},
  pageTitle:{color:"#f1f5f9",fontSize:22,fontWeight:900,margin:0,fontFamily:"Georgia,serif"},
  pageSub:  {color:"#64748b",fontSize:12,marginTop:4,display:"block"},
  kpi:      {padding:"14px 16px",background:"#070d1a",borderRadius:12,border:"1px solid #1e293b"},
  card:     {padding:20,background:"#070d1a",borderRadius:12,border:"1px solid #1e293b"},
  cardTitle:{color:"#94a3b8",fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:14,fontWeight:700,display:"flex",alignItems:"center",gap:6},
  filterBar:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"},
  filterBtn:{padding:"5px 14px",borderRadius:20,background:"#070d1a",border:"1px solid #1e293b",color:"#64748b",cursor:"pointer",fontSize:12},
  filterOn: {background:"#6366f122",color:"#6366f1",borderColor:"#6366f1"},
  tableWrap:{background:"#070d1a",borderRadius:12,border:"1px solid #1e293b",overflow:"hidden"},
  table:    {width:"100%",borderCollapse:"collapse"},
  thead:    {background:"#0a0f1e"},
  th:       {padding:"10px 14px",color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:1,textAlign:"left",fontWeight:700},
  tr:       {borderTop:"1px solid #1e293b",cursor:"pointer"},
  td:       {padding:"11px 14px",verticalAlign:"middle"},
  badge:    {display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600},
  empty:    {textAlign:"center",color:"#64748b",padding:36,fontSize:13},
  primaryBtn:{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",cursor:"pointer",fontSize:13,fontWeight:700},
  iconBtn:  {padding:"6px",background:"#1e293b",border:"none",borderRadius:6,color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center"},
  input:    {width:"100%",padding:"9px 12px",background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#f1f5f9",fontSize:13,boxSizing:"border-box",outline:"none"},
  overlay:  {position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16},
  modal:    {background:"#070d1a",borderRadius:16,border:"1px solid #1e293b",padding:24,width:"100%",maxWidth:660,maxHeight:"92vh",overflowY:"auto"},
  toast:    {position:"fixed",top:20,right:20,padding:"11px 18px",borderRadius:10,color:"white",fontWeight:700,fontSize:13,zIndex:999,boxShadow:"0 8px 24px #0008"},
  loginBg:  {minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 30% 50%,#0f172a 0%,#070d1a 100%)"},
  loginCard:{background:"#070d1a",border:"1px solid #1e293b",borderRadius:20,padding:44,width:400,boxShadow:"0 32px 80px #0009"},
  loginUserBtn:{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,cursor:"pointer",width:"100%",textAlign:"left"},
};
