/* ============================================================
   STATE
   ============================================================ */
let lang = localStorage.getItem('cv-lang') || 'ko';  // default: KOR
let showAllConference = false;
let showIntroMore     = false;

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const T = {
  ko: {
    nav: {
      title: '이력서',
      intro: '소개',
      education: '학력', experience: '경력', projects: '프로젝트',
      publications: '논문', awards: '수상', skills: '기술/언어',
    },
    sidebar: {
      profile: '프로필', contact: '연락처', affiliation: '소속',
    },
    sections: {
      intro: '소개',
      education: '학력', experience: '경력', projects: '프로젝트',
      publications: '논문 및 특허', awards: '수상', skills: '기술 및 언어',
    },
    sub: {
      lectures: '강연', workExp: '업무 경험',
      companyProj: '회사 프로젝트', researchProj: '연구 프로젝트',
      thesis: '학위논문', journal: '저널 논문', conference: '학회 논문', patent: '특허',
      progLangs: '프로그래밍 언어', tools: '기술/도구', langProf: '언어 능력', aiAug: 'AI 증강 기술',
      strengths: '강점', growthPlan: '발전 계획',
    },
    cols: {
      edu:   { degree: '학력', school: '출신학교명', dept: '출신학과', year: '졸업년도', gpa: '성적(평점)' },
      lec:   { date: '연도', inst: '기관', topic: '주제', materials: '자료' },
      work:  { period: '기간', company: '기관', desc: '내용' },
      cProj: { date: '연도', months: '기간(달)', projType: '구분', executor: '수행사', title: '프로젝트명', role: '역할', detail: '' },
      rProj: { period: '기간', title: '프로젝트명', detail: '' },
      thesis:{ degree: '구분', year: '연도', title: '제목' },
      pub:   { venue: '학회', year: '연도', scope: '구분', title: '제목', author: '저자구분' },
      patent:{ region: '구분', year: '연도', title: '제목' },
      awards:{ date: '연도', name: '수상명', desc: '내용' },
    },
    profile: { birth: '생년월일', location: '거주지', military: '병역' },
    affil:   { duration: '근무기간', position: '직급/직위', role: '직무' },
    modal:   { poster: '강연 자료', projDetail: '프로젝트 상세', researchDetail: '연구 프로젝트 상세', client: '클라이언트', desc: '설명', tags: '역할/기술', noLink: '(샘플)', close: '닫기' },
    misc:    { langBtn: 'ENG', noContent: '추후 업데이트 예정', showMore: '개 더 보기', showLess: '접기' },
  },
  en: {
    nav: {
      title: 'Resume',
      intro: 'About',
      education: 'Education', experience: 'Experience', projects: 'Projects',
      publications: 'Publications', awards: 'Awards', skills: 'Skills',
    },
    sidebar: {
      profile: 'PROFILE', contact: 'CONTACT', affiliation: 'AFFILIATION',
    },
    sections: {
      intro: 'About',
      education: 'Education', experience: 'Experience', projects: 'Projects',
      publications: 'Publications', awards: 'Awards', skills: 'Skills & Languages',
    },
    sub: {
      lectures: 'Lectures', workExp: 'Work Experience',
      companyProj: 'Company Projects', researchProj: 'Research Projects',
      thesis: 'Thesis', journal: 'Research — Journal', conference: 'Research — Conference', patent: 'Patent',
      progLangs: 'Programming Languages', tools: 'Tools & Skills', langProf: 'Language Proficiency', aiAug: 'AI-Augmented Skills',
      strengths: 'Strengths', growthPlan: 'Growth Plan',
    },
    cols: {
      edu:   { degree: 'Degree', school: 'Institution', dept: 'Department', year: 'Year', gpa: 'GPA' },
      lec:   { date: 'Date', inst: 'Institution', topic: 'Topic', materials: 'Materials' },
      work:  { period: 'Period', company: 'Organization', desc: 'Description' },
      cProj: { date: 'Date', months: 'Months', projType: 'Type', executor: 'Contractor', title: 'Project', role: 'Role', detail: '' },
      rProj: { period: 'Period', title: 'Project', detail: '' },
      thesis:{ degree: 'Type', year: 'Year', title: 'Title' },
      pub:   { venue: 'Venue', year: 'Year', scope: 'Scope', title: 'Title', author: 'Authorship' },
      patent:{ region: 'Type', year: 'Year', title: 'Title' },
      awards:{ date: 'Date', name: 'Award', desc: 'Description' },
    },
    profile: { birth: 'Date of Birth', location: 'Location', military: 'Military Service' },
    affil:   { duration: 'Duration', position: 'Position', role: 'Role' },
    modal:   { poster: 'Lecture Materials', projDetail: 'Project Details', researchDetail: 'Research Project Details', client: 'Client', desc: 'Description', tags: 'Role / Skills', noLink: '(sample)', close: 'Close' },
    misc:    { langBtn: 'KOR', noContent: 'To be updated', showMore: ' more', showLess: 'Show less' },
  },
};

/** Translation helper */
function tr(dotPath) {
  return dotPath.split('.').reduce((o, k) => o?.[k], T[lang]) ?? '';
}

/** Bilingual data field helper */
function f(obj, key) {
  const enKey = key + '_en';
  return (lang === 'en' && obj[enKey] != null) ? obj[enKey] : obj[key];
}

/* ============================================================
   AUTO-CALCULATED FIELDS
   ============================================================ */
