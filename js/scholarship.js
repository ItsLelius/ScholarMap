/* ═══════════════════════════════════════════════════════════════
   scholarships.js  —  ScholarMap Data File
   ───────────────────────────────────────────────────────────────
   HOW TO ADD / EDIT / DELETE A SCHOLARSHIP:
   • Copy the TEMPLATE block, paste it inside the array, fill it in
   • For img: drop your image in ./assets/img/scholarships/
     then set  img: './assets/img/scholarships/your-file.jpg'
   • If no custom image, leave  img: ''  — emoji + bg will show instead
   • To delete: remove the whole { ... } block (and the comma before it)
   • Save the file — the dashboard auto-renders everything instantly
═══════════════════════════════════════════════════════════════ */

const SCHOLARSHIPS = [

/* ╔══════════════════════════════════════════════════════════════
   ║  TEMPLATE — copy-paste below, fill in, done
   ╚══════════════════════════════════════════════════════════════
  {
    id:       'unique-id',           // no spaces, all lowercase with dashes
    name:     'Scholarship Name',
    org:      'Offering Organization',
    type:     'Government',          // Government | Foundation | Private | LGU
    level:    'College',             // College | Senior High | Graduate | Elementary

    img:      '',                    // './assets/img/scholarships/photo.jpg' or ''
    emoji:    '🎓',                  // used when img is empty
    bg:       'linear-gradient(135deg,#dbeafe,#e0e7ff)', // card bg when no img

    region:   '',                    // e.g. 'Davao Region' — leave '' for Nationwide
    province: '',
    city:     '',

    amount:   '₱0,000/yr',
    slots:    '00 slots',
    deadline: '2025-12-31',          // YYYY-MM-DD

    req: [
      'Requirement 1',
      'Requirement 2',
      'Requirement 3',
    ],
    desc: 'Full description shown in the detail modal.',

    applyUrl: '',   // '' = open the built-in ScholarMap application form
                    // 'https://...' = redirect to an external link instead
  },
   ═══════════════════════════════════════════════════════════════ */

  {
    id:'ched-tulong',
    name:'CHED Tulong Dunong Program',
    org:'Commission on Higher Education',
    type:'Government', level:'College',
    img:'', emoji:'🎓', bg:'linear-gradient(135deg,#dbeafe,#e0e7ff)',
    region:'Davao Region', province:'Davao del Sur', city:'Digos City',
    amount:'₱30,000/yr', slots:'500 slots', deadline:'2025-06-30',
    req:['Filipino Citizen','GWA 1.75 or higher','Annual Income ≤ ₱400,000','No existing scholarship'],
    desc:'The CHED Tulong Dunong Program provides financial assistance to deserving but financially challenged students pursuing tertiary education. Priority is given to students from underprivileged families in underserved areas.',
    applyUrl:'',
  },
  {
    id:'sm-found',
    name:'SM Foundation College Scholarship',
    org:'SM Foundation Inc.',
    type:'Foundation', level:'College',
    img:'', emoji:'🏫', bg:'linear-gradient(135deg,#dcfce7,#d1fae5)',
    region:'Davao Region', province:'Davao del Sur', city:'Davao City',
    amount:'₱60,000/yr', slots:'200 slots', deadline:'2025-06-15',
    req:['High School Graduate','GWA 85% or higher','Annual Income ≤ ₱200,000','Enrolled in partner school'],
    desc:'SM Foundation provides full college scholarships to academically deserving but financially challenged students. Scholars receive monthly stipends and school allowances.',
    applyUrl:'',
  },
  {
    id:'dost-sei',
    name:'DOST-SEI Merit Scholarship',
    org:'Dept. of Science and Technology',
    type:'Government', level:'College',
    img:'', emoji:'⭐', bg:'linear-gradient(135deg,#fef3c7,#fde68a)',
    region:'Davao Region', province:'Davao del Norte', city:'Tagum City',
    amount:'₱40,000/yr', slots:'100 slots', deadline:'2025-02-28',
    req:['Science or Tech course','NSAT Top 10%','Graduating High School','Top 10% of class'],
    desc:'The DOST-SEI Merit Scholarship supports students pursuing science and technology courses. Scholars receive full tuition, monthly stipend, and book allowance.',
    applyUrl:'',
  },
  {
    id:'ayala-found',
    name:'Ayala Foundation Iskolar ng Bayan',
    org:'Ayala Foundation',
    type:'Foundation', level:'College',
    img:'', emoji:'🌸', bg:'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    region:'Davao Region', province:'Davao Oriental', city:'Mati City',
    amount:'₱75,000/yr', slots:'50 slots', deadline:'2025-08-01',
    req:['Leadership track record','GWA 90% or higher','Community service hours','Essay and interview'],
    desc:'Ayala Foundation Iskolar ng Bayan supports outstanding students who demonstrate academic excellence and strong community involvement.',
    applyUrl:'',
  },
  {
    id:'ched-grad',
    name:'CHED Graduate Scholarship',
    org:'Commission on Higher Education',
    type:'Government', level:'Graduate',
    img:'', emoji:'🔬', bg:'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    region:'', province:'', city:'',
    amount:'₱120,000/yr', slots:'150 slots', deadline:'2025-09-30',
    req:['Graduate-level enrollment','Research proposal required','Letter of endorsement','BS from accredited school'],
    desc:'CHED provides graduate-level scholarships for students in priority fields. This program builds a pool of highly trained Filipino researchers and educators.',
    applyUrl:'',
  },
  {
    id:'jollibee-blt',
    name:'Jollibee Foundation BLT Program',
    org:'Jollibee Foundation',
    type:'Foundation', level:'Elementary',
    img:'', emoji:'🌿', bg:'linear-gradient(135deg,#ecfdf5,#a7f3d0)',
    region:'CALABARZON', province:'Laguna', city:'Santa Cruz',
    amount:'₱12,000/yr', slots:'1000 slots', deadline:'2025-07-15',
    req:['Elementary student','Family in agriculture','Teacher endorsement','Family income ≤ ₱100,000'],
    desc:"Jollibee Foundation's Busog Lusog Talino program provides nutrition and education support to elementary students from farming families.",
    applyUrl:'',
  },
  {
    id:'gsis-educ',
    name:'GSIS Educational Assistance',
    org:'Government Service Insurance System',
    type:'Government', level:'College',
    img:'', emoji:'🏛️', bg:'linear-gradient(135deg,#f0f9ff,#bae6fd)',
    region:'NCR', province:'', city:'Pasay City',
    amount:'₱18,000/yr', slots:'300 slots', deadline:'2025-05-31',
    req:['Child of GSIS member','GWA 85%+','Enrolled in state university','No other govt scholarship'],
    desc:"GSIS Educational Assistance is exclusively for qualified dependents of GSIS members. It covers tuition fees and provides an annual allowance.",
    applyUrl:'',
  },
  {
    id:'sss-educ',
    name:'SSS Educational Scholarship',
    org:'Social Security System',
    type:'Government', level:'College',
    img:'', emoji:'📋', bg:'linear-gradient(135deg,#fff7ed,#fed7aa)',
    region:'NCR', province:'', city:'Quezon City',
    amount:'₱15,000/yr', slots:'200 slots', deadline:'2025-04-30',
    req:['Dependent of SSS member','Member in good standing','GWA 80%+','Family income ≤ ₱180,000'],
    desc:"SSS provides educational assistance to qualified dependents of active SSS members.",
    applyUrl:'',
  },
  {
    id:'pcso-med',
    name:'PCSO Medical Scholarship',
    org:'Philippine Charity Sweepstakes Office',
    type:'Government', level:'College',
    img:'', emoji:'🏥', bg:'linear-gradient(135deg,#fdf2f8,#fce7f3)',
    region:'', province:'', city:'',
    amount:'₱50,000/yr', slots:'60 slots', deadline:'2025-03-15',
    req:['Medical or nursing course','GWA 88%+','Financial need certification','Commitment to serve rural areas'],
    desc:'PCSO Medical Scholarship supports students enrolled in medical and nursing courses with a commitment to serve underserved communities after graduation.',
    applyUrl:'',
  },
  {
    id:'deped-shs',
    name:'DepEd SHS Voucher Program',
    org:'Department of Education',
    type:'Government', level:'Senior High',
    img:'', emoji:'📚', bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)',
    region:'', province:'', city:'',
    amount:'₱22,500/yr', slots:'Open', deadline:'2025-06-30',
    req:['Grade 10 completer','Enrolled in private SHS','ESC certificate','Philippine citizenship'],
    desc:'The DepEd SHS Voucher Program allows Grade 10 completers to enroll in non-DepEd schools by covering tuition.',
    applyUrl:'',
  },
  {
    id:'tesda',
    name:'TESDA Tech-Voc Scholarship',
    org:'TESDA',
    type:'Government', level:'College',
    img:'', emoji:'🔧', bg:'linear-gradient(135deg,#f8fafc,#e2e8f0)',
    region:'', province:'', city:'',
    amount:'₱25,000 (one-time)', slots:'Open', deadline:'2025-12-31',
    req:['Filipino citizen','TVET program enrollment','Passed TESDA assessment','No other TESDA grant'],
    desc:'TESDA offers training scholarships for technical-vocational programs nationwide. Scholars gain free skills training, tools, and certification fees.',
    applyUrl:'',
  },
  {
    id:'meralco',
    name:'MERALCO Foundation Scholarship',
    org:'MERALCO Foundation',
    type:'Foundation', level:'College',
    img:'', emoji:'💡', bg:'linear-gradient(135deg,#fefce8,#fef9c3)',
    region:'NCR', province:'', city:'Pasig City',
    amount:'₱45,000/yr', slots:'80 slots', deadline:'2025-04-15',
    req:['Engineering or CS course','GWA 88%+','MERALCO franchise area resident','Annual income ≤ ₱300,000'],
    desc:'MERALCO Foundation awards scholarships to students pursuing engineering and computer science, with mentorship and internship opportunities.',
    applyUrl:'',
  },
  {
    id:'globe',
    name:'Globe Bridgecom Scholarship',
    org:'Globe Telecom',
    type:'Private', level:'College',
    img:'', emoji:'📡', bg:'linear-gradient(135deg,#eff6ff,#dbeafe)',
    region:'', province:'', city:'',
    amount:'₱55,000/yr', slots:'40 slots', deadline:'2025-05-30',
    req:['STEM strand graduate','GWA 90%+','Aptitude test required','Interview required'],
    desc:"Globe Telecom's Bridgecom Scholarship supports exceptional STEM students with mentors, hackathons, and a direct career path at Globe.",
    applyUrl:'',
  },
  {
    id:'aboitiz',
    name:'Aboitiz Foundation Scholarship',
    org:'Aboitiz Foundation',
    type:'Foundation', level:'College',
    img:'', emoji:'⚡', bg:'linear-gradient(135deg,#fdf4ff,#fae8ff)',
    region:'Central Visayas', province:'Cebu', city:'Cebu City',
    amount:'₱70,000/yr', slots:'60 slots', deadline:'2025-07-31',
    req:['Resident of Aboitiz community','GWA 85%+','Financial need','Priority courses only'],
    desc:'Aboitiz Foundation invests in education of young people from communities where Aboitiz Group operates.',
    applyUrl:'',
  },
  {
    id:'pagcor',
    name:'PAGCOR Educational Assistance',
    org:'Philippine Amusement and Gaming Corp',
    type:'Government', level:'College',
    img:'', emoji:'🃏', bg:'linear-gradient(135deg,#fff1f2,#ffe4e6)',
    region:'', province:'', city:'',
    amount:'₱20,000/yr', slots:'250 slots', deadline:'2025-06-01',
    req:['Financial need','GWA 80%+','Filipino citizen','Not currently employed'],
    desc:'PAGCOR uses a portion of its revenues to fund educational assistance for deserving Filipino students across all courses.',
    applyUrl:'',
  },
  {
    id:'bdo',
    name:'BDO Foundation Scholarship',
    org:'BDO Foundation',
    type:'Private', level:'College',
    img:'', emoji:'🏦', bg:'linear-gradient(135deg,#f0fdf4,#d1fae5)',
    region:'', province:'', city:'',
    amount:'₱48,000/yr', slots:'100 slots', deadline:'2025-08-31',
    req:['Business or Finance course','GWA 88%+','Financial need','Leadership potential'],
    desc:"BDO Foundation's scholarship targets students in Business, Finance, and Accountancy with internship and management trainee opportunities.",
    applyUrl:'',
  },
  {
    id:'pnb',
    name:'PNB Scholarship for Excellence',
    org:'Philippine National Bank',
    type:'Private', level:'College',
    img:'', emoji:'🏧', bg:'linear-gradient(135deg,#f0f9ff,#e0f2fe)',
    region:'NCR', province:'', city:'Manila',
    amount:'₱36,000/yr', slots:'70 slots', deadline:'2025-05-15',
    req:['Economics, Business, or Law','GWA 87%+','Leadership involvement','Good moral character'],
    desc:'Philippine National Bank awards scholarships to outstanding students in Economics, Business, and Law with mentorship from PNB executives.',
    applyUrl:'',
  },
  {
    id:'davao-lgu',
    name:'Davao City LGU Scholarship',
    org:'City Government of Davao',
    type:'LGU', level:'College',
    img:'', emoji:'🏙️', bg:'linear-gradient(135deg,#fff7ed,#ffedd5)',
    region:'Davao Region', province:'Davao del Sur', city:'Davao City',
    amount:'₱24,000/yr', slots:'400 slots', deadline:'2025-06-30',
    req:['Davao City resident 3+ years','GWA 85%+','Barangay clearance','No other LGU scholarship'],
    desc:'Davao City provides scholarship grants to qualified residents pursuing college degrees in agriculture, engineering, health, and education.',
    applyUrl:'',
  },
  {
    id:'manila-lgu',
    name:'City of Manila Scholarship Grant',
    org:'City Government of Manila',
    type:'LGU', level:'College',
    img:'', emoji:'🌆', bg:'linear-gradient(135deg,#f5f3ff,#ede9fe)',
    region:'NCR', province:'', city:'Manila',
    amount:'₱20,000/yr', slots:'600 slots', deadline:'2025-07-01',
    req:['Manila resident','Voter reg. or birth cert.','GWA 82%+','Family income ≤ ₱250,000'],
    desc:'The City of Manila offers annual scholarship grants to deserving residents in accredited colleges and universities, prioritizing urban poor communities.',
    applyUrl:'',
  },
  {
    id:'robinsons',
    name:'Robinsons Scholars Program',
    org:'JG Summit Holdings',
    type:'Private', level:'College',
    img:'', emoji:'🛍️', bg:'linear-gradient(135deg,#fdf2f8,#fce7f3)',
    region:'', province:'', city:'',
    amount:'₱40,000/yr', slots:'90 slots', deadline:'2025-09-15',
    req:['Business, Engineering, or IT','GWA 86%+','Leadership activities','Passed aptitude exam'],
    desc:"JG Summit's Robinsons Scholars Program nurtures future leaders in Business, Engineering, and IT with full tuition, quarterly stipends, and priority employment.",
    applyUrl:'',
  },

];
/* ─── end of SCHOLARSHIPS array ─── */