function getAge() {
  const birth = new Date(1990, 0, 11);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getAffiliDuration() {
  const start  = new Date('2023-07-01');
  const today  = new Date();
  let years    = today.getFullYear() - start.getFullYear();
  let months   = today.getMonth()    - start.getMonth();
  if (months < 0) { years--; months += 12; }
  if (lang === 'en') {
    const parts = [];
    if (years  > 0) parts.push(`${years} yr${years  > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    return parts.join(' ') || '1 mo';
  } else {
    const parts = [];
    if (years  > 0) parts.push(`${years}년`);
    if (months > 0) parts.push(`${months}개월`);
    return parts.join(' ') || '1개월';
  }
}

/* ============================================================
   STATIC CV DATA  (Phase 3: replaced with Supabase fetch)
   ============================================================ */
const CV_DATA = {

  profile: {
    name_ko:  '백영민',
    name_en:  'Young-Min Baek',
    name_caps: 'YOUNGMIN BAEK',
    titles:   ['Software Engineer', 'Senior Consultant', 'AX Lecturer'],
    location:      '대전광역시 유성구',   location_en:     'Daejeon, South Korea',
    military:      '군필 (병역특례/만기제대)', military_en: 'Completed (Alternative Service)',
    email: 'ymbaek@sol-link.com',
    phone: '+82-10-4434-4667',
    profile_image: 'profile.jpg',
  },

  affiliation: {
    company:        '㈜솔루션링크',
    start_date:     '2023-07-01',
    position:       '책임 컨설턴트·연구원', position_en:  'Senior Consultant·Researcher',
    department:     '프로젝트공학 사업부 - DX 개발팀 - 업무혁신 파트(장)',
    department_en:  'Project Engineering Div. — DX Dev. Team — Business Innovation Part (Lead)',
    role:           '프로젝트공학, S/W 요구공학 및 설계, 프로세스 엔지니어링 및 컨설팅, QA/테스팅, 비즈니스 아키텍트, 대외/사내 AI Transformation 교육 및 컨설팅',
    role_en:        'Project Engineering, S/W Requirements Engineering & Design, Process Engineering & Consulting, QA/Testing, Business Architecture, External/Internal AI Transformation Education & Consulting',
  },

  programming_languages: [
    { name: 'Java',        level: '숙련',    level_en: 'Proficient',            sort_order: 1 },
    { name: 'Python',      level: '초~중급', level_en: 'Beginner–Intermediate', sort_order: 2 },
    { name: 'C',           level: '중급',    level_en: 'Intermediate',          sort_order: 3 },
    { name: 'C++',         level: '초급',    level_en: 'Beginner',              sort_order: 4 },
    { name: 'JavaScript',  level: '초급',    level_en: 'Beginner',              sort_order: 5 },
    { name: 'Spring Boot', level: null,      level_en: null,                    sort_order: 6 },
    { name: 'Spring',      level: null,      level_en: null,                    sort_order: 7 },
  ],

  skills: [
    { name: 'Notion', level: '숙련', level_en: 'Proficient', sort_order: 1 },
  ],

  ai_skills: [
    'Spec-Driven Development',
    'Vibe Coding',
    'Test Automation',
    'Agent Workflow Design',
    'AI-Powered IDEs (e.g., Cursor)',
  ],

  languages: [
    { name: '영어',   name_en: 'English', level: '업무 및 연구 경험 다수', level_en: 'Professional (multiple work & research exp.)' },
    { name: '한국어', name_en: 'Korean',  level: '원어민',                  level_en: 'Native' },
  ],

  intro: {
    summary:
      'KAIST 전산학과에서 소프트웨어 공학 분야 박사 학위를 취득한 연구자 출신 엔지니어이자 컨설턴트입니다. ' +
      '모델 기반 시스템 엔지니어링, 온톨로지 기반 시나리오 명세, 소프트웨어 요구공학 및 품질 보증 분야에서 10년 이상의 연구·실무 경험을 보유하고 있습니다. ' +
      '현재 ㈜솔루션링크 책임 컨설턴트·연구원으로 NH은행·KT·우리은행 등 국내 주요 금융·공공 기관의 대규모 시스템 구축 프로젝트를 주도하며, ' +
      '분석·설계·QA 전 단계를 직접 수행하고 있습니다. ' +
      '학문적 전문성을 바탕으로 프로세스 엔지니어링·비즈니스 아키텍처 컨설팅을 수행하여 조직이 기술적 복잡성을 체계적으로 관리하도록 지원합니다. ' +
      '또한 KAIST 등 여러 기관에서 AI 증강 업무환경·에이전틱 AI·MCP를 주제로 강연하며, ' +
      '사내외 AI Transformation 교육 및 컨설팅을 통해 조직의 디지털 전환을 가속화하고 있습니다.',
    summary_en:
      'A Research-to-Practice Software Engineer and Consultant holding a PhD in Computer Science (Software Engineering) from KAIST, ' +
      'with over 10 years of combined research and industry experience in model-based systems engineering, ontology-based scenario specification, ' +
      'software requirements engineering, and quality assurance. ' +
      'Currently serving as Senior Consultant·Researcher at SolutionLink, leading end-to-end system development projects—from analysis and design to QA—' +
      'for major financial and public sector clients including NH Bank, KT, and Woori Bank. ' +
      'Bridges academic rigor with practical consulting in process engineering and business architecture, ' +
      'helping organizations systematically manage technical complexity. ' +
      'Also active as a lecturer on AI-augmented work environments, Agentic AI, and MCP at institutions including KAIST, ' +
      'and supports organizations\' AI transformation through targeted education and consulting.',
    strengths: [
      'KAIST 박사 과정에서 쌓은 소프트웨어 요구공학·시스템 설계·검증 분야의 이론적 기반',
      '금융·공공 도메인 대규모 프로젝트에서 검증된 전 단계 참여 역량 (분석 → 설계 → QA)',
      'AI 증강 워크플로우 설계 및 Spec-Driven Development 기반 실무 적용 경험',
      'KAIST 및 기업 강연을 통해 입증된 기술 커뮤니케이션·교육 역량',
      '학계 연구와 산업 컨설팅을 유기적으로 연결하는 Research-to-Practice 역량',
    ],
    strengths_en: [
      'Strong theoretical foundation in software requirements engineering, system design, and verification from KAIST PhD',
      'Proven end-to-end capabilities in large-scale financial and public sector projects (analysis → design → QA)',
      'Practical experience in AI-augmented workflow design and Spec-Driven Development',
      'Demonstrated technical communication and education skills through lectures at KAIST and industry',
      'Research-to-Practice capability bridging academic research and industry consulting',
    ],
    growth_plan:
      'AI 네이티브 소프트웨어 개발 방법론 및 에이전틱 AI 시스템 설계 분야의 전문성을 심화하여, ' +
      '학술 연구와 산업 컨설팅을 병행하는 Research-Practitioner로서의 역할을 확장할 계획입니다. ' +
      '특히 Spec-Driven Development 방법론을 체계화하고, 다양한 도메인의 AI 전환 프레임워크로 발전시키는 연구를 지속하고자 합니다. ' +
      '더불어 KAIST 및 산업계와의 협력을 통해 AI 증강 업무 환경 표준화에 기여하고자 합니다.',
    growth_plan_en:
      'I plan to deepen my expertise in AI-native software development methodologies and agentic AI system design, ' +
      'expanding my role as a Research-Practitioner who bridges academic research and industry consulting. ' +
      'In particular, I aim to systematize the Spec-Driven Development methodology into a practical AI transformation framework applicable across diverse domains. ' +
      'I also intend to contribute to the standardization of AI-augmented work environments through collaboration with KAIST and the industry.',
  },

  education: [
    { degree: '박사', degree_en: 'PhD', school: '한국과학기술원(KAIST)', school_en: 'KAIST', department: '전산학과', department_en: 'School of Computing', graduation_year: '2023', gpa: '3.66/4.3', sort_order: 1 },
    { degree: '석사', degree_en: 'MS',  school: '한국과학기술원(KAIST)', school_en: 'KAIST', department: '전산학과', department_en: 'School of Computing', graduation_year: '2016', gpa: '3.71/4.3', sort_order: 2 },
    { degree: '학사', degree_en: 'BS',  school: '건국대학교',            school_en: 'Konkuk University', department: '인터넷미디어공학부', department_en: 'Internet Media Engineering', graduation_year: '2014', gpa: '4.2/4.5 (수석)', gpa_en: '4.2/4.5 (Valedictorian)', sort_order: 3 },
  ],

  lectures: [
    {
      date: '2025.09', institution: '한국과학기술원(KAIST)', institution_en: 'KAIST',
      topic: 'AI-Augmented Work Environment + Agentic AI, MCP, AI-Powered IDE',
      poster_url: '#',
      sort_order: 1,
    },
    {
      date: '2025.06', institution: '㈜솔루션링크 (사내)', institution_en: 'SolutionLink (Internal)',
      topic: 'AI-Augmented Work Environment',
      poster_url: null,
      sort_order: 2,
    },
    {
      date: '2024.03', institution: '㈜솔루션링크 (사내)', institution_en: 'SolutionLink (Internal)',
      topic: 'Notion을 활용한 업무포털 구축',
      topic_en: 'Building a Work Portal using Notion',
      poster_url: '#',
      sort_order: 3,
    },
  ],

  work_experience: [
    {
      period: '2023.05 – 2023.07', company: '㈜더-플랑', company_en: 'The-Flan Inc.',
      description: '통합 소프트웨어 개발 환경 개선 및 시스템 초기 설계 자동화',
      description_en: 'Improvement of integrated software development environment and initial system design automation',
      sort_order: 1,
    },
    {
      period: '2022', company: '한국과학기술원(KAIST)', company_en: 'KAIST',
      description: 'KAIST SW교육센터 2022 앱 창업 프로그램 (팀: SROUM)',
      description_en: 'KAIST SW Education Center 2022 App Startup Program (Team: SROUM)',
      sort_order: 2,
    },
  ],

  projects_company: [
    {
      date: '2026.06',
      title: '(예정) NH프로젝트 AI 프로세스 컨설팅 및 통합품질관리시스템 개선',
      title_en: '(Planned) NH Project AI Process Consulting & Integrated QMS Improvement',
      proj_type: '기업', proj_type_en: 'Corporate',
      executor: '㈜솔루션링크', executor_en: 'SolutionLink',
      role: '', role_en: '',
      duration_months: null,
      detail: null,
      sort_order: 1,
    },
    {
      date: '2026.03',
      title: '(예정) KT 프로젝트관리시스템 MCP SERVER 구축 및 대응개발',
      title_en: '(Planned) KT Project Management System MCP SERVER Development',
      proj_type: '기업', proj_type_en: 'Corporate',
      executor: '㈜솔루션링크', executor_en: 'SolutionLink',
      role: '', role_en: '',
      duration_months: null,
      detail: null,
      sort_order: 2,
    },
    {
      date: '2025.08',
      title: 'NH은행 통합품질관리시스템 확대구축',
      title_en: 'NH Bank Integrated Quality Management System Expansion',
      proj_type: '기업', proj_type_en: 'Corporate',
      executor: '㈜솔루션링크', executor_en: 'SolutionLink',
      role: '시스템 분석, 시스템 설계, QA',
      role_en: 'System Analysis, System Design, QA',
      duration_months: 6,
      detail: {
        image: null,
        client:      'NH은행 / NH Bank',
        description: '기존 통합품질관리시스템의 기능을 확대하고 성능을 개선하는 프로젝트. 시스템 현황 분석부터 신규 요구사항 설계 및 품질 검증까지 전 단계에 참여.',
        description_en: 'Project to expand functionality and improve performance of existing Integrated QMS. Participated in all phases from system analysis to new requirements design and quality verification.',
        tags: ['시스템 분석', '시스템 설계', 'QA'],
      },
      sort_order: 3,
    },
    {
      date: '2025.07',
      title: '산림조합중앙회 프로젝트관리시스템 신규구축',
      title_en: 'Korea Forestry Cooperative Federation Project Management System Development',
      proj_type: '정부', proj_type_en: 'Public',
      executor: '㈜솔루션링크', executor_en: 'SolutionLink',
      role: '소프트웨어 분석, QA',
      role_en: 'Software Analysis, QA',
      duration_months: 4,
      detail: {
        image: null,
        client:      '산림조합중앙회 / Korea Forestry Cooperative Federation',
        description: '프로젝트관리시스템 신규 도입을 위한 소프트웨어 요구사항 분석 및 품질보증 업무 수행.',
        description_en: 'Software requirements analysis and quality assurance for new project management system introduction.',
        tags: ['소프트웨어 분석', 'QA'],
      },
      sort_order: 4,
    },
    {
      date: '2024.04',
      title: '우리은행 프로젝트관리시스템 구축',
      title_en: 'Woori Bank Project Management System Development',
      proj_type: '기업', proj_type_en: 'Corporate',
      executor: '㈜솔루션링크', executor_en: 'SolutionLink',
      role: '소프트웨어 분석, QA',
      role_en: 'Software Analysis, QA',
      duration_months: 12,
      detail: {
        image: null,
        client:      '우리은행 / Woori Bank',
        description: '프로젝트관리시스템 구축을 위한 소프트웨어 분석 및 QA 수행.',
        description_en: 'Software analysis and QA for project management system development.',
        tags: ['소프트웨어 분석', 'QA'],
      },
      sort_order: 5,
    },
  ],

  projects_research: [
    { period: '2015 – 2023', title: '[SW스타랩] 모델 기반 초대형 복잡 시스템 분석/설계 및 검증',  title_en: '[SW StarLab] Model-based Analysis/Design and Verification of Ultra-Large Complex Systems', link: '#',  detail: null, sort_order: 1 },
    { period: '2016 – 2017', title: '[삼성전자] 상호 운용 시스템의 모델 기반 시뮬레이션/검증',    title_en: '[Samsung Electronics] Model-based Simulation/Verification of Interoperable Systems',     link: null, detail: null, sort_order: 2 },
    { period: '2018 – 2019', title: '[KAERI] 안전 진술 활용 지침 개발',                            title_en: '[KAERI] Development of Safety Case Usage Guidelines',                                   link: null, detail: null, sort_order: 3 },
    { period: '2014 – 2015', title: '[RED&B] 상호 운용 시스템 안정성 향상을 위한 모델링',          title_en: '[RED&B] Modeling for Stability Improvement of Interoperable Systems',                    link: null, detail: null, sort_order: 4 },
    { period: '2014 – 2015', title: '[한컴 MDS] 모델 기반 모바일 앱 자동화 테스팅',               title_en: '[Hancom MDS] Model-based Automated Mobile App Testing',                                 link: null, sort_order: 5 },
  ],

  thesis: [
    {
      degree: '박사학위', degree_en: 'PhD Thesis',
      year: '2023',
      title_en: 'Conceptual Framework and Extensible Modeling Method Supporting Ontology-based Scenario Specification',
      title_ko: '온톨로지 기반의 시나리오 명세를 지원하는 개념 프레임워크와 확장 가능 모델링 기법',
      link: '#',
      sort_order: 1,
    },
    {
      degree: '석사학위', degree_en: 'MS Thesis',
      year: '2016',
      title_en: 'Automated Model-based Android GUI Testing using Multi-Level GUI Comparison Criteria',
      title_ko: '다중 레벨 GUI 비교 기준을 이용한 모델 기반의 자동화 안드로이드 GUI 테스팅',
      link: '#',
      sort_order: 2,
    },
  ],

  publications_journal: [
    { venue: 'IJSEKE', year: '2024', title: 'An Extensible Modeling Method Supporting Ontology-based Scenario Specification and Domain-specific Extension', author_type: 'First Author', link: '#', sort_order: 1 },
  ],

  publications_conference: [
    { venue: 'ASE',  year: '2016', title: 'Automated Model-based Android GUI Testing using Multi-level GUI Comparison Criteria',    author_type: 'First Author', link: '#',  scope: 'intl', sort_order: 1 },
    { venue: 'KCSE', year: '2018', title: '시스템 오브 시스템즈(SoS) 사례 분석을 통한 온톨로지 기반의 SoS 메타모델 개발',           author_type: 'First Author', link: null, scope: 'dom',  sort_order: 2 },
    { venue: 'KCC',  year: '2016', title: '효과적인 모델 기반 안드로이드 GUI 테스팅을 위한 GUI 상태 비교 기법',                    author_type: 'First Author', link: null, scope: 'dom',  sort_order: 3 },
    { venue: 'KCC',  year: '2015', title: '효과적인 모델 기반 안드로이드 GUI 테스팅을 위한 동일 화면 비교 기법',                    author_type: 'First Author', link: null, scope: 'dom',  sort_order: 4 },
  ],

  patents: [
    { region: '국내', region_en: 'Domestic', year: '2020', title: '시스템 오브 시스템즈 시각적 모델링 방법 및 장치 (2저자)', title_en: 'System of Systems Visual Modeling Method and Device (2nd Author)', sort_order: 1 },
  ],

  awards: [
    { date: '2018.01', award_name: '2018 KCSE 최우수논문상', award_name_en: '2018 KCSE Best Paper Award',    description: '시스템 오브 시스템즈(SoS) 사례 분석을 통한 온톨로지 기반의 SoS 메타모델 개발', description_en: 'Development of Ontology-based SoS Metamodel through SoS Case Analysis', sort_order: 1 },
    { date: '2016.06', award_name: '2016 KCC 우수논문상',    award_name_en: '2016 KCC Excellence Award',    description: '효과적인 모델 기반 안드로이드 GUI 테스팅을 위한 GUI 상태 비교 기법',          description_en: 'GUI State Comparison Method for Effective Model-based Android GUI Testing',    sort_order: 2 },
    { date: '2015.06', award_name: '2015 KCC 우수논문상',    award_name_en: '2015 KCC Excellence Award',    description: '효과적인 모델 기반 안드로이드 GUI 테스팅을 위한 동일 화면 비교 기법',          description_en: 'Screen Comparison Method for Effective Model-based Android GUI Testing',         sort_order: 3 },
  ],
};

/* ============================================================
   INLINE SVG ICONS
   ============================================================ */
const ICONS = {
  calendar: `<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  mapPin:   `<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  shield:   `<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  mail:     `<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  extLink:  `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  poster:   `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  detail:   `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  remember: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="16" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><circle cx="8.5" cy="10" r="2"/><path d="M14 9h4"/><path d="M14 12h4"/></svg>`,
};

/* ============================================================
   LINK RENDERER
   ============================================================ */
/**
 * Renders an external link icon.
 * '#' sample links open IEEE Xplore in a new tab as placeholder.
 */
function renderLink(link) {
  if (!link) return '';
  const href   = link === '#' ? 'https://ieeexplore.ieee.org/' : link;
  const cls    = link === '#' ? 'ext-link ext-link-sample' : 'ext-link';
  const title  = link === '#' ? tr('modal.noLink') : '';
  return ` <a class="${cls}" href="${href}" target="_blank" rel="noopener"${title ? ` title="${title}"` : ''}>${ICONS.extLink}</a>`;
}

/* ============================================================
   SCOPE BADGE RENDERER
   ============================================================ */
function renderScope(scope) {
  if (scope === 'intl') {
    return `<span class="scope-badge scope-intl">${lang === 'ko' ? '국제' : 'Intl'}</span>`;
  }
  if (scope === 'dom') {
    return `<span class="scope-badge scope-dom">${lang === 'ko' ? '국내' : 'Dom'}</span>`;
  }
  return '';
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================================
   TABLE BUILDER
   ============================================================ */
/**
 * @param {Array<{label, key?, cls?, render?}>} cols
 * @param {Array<Object>} rows
 */
function buildTable(cols, rows) {
  const thead = `<thead><tr>${cols.map(c =>
    `<th class="${c.cls || ''}">${c.label}</th>`
  ).join('')}</tr></thead>`;

  const tbody = `<tbody>${rows.map(row =>
    `<tr>${cols.map(c => {
      const val = c.render ? c.render(row) : (row[c.key] ?? '');
      return `<td class="${c.cls || ''}">${val !== '' && val != null
        ? val
        : '<span style="color:var(--text-secondary)">—</span>'}</td>`;
    }).join('')}</tr>`
  ).join('')}</tbody>`;

  return `<div class="table-wrapper"><table class="data-table">${thead}${tbody}</table></div>`;
}

function buildSubsection(title, content) {
  return `<div class="subsection"><h3 class="subsection-title">${title}</h3>${content}</div>`;
}

function buildSection(id, title, content) {
  return `<section id="${id}" class="section-card"><h2 class="section-title">${title}</h2>${content}</section>`;
}

/* ============================================================
   RENDER — PROFILE SIDEBAR
   ============================================================ */
function renderProfile() {
  const { profile, affiliation } = CV_DATA;

  const age       = getAge();
  const birthStr  = lang === 'en'
    ? `1990.01.11 (Age ${age})`
    : `1990.01.11 (${age}세)`;

  // Primary/secondary name based on language
  const primName = lang === 'en' ? profile.name_en   : profile.name_ko;
  const secName  = lang === 'en' ? profile.name_ko   : profile.name_caps;

  const titleTags = profile.titles
    .map(t => `<span class="profile-title-tag">${t}</span>`)
    .join('');

  const imgBlock = `
    <div class="profile-img-wrap">
      <img src="${profile.profile_image}" alt="${profile.name_ko}" class="profile-img"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="profile-img-fallback" aria-hidden="true">YB</div>
    </div>`;

  const bioBlock = `
    <div class="profile-bio">
      <p class="profile-name-primary">${primName}</p>
      <p class="profile-name-secondary">${secName}</p>
      <div class="profile-titles">${titleTags}</div>
    </div>`;

  const profileSec = `
    <div class="sidebar-section">
      <h3 class="sidebar-label">${tr('sidebar.profile')}</h3>
      <div class="info-list">
        <div class="info-item">${ICONS.calendar}<span>${birthStr}</span></div>
        <div class="info-item">${ICONS.mapPin}<span>${f(profile, 'location')}</span></div>
        <div class="info-item">${ICONS.shield}<span>${f(profile, 'military')}</span></div>
      </div>
    </div>`;

  const contactSec = `
    <div class="sidebar-section">
      <h3 class="sidebar-label">${tr('sidebar.contact')}</h3>
      <div class="info-list">
        <div class="info-item">${ICONS.mail}<a href="mailto:${profile.email}" class="contact-link">${profile.email}</a></div>
        <div class="info-item">${ICONS.phone}<span class="contact-text">${profile.phone}</span></div>
      </div>
    </div>`;

  const namecardLabel = lang === 'en' ? 'Download Card' : '명함 다운로드';
  const affiliSec = `
    <div class="sidebar-section sidebar-section--full">
      <div class="affil-header">
        <h3 class="sidebar-label">${tr('sidebar.affiliation')}</h3>
        <a href="namecard.png" target="_blank" rel="noopener" class="namecard-btn">${namecardLabel}</a>
      </div>
      <div class="affil-company">${affiliation.company}</div>
      <div class="affil-dept">${f(affiliation, 'department')}</div>
      <div class="affil-meta">${getAffiliDuration()} &middot; ${f(affiliation, 'position')}</div>
      <div class="affil-role">${f(affiliation, 'role')}</div>
    </div>`;

  document.getElementById('profile-sidebar').innerHTML = `
    <div class="profile-header">
      ${imgBlock}
      ${bioBlock}
    </div>
    <div class="profile-body">
      ${profileSec}${contactSec}${affiliSec}
    </div>`;
}

/* ============================================================
   RENDER — SECTIONS
   ============================================================ */
/* ============================================================
   PAGE TITLE
   ============================================================ */
function updatePageTitle() {
  document.title = lang === 'ko' ? '백영민 (이력서)' : 'Young-Min Baek (CV)';
}

/* ============================================================
   RENDER — INTRO
   ============================================================ */
function renderIntro() {
  const { intro } = CV_DATA;
  const summaryText = lang === 'en' ? intro.summary_en : intro.summary;
  const moreLabel   = lang === 'ko' ? '+ 더보기' : '+ More';

  const content = `
    <p class="intro-summary">${summaryText}</p>
    <div id="intro-expandable">
      <button class="show-more-btn" onclick="window.toggleIntro()" id="intro-toggle-btn">${moreLabel}</button>
    </div>`;

  return buildSection('intro', tr('sections.intro'), content);
}

window.toggleIntro = function() {
  showIntroMore = !showIntroMore;
  const expandable = document.getElementById('intro-expandable');
  if (!expandable) return;

  const { intro } = CV_DATA;
  const strengths  = lang === 'en' ? intro.strengths_en  : intro.strengths;
  const growthPlan = lang === 'en' ? intro.growth_plan_en : intro.growth_plan;
  const closedLabel = lang === 'ko' ? '+ 더보기' : '+ More';
  const openLabel   = lang === 'ko' ? '- 접기'   : '- Less';

  const moreHtml = showIntroMore
    ? buildSubsection(tr('sub.strengths'), `<ul class="intro-list">${
        strengths.map(s => `<li>${s}</li>`).join('')
      }</ul>`) +
      buildSubsection(tr('sub.growthPlan'), `<p class="intro-text">${growthPlan}</p>`)
    : '';

  expandable.innerHTML = `
    <button class="show-more-btn" onclick="window.toggleIntro()" id="intro-toggle-btn">
      ${showIntroMore ? openLabel : closedLabel}
    </button>
    ${moreHtml}`;
};

function renderContents() {
  document.getElementById('contents-area').innerHTML = [
    renderIntro(),
    renderEducation(),
    renderExperience(),
    renderProjects(),
    renderPublications(),
    renderAwards(),
    renderSkills(),
  ].join('');
}

function renderEducation() {
  const c = tr('cols.edu');
  const cols = [
    { label: c.degree, key: 'degree', cls: 'col-degree', render: row => f(row, 'degree') },
    { label: c.school, key: 'school', render: row => f(row, 'school') },
    { label: c.dept,   key: 'department', render: row => f(row, 'department') },
    { label: c.year,   key: 'graduation_year', cls: 'col-year' },
    { label: c.gpa,    key: 'gpa', cls: 'col-gpa', render: row => f(row, 'gpa') },
  ];
  return buildSection('education', tr('sections.education'), buildTable(cols, CV_DATA.education));
}

function renderExperience() {
  const lc = tr('cols.lec');
  const wc = tr('cols.work');

  const workCols = [
    { label: wc.period,  key: 'period',      cls: 'col-period' },
    { label: wc.company, key: 'company',     render: row => f(row, 'company') },
    { label: wc.desc,    key: 'description', render: row => f(row, 'description') },
  ];

  const lecCols = [
    { label: lc.date,      key: 'date',        cls: 'col-date' },
    { label: lc.inst,      key: 'institution', render: row => f(row, 'institution') },
    { label: lc.topic,     key: 'topic',       render: row => f(row, 'topic') },
    {
      label: lc.materials, cls: 'col-action',
      render: row => row.poster_url
        ? `<button class="btn-icon" title="${tr('modal.poster')}"
             onclick="openPosterModal(${CV_DATA.lectures.indexOf(row)})">${ICONS.poster}</button>`
        : '',
    },
  ];

  return buildSection('experience', tr('sections.experience'),
    buildSubsection(tr('sub.workExp'),  buildTable(workCols, CV_DATA.work_experience)) +
    buildSubsection(tr('sub.lectures'), buildTable(lecCols,  CV_DATA.lectures))
  );
}

function renderProjects() {
  const cc = tr('cols.cProj');
  const rc = tr('cols.rProj');

  const companyCols = [
    { label: cc.date,     key: 'date',  cls: 'col-date' },
    { label: cc.months,   cls: 'col-months',   render: row => row.duration_months != null ? row.duration_months : '' },
    { label: cc.projType, cls: 'col-projtype', render: row => f(row, 'proj_type') || '' },
    { label: cc.executor, cls: 'col-executor', render: row => f(row, 'executor') || '' },
    { label: cc.title,    render: row => f(row, 'title') },
    { label: cc.role,     cls: 'col-role', render: row => f(row, 'role') || '<span style="color:var(--text-secondary)">—</span>' },
    {
      label: cc.detail, cls: 'col-action',
      render: row => row.detail
        ? `<button class="btn-icon" title="${tr('modal.projDetail')}"
             onclick="openProjectModal(${CV_DATA.projects_company.indexOf(row)})">${ICONS.detail}</button>`
        : '',
    },
  ];

  const researchCols = [
    { label: rc.period, key: 'period', cls: 'col-period' },
    {
      label: rc.title,
      render: row => f(row, 'title') + renderLink(row.link),
    },
    {
      label: rc.detail, cls: 'col-action',
      render: row => row.detail
        ? `<button class="btn-icon" title="${tr('modal.researchDetail')}"
             onclick="openResearchModal(${CV_DATA.projects_research.indexOf(row)})">${ICONS.detail}</button>`
        : '',
    },
  ];

  return buildSection('projects', tr('sections.projects'),
    buildSubsection(tr('sub.companyProj'),  buildTable(companyCols,  CV_DATA.projects_company)) +
    buildSubsection(tr('sub.researchProj'), buildTable(researchCols, CV_DATA.projects_research))
  );
}

/* ---- Conference helpers ---- */
function getConfCols() {
  const pc = tr('cols.pub');
  return [
    { label: pc.venue,  key: 'venue',  cls: 'col-venue' },
    { label: pc.year,   key: 'year',   cls: 'col-year' },
    { label: pc.scope,  cls: 'col-scope', render: row => renderScope(row.scope) },
    {
      label: pc.title,
      render: row => row.title + renderLink(row.link),
    },
    { label: pc.author, key: 'author_type', cls: 'col-author' },
  ];
}

function renderConferenceContent() {
  const all     = CV_DATA.publications_conference;
  const visible = showAllConference ? all : all.slice(0, 1);
  const table   = buildTable(getConfCols(), visible);

  let btn = '';
  if (all.length > 1) {
    if (showAllConference) {
      btn = `<button class="show-more-btn" onclick="window.toggleConference()">${tr('misc.showLess')}</button>`;
    } else {
      const remaining = all.length - 1;
      const label = lang === 'ko'
        ? `${remaining}${tr('misc.showMore')}`
        : `Show ${remaining}${tr('misc.showMore')}`;
      btn = `<button class="show-more-btn" onclick="window.toggleConference()">${label}</button>`;
    }
  }
  return table + btn;
}

window.toggleConference = function() {
  showAllConference = !showAllConference;
  const el = document.getElementById('conf-content');
  if (el) el.innerHTML = renderConferenceContent();
};

function renderPublications() {
  const tc  = tr('cols.thesis');
  const pc  = tr('cols.pub');
  const pac = tr('cols.patent');

  const thesisCols = [
    { label: tc.degree, key: 'degree', cls: 'col-degree', render: row => lang === 'en' ? row.degree_en : row.degree },
    { label: tc.year,   key: 'year',   cls: 'col-year' },
    {
      label: tc.title,
      render: row => `${row.title_en}${renderLink(row.link)}<span class="cell-secondary">${row.title_ko}</span>`,
    },
  ];

  const pubCols = [
    { label: pc.venue,  key: 'venue',       cls: 'col-venue' },
    { label: pc.year,   key: 'year',        cls: 'col-year' },
    {
      label: pc.title,
      render: row => row.title + renderLink(row.link),
    },
    { label: pc.author, key: 'author_type', cls: 'col-author' },
  ];

  const patentCols = [
    { label: pac.region, key: 'region', cls: 'col-region', render: row => f(row, 'region') },
    { label: pac.year,   key: 'year',   cls: 'col-year' },
    { label: pac.title,  render: row => f(row, 'title') },
  ];

  const confHtml = `<div id="conf-content">${renderConferenceContent()}</div>`;

  return buildSection('publications', tr('sections.publications'),
    buildSubsection(tr('sub.thesis'),     buildTable(thesisCols, CV_DATA.thesis)) +
    buildSubsection(tr('sub.journal'),    buildTable(pubCols,    CV_DATA.publications_journal)) +
    buildSubsection(tr('sub.conference'), confHtml) +
    buildSubsection(tr('sub.patent'),     buildTable(patentCols, CV_DATA.patents))
  );
}

function renderAwards() {
  const c = tr('cols.awards');
  const cols = [
    { label: c.date, key: 'date',  cls: 'col-date' },
    { label: c.name, render: row => `\u{1F3C6} ${f(row, 'award_name')}` },
    { label: c.desc, render: row => f(row, 'description') },
  ];
  return buildSection('awards', tr('sections.awards'), buildTable(cols, CV_DATA.awards));
}

/** Render a badge with optional level indicator */
function renderBadge(name, level) {
  const lvl = level != null ? ` · ${level}` : '';
  return `<span class="badge">${name}${lvl}</span>`;
}

function renderSkills() {
  const { programming_languages, skills, ai_skills, languages } = CV_DATA;

  const langBadges = programming_languages.length
    ? programming_languages.map(l => {
        const lvl = lang === 'en' ? (l.level_en || l.level) : l.level;
        return renderBadge(l.name, lvl);
      }).join('')
    : `<span class="badge-empty">${tr('misc.noContent')}</span>`;

  const skillBadges = skills.length
    ? skills.map(s => {
        const lvl = lang === 'en' ? (s.level_en || s.level) : s.level;
        return renderBadge(s.name, lvl);
      }).join('')
    : `<span class="badge-empty">—</span>`;

  const aiAugBadges = (ai_skills || [])
    .map(s => `<span class="badge">${s}</span>`).join('');

  const langProfItems = languages.map(l => `
    <div class="lang-item">
      <span>${lang === 'en' ? l.name_en : l.name}</span>
      <span class="lang-level">${lang === 'en' ? l.level_en : l.level}</span>
    </div>`).join('');

  const tilesHtml = `
    <div class="skills-tiles">
      <div class="skills-tile">
        <div class="skills-tile-label">${tr('sub.progLangs')}</div>
        <div class="badge-container">${langBadges}</div>
      </div>
      <div class="skills-tile">
        <div class="skills-tile-label">${tr('sub.aiAug')}</div>
        <div class="badge-container">${aiAugBadges}</div>
      </div>
      <div class="skills-tile">
        <div class="skills-tile-label">${tr('sub.tools')}</div>
        <div class="badge-container">${skillBadges}</div>
      </div>
      <div class="skills-tile">
        <div class="skills-tile-label">${tr('sub.langProf')}</div>
        <div class="lang-prof-list">${langProfItems}</div>
      </div>
    </div>`;

  return buildSection('skills', tr('sections.skills'), tilesHtml);
}

/* ============================================================
   MODAL OPENERS (called from inline onclick)
   ============================================================ */
window.openPosterModal = function(idx) {
  const item  = CV_DATA.lectures[idx];
  const title = tr('modal.poster');
  let body;
  if (item.poster_url && item.poster_url !== '#') {
    body = `<img src="${item.poster_url}" alt="포스터" class="poster-img">`;
  } else {
    body = `
      <div class="poster-placeholder">
        <span>${f(item, 'institution')}</span>
        <span>${f(item, 'topic')}</span>
        <span class="placeholder-label">${tr('modal.noLink')} — 추후 실제 자료로 교체</span>
      </div>`;
  }
  openModal(title, body);
};

window.openProjectModal = function(idx) {
  const item   = CV_DATA.projects_company[idx];
  const detail = item.detail;
  if (!detail) return;
  const title = tr('modal.projDetail');

  const infoGrid = `
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-label">${tr('modal.client')}</span>
        <span class="detail-value">${detail.client}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">${tr('modal.desc')}</span>
        <span class="detail-value">${lang === 'en' && detail.description_en ? detail.description_en : detail.description}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">${tr('modal.tags')}</span>
        <span class="detail-value">
          <div class="detail-tags">${detail.tags.map(t => `<span class="badge">${t}</span>`).join('')}</div>
        </span>
      </div>
    </div>`;

  const imgCol = detail.image
    ? `<div class="proj-modal-img-col"><img src="${detail.image}" alt="${f(item,'title')}" class="proj-modal-img"></div>`
    : '';
  const body = `
    <div class="proj-modal-layout${detail.image ? ' has-image' : ''}">
      ${imgCol}
      <div class="proj-modal-info-col">${infoGrid}</div>
    </div>`;

  openModal(title, body);
};

window.openResearchModal = function(idx) {
  const item   = CV_DATA.projects_research[idx];
  const detail = item.detail;
  if (!detail) return;
  const title = tr('modal.researchDetail');

  const infoGrid = `
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-label">${tr('modal.desc')}</span>
        <span class="detail-value">${lang === 'en' && detail.description_en ? detail.description_en : (detail.description || '')}</span>
      </div>
      ${detail.tags && detail.tags.length ? `
      <div class="detail-row">
        <span class="detail-label">${tr('modal.tags')}</span>
        <span class="detail-value">
          <div class="detail-tags">${detail.tags.map(t => `<span class="badge">${t}</span>`).join('')}</div>
        </span>
      </div>` : ''}
    </div>`;

  const imgCol = detail.image
    ? `<div class="proj-modal-img-col"><img src="${detail.image}" alt="${f(item,'title')}" class="proj-modal-img"></div>`
    : '';
  const body = `
    <div class="proj-modal-layout${detail.image ? ' has-image' : ''}">
      ${imgCol}
      <div class="proj-modal-info-col">${infoGrid}</div>
    </div>`;

  openModal(title, body);
};

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem('cv-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function initThemeToggle() {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cv-theme', next);
  });
}

/* ============================================================
   LANGUAGE
   ============================================================ */
function setLang(newLang) {
  lang = newLang;
  localStorage.setItem('cv-lang', newLang);
  document.documentElement.setAttribute('lang', newLang === 'ko' ? 'ko' : 'en');
  showIntroMore = false;  // reset on language change

  // Re-render content
  updatePageTitle();
  renderProfile();
  renderContents();

  // Update data-tr elements (nav tabs, title)
  document.querySelectorAll('[data-tr]').forEach(el => {
    el.textContent = tr(el.dataset.tr);
  });

  // Update lang button label (shows opposite lang)
  document.getElementById('lang-btn').textContent = tr('misc.langBtn');

  // Re-init active nav + close mobile menu
  initActiveNav();
  closeMobileMenu();
}

function initLang() {
  document.getElementById('lang-btn').addEventListener('click', () => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  });
  document.getElementById('lang-btn').textContent = tr('misc.langBtn');
}

/* ============================================================
   PRINT
   ============================================================ */
function initPrint() {
  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function closeMobileMenu() {
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', 'false');
}

function initMobileNav() {
  const btn       = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = mobileNav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileNav.querySelectorAll('.mobile-nav-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(tab.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  document.addEventListener('click', e => {
    if (!mobileNav.contains(e.target) && e.target !== btn) closeMobileMenu();
  });
}

/* ============================================================
   SCROLL TO TOP FAB
   ============================================================ */
function initScrollToTop() {
  const fab = document.getElementById('scroll-to-top');
  window.addEventListener('scroll', () => {
    fab.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   ACTIVE NAV TAB (Intersection Observer)
   ============================================================ */
function initActiveNav() {
  document.querySelectorAll('.nav-tab, .mobile-nav-tab').forEach(t => t.classList.remove('active'));

  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-tab, .mobile-nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll(`[data-target="${entry.target.id}"]`).forEach(t => t.classList.add('active'));
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(s => observer.observe(s));

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(tab.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updatePageTitle();
  renderProfile();
  renderContents();

  document.querySelectorAll('[data-tr]').forEach(el => {
    el.textContent = tr(el.dataset.tr);
  });

  initThemeToggle();
  initLang();
  initPrint();
  initMobileNav();
  initScrollToTop();
  initActiveNav();
  initModal();

  // Nav title click → scroll to top
  const navTitleEl = document.querySelector('.nav-title');
  if (navTitleEl) {
    navTitleEl.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
