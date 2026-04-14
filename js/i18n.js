/* ===== LINKON i18n — KO / EN ===== */
(function () {
  'use strict';

  var TRANSLATIONS = {
    ko: {
      /* Navigation */
      'nav.services': '서비스',
      'nav.about': '회사 소개',
      'nav.contact': '문의하기',
      'nav.cta': 'Vion 시작하기',

      /* Hero (index) */
      'hero.eyebrow': 'AI 기반 전문 서비스 플랫폼',
      'hero.title': '더 나은 삶을 위한<br><span class="text-gradient">AI 서비스</span>',
      'hero.sub': '심리 케어부터 법률, 재무까지 —<br class="hide-mobile"> 전문 AI가 함께합니다.',
      'hero.cta.primary': 'Vion 체험하기',
      'hero.cta.secondary': '서비스 살펴보기',
      'hero.scroll': '스크롤',

      /* Services section (index) */
      'services.label': '서비스',
      'services.title': 'Linkon이 제공하는<br>전문 AI 서비스',
      'services.desc': '각 분야 전문 AI가 당신의 삶을 더 풍요롭게 만들어 드립니다.',

      /* Status badges */
      'badge.live': '서비스 중',
      'badge.soon': '출시 예정',

      /* Vion card (index) */
      'vion.tagline': '심리 및 실버 케어',
      'vion.desc': '마음의 건강을 지키는 AI 심리 상담 서비스입니다. 일상의 스트레스부터 깊은 고민까지, 언제 어디서나 전문적인 심리 케어를 받아보세요.',
      'vion.btn.detail': '서비스 자세히 보기',

      /* Rion card (index) */
      'rion.tagline': '법률 비서',
      'rion.desc': '신뢰와 권위를 바탕으로 한 AI 법률 비서입니다. 복잡한 법률 문서 검토부터 기본 법률 상담까지 든든하게 지원합니다.',
      'rion.btn.preview': '서비스 미리보기',

      /* Taxon card (index) */
      'taxon.tagline': '재무 관리',
      'taxon.desc': '열정과 정확성으로 당신의 재무를 관리하는 AI 서비스입니다. 자산 분석부터 절세 전략까지 스마트한 재무 파트너가 되어드립니다.',
      'taxon.btn.preview': '서비스 미리보기',

      /* About (index) */
      'about.label': '회사 소개',
      'about.title': '기술로 삶의 문제를<br>해결합니다',
      'about.body1': 'Linkon은 전문 지식의 장벽을 낮추고 누구나 고품질의 AI 서비스를 누릴 수 있도록 만들어진 플랫폼입니다.',
      'about.body2': '심리 상담, 법률 자문, 재무 관리 — 삶의 중요한 순간마다 Linkon의 AI가 곁에서 돕습니다. 복잡한 문제를 단순하고 명확하게, 언제 어디서나.',
      'about.stat1': '전문 서비스',
      'about.stat2': 'AI 기반',
      'about.stat3': '언제 어디서나',

      /* Teaser (index) */
      'teaser.label': '곧 만나보세요',
      'teaser.title': '더 많은 AI 서비스가<br>출시 예정입니다',
      'rion.teaser.tagline': '— 법률 비서',
      'rion.teaser.desc': '복잡한 법률 문서도 Rion과 함께라면 쉽게 이해할 수 있습니다. AI 법률 비서가 당신의 권리를 지켜드립니다.',
      'taxon.teaser.tagline': '— 재무 관리',
      'taxon.teaser.desc': 'AI가 분석하는 스마트한 재무 관리. 자산 현황 파악부터 절세 전략까지, Taxon이 당신의 재무 파트너가 되어드립니다.',
      'notify.btn': '출시 알림 받기',
      'notify.placeholder': '이메일 주소를 입력해 주세요',

      /* Footer (common) */
      'footer.tagline': '더 나은 삶을 위한 AI 서비스 플랫폼',
      'footer.heading.services': '서비스',
      'footer.heading.contact': '문의하기',
      'footer.contact.desc': '서비스 관련 문의 또는 제안이 있으시면 이메일로 연락해 주세요.',
      'footer.contact.desc.short': '서비스 관련 문의는 이메일로 연락해 주세요.',
      'footer.contact.btn': '이메일 문의',
      'footer.legal.privacy': '개인정보처리방침',
      'footer.legal.terms': '이용약관',

      /* Service pages — common */
      'sp.back': '모든 서비스 보기',
      'sp.scroll': '스크롤',

      /* Vion service page */
      'vion.status': '현재 서비스 중',
      'vion.hero.desc': '마음의 건강을 지키는 AI 심리 상담 서비스입니다. 일상의 스트레스부터 깊은 고민, 어르신 돌봄까지 — Vion이 언제나 곁에 있습니다.',
      'vion.hero.btn.primary': '지금 Vion 시작하기',
      'vion.hero.btn.secondary': '서비스 소개 보기',
      'vion.intro.label': '서비스 소개',
      'vion.intro.title': '당신의 마음을<br>가장 잘 이해하는 AI',
      'vion.intro.body1': 'Vion은 심리학 기반의 AI 알고리즘을 활용해 사용자의 감정 상태를 분석하고, 맞춤형 심리 케어를 제공합니다. 바쁜 일상 속에서도 마음의 건강을 챙길 수 있도록 24시간 함께합니다.',
      'vion.intro.body2': '특히 혼자 사는 어르신이나 가족과 멀리 떨어진 시니어를 위한 실버 케어 기능도 갖추고 있어, 세대를 아우르는 따뜻한 돌봄을 실현합니다.',
      'vion.intro.btn': '무료로 체험하기',
      'vion.features.label': '핵심 기능',
      'vion.features.title': 'Vion이 제공하는<br>맞춤형 케어',
      'vion.f1.title': 'AI 감정 분석',
      'vion.f1.desc': '대화 패턴과 감정 표현을 실시간으로 분석해 현재 심리 상태를 파악하고 맞춤형 조언을 제공합니다.',
      'vion.f2.title': '24시간 상담',
      'vion.f2.desc': '언제든지 마음이 힘들 때 Vion과 대화할 수 있습니다. 새벽에도, 주말에도 항상 곁에 있습니다.',
      'vion.f3.title': '실버 케어',
      'vion.f3.desc': '어르신을 위한 특화 기능 — 쉬운 UI, 음성 인터페이스, 건강 모니터링까지 세대를 아우르는 돌봄을 제공합니다.',
      'vion.f4.title': '맞춤 케어 플랜',
      'vion.f4.desc': '대화 기록을 바탕으로 주간 심리 리포트와 개인화된 웰빙 계획을 제안해 지속적인 마음 건강을 지원합니다.',
      'vion.f5.title': '완벽한 개인정보 보호',
      'vion.f5.desc': '모든 상담 내용은 암호화되어 저장되며, 제3자에게 절대 공유되지 않습니다. 마음 놓고 이야기하세요.',
      'vion.f6.title': '감정 추이 트래킹',
      'vion.f6.desc': '시간에 따른 감정 변화를 시각화해 스스로 마음 건강 상태를 모니터링하고 긍정적인 변화를 확인할 수 있습니다.',
      'vion.cta.label': '지금 시작하세요',
      'vion.cta.title': '마음이 힘들 때,<br>Vion이 함께합니다',
      'vion.cta.desc': '첫 상담은 무료입니다. 지금 바로 Vion을 만나보세요.',
      'vion.cta.btn.primary': 'Vion 무료 체험하기',
      'vion.cta.btn.secondary': '다른 서비스 보기',

      /* Rion service page */
      'rion.status': '출시 예정',
      'rion.hero.desc': '신뢰와 권위를 바탕으로 당신의 권리를 지키는 AI 법률 비서입니다. 복잡한 법률 문서도, 어려운 법적 절차도 Rion과 함께라면 쉽게 해결할 수 있습니다.',
      'rion.hero.btn.primary': '출시 알림 받기',
      'rion.hero.btn.secondary': '서비스 소개 보기',
      'rion.intro.label': '서비스 소개',
      'rion.intro.title': '법률의 장벽을 낮추는<br>AI 법률 파트너',
      'rion.intro.body1': 'Rion은 복잡하고 어렵게 느껴지는 법률 문제를 누구나 쉽게 이해하고 해결할 수 있도록 돕는 AI 법률 비서입니다. 계약서 검토, 법률 용어 해석, 분쟁 절차 안내 등 다양한 법률 서비스를 제공합니다.',
      'rion.intro.body2': '전문 법률 지식을 AI가 쉬운 언어로 풀어드립니다. 더 이상 법률 문제 앞에서 혼자 막막해하지 않아도 됩니다. Rion이 든든한 보호자로서 함께합니다.',
      'rion.intro.btn': '출시 알림 신청',
      'rion.features.label': '핵심 기능',
      'rion.features.title': 'Rion이 제공하는<br>법률 보호 서비스',
      'rion.f1.title': '계약서 자동 검토',
      'rion.f1.desc': '계약서를 업로드하면 AI가 불리한 조항, 누락된 항목, 법적 위험 요소를 자동으로 분석해 알려드립니다.',
      'rion.f2.title': '판례 검색 및 분석',
      'rion.f2.desc': '수십만 건의 판례 데이터베이스를 AI가 즉시 검색해 유사 사례와 법원 판단 동향을 쉽게 파악할 수 있습니다.',
      'rion.f3.title': '법률 용어 해설',
      'rion.f3.desc': '어렵고 복잡한 법률 용어를 일상 언어로 쉽게 설명해 드립니다. 법률 지식 없이도 내용을 정확히 이해할 수 있습니다.',
      'rion.f4.title': '권리 보호 가이드',
      'rion.f4.desc': '부당해고, 임금체불, 소비자 피해 등 다양한 상황에서 본인의 권리를 지키는 구체적인 방법과 절차를 안내합니다.',
      'rion.f5.title': '법률 문서 자동 생성',
      'rion.f5.desc': '내용증명, 고소장, 계약서 초안 등 각종 법률 문서를 AI가 자동으로 작성해 시간과 비용을 대폭 절감합니다.',
      'rion.f6.title': '전문 변호사 연결',
      'rion.f6.desc': 'AI 상담 후 더 전문적인 도움이 필요할 경우, 분야별 전문 변호사와 연결해 드리는 원스톱 법률 서비스를 제공합니다.',
      'rion.cta.badge': '출시 예정',
      'rion.cta.label': '출시 알림',
      'rion.cta.title': 'Rion, 곧 만나보실 수 있습니다',
      'rion.cta.desc': '이메일을 등록하시면 Rion 출시 소식을 가장 먼저 전해드립니다. 얼리 액세스 혜택도 함께 제공됩니다.',

      /* Taxon service page */
      'taxon.status': '출시 예정',
      'taxon.hero.desc': '열정과 정확성으로 당신의 재무를 관리하는 AI 서비스입니다. 복잡한 세금 신고, 자산 분석, 절세 전략까지 — Taxon이 스마트한 재무 파트너가 되어드립니다.',
      'taxon.hero.btn.primary': '출시 알림 받기',
      'taxon.hero.btn.secondary': '서비스 소개 보기',
      'taxon.intro.label': '서비스 소개',
      'taxon.intro.title': '숫자가 두렵지 않은<br>스마트 재무 관리',
      'taxon.intro.body1': 'Taxon은 복잡한 세무·회계 작업을 AI가 대신 처리해주는 재무 관리 서비스입니다. 소득 분석부터 절세 전략까지, 전문 세무사 수준의 서비스를 누구나 쉽게 이용할 수 있습니다.',
      'taxon.intro.body2': '개인 사업자, 프리랜서, 직장인 모두를 위한 맞춤형 재무 솔루션을 제공합니다. 매년 반복되는 세금 신고 스트레스를 Taxon이 해결해 드립니다.',
      'taxon.intro.btn': '출시 알림 신청',
      'taxon.features.label': '핵심 기능',
      'taxon.features.title': 'Taxon이 제공하는<br>재무 관리 솔루션',
      'taxon.f1.title': 'AI 자산 분석',
      'taxon.f1.desc': '소득, 지출, 자산 현황을 AI가 자동으로 분석해 재무 건강 지수와 개선 방향을 시각적으로 제공합니다.',
      'taxon.f2.title': '자동 세금 신고',
      'taxon.f2.desc': '종합소득세, 부가가치세, 법인세 신고를 AI가 자동으로 준비해 드립니다. 복잡한 서류 작업을 단 몇 분 만에 완료하세요.',
      'taxon.f3.title': '실시간 절세 전략',
      'taxon.f3.desc': '납부 기한과 공제 항목을 실시간으로 분석해 합법적으로 세금을 최소화할 수 있는 맞춤 절세 전략을 제안합니다.',
      'taxon.f4.title': '수익 예측 모델',
      'taxon.f4.desc': '과거 재무 데이터를 기반으로 미래 수익과 지출을 예측해 선제적인 재무 계획을 수립할 수 있도록 지원합니다.',
      'taxon.f5.title': '영수증 자동 처리',
      'taxon.f5.desc': '영수증이나 세금계산서를 촬영하면 AI가 자동으로 항목을 분류하고 경비 처리 가능 여부를 판단해 장부에 기록합니다.',
      'taxon.f6.title': '세무 전문가 연결',
      'taxon.f6.desc': '복잡한 세무 이슈가 발생할 경우 Taxon과 연동된 전문 세무사 · 공인회계사와 즉시 연결해 전문적인 조언을 받을 수 있습니다.',
      'taxon.cta.badge': '출시 예정',
      'taxon.cta.label': '출시 알림',
      'taxon.cta.title': 'Taxon, 곧 만나보실 수 있습니다',
      'taxon.cta.desc': '이메일을 등록하시면 Taxon 출시 소식을 가장 먼저 전해드립니다. 얼리 액세스 혜택도 함께 제공됩니다.',

      /* Shared CTA */
      'sp.notify.placeholder': '이메일 주소를 입력해 주세요',
      'sp.notify.btn': '출시 알림 받기',
      'sp.cta.other': '다른 서비스 보기',
    },

    en: {
      /* Navigation */
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cta': 'Try Vion',

      /* Hero (index) */
      'hero.eyebrow': 'AI-Powered Professional Services',
      'hero.title': 'AI Services<br><span class="text-gradient">for a Better Life</span>',
      'hero.sub': 'From mental care to legal and financial —<br class="hide-mobile"> expert AI by your side.',
      'hero.cta.primary': 'Try Vion Now',
      'hero.cta.secondary': 'Explore Services',
      'hero.scroll': 'Scroll',

      /* Services section (index) */
      'services.label': 'Services',
      'services.title': 'Expert AI Services<br>by Linkon',
      'services.desc': 'Our domain-specialist AIs make your life richer and more fulfilled.',

      /* Status badges */
      'badge.live': 'Live',
      'badge.soon': 'Coming Soon',

      /* Vion card (index) */
      'vion.tagline': 'Mental & Silver Care',
      'vion.desc': 'An AI counseling service that protects your mental health. From everyday stress to deep concerns — professional care anytime, anywhere.',
      'vion.btn.detail': 'Learn More',

      /* Rion card (index) */
      'rion.tagline': 'Legal Assistant',
      'rion.desc': 'A trustworthy AI legal assistant. From reviewing complex legal documents to basic consultations — your reliable legal partner.',
      'rion.btn.preview': 'Preview Service',

      /* Taxon card (index) */
      'taxon.tagline': 'Financial Management',
      'taxon.desc': 'An AI service managing your finances with passion and precision. From asset analysis to tax strategy — your smart financial partner.',
      'taxon.btn.preview': 'Preview Service',

      /* About (index) */
      'about.label': 'About Us',
      'about.title': 'Solving Life\'s Challenges<br>Through Technology',
      'about.body1': 'Linkon is a platform built to lower the barriers of specialized knowledge so everyone can access high-quality AI services.',
      'about.body2': 'Mental health, legal advice, financial management — Linkon\'s AI is by your side at every important moment in life. Clearly and simply, anytime, anywhere.',
      'about.stat1': 'Expert Services',
      'about.stat2': 'AI-Powered',
      'about.stat3': 'Always Available',

      /* Teaser (index) */
      'teaser.label': 'Coming Soon',
      'teaser.title': 'More AI Services<br>on the Way',
      'rion.teaser.tagline': '— Legal Assistant',
      'rion.teaser.desc': 'Understand complex legal documents easily with Rion. Our AI legal assistant protects your rights.',
      'taxon.teaser.tagline': '— Financial Management',
      'taxon.teaser.desc': 'Smart financial management powered by AI. From asset tracking to tax strategy — Taxon is your financial partner.',
      'notify.btn': 'Notify Me',
      'notify.placeholder': 'Enter your email address',

      /* Footer (common) */
      'footer.tagline': 'AI Service Platform for a Better Life',
      'footer.heading.services': 'Services',
      'footer.heading.contact': 'Contact',
      'footer.contact.desc': 'Have questions or suggestions? Send us an email anytime.',
      'footer.contact.desc.short': 'Contact us by email for any service inquiries.',
      'footer.contact.btn': 'Email Us',
      'footer.legal.privacy': 'Privacy Policy',
      'footer.legal.terms': 'Terms of Service',

      /* Service pages — common */
      'sp.back': 'All Services',
      'sp.scroll': 'Scroll',

      /* Vion service page */
      'vion.status': 'Now Live',
      'vion.hero.desc': 'An AI counseling service protecting your mental health. From daily stress to deep concerns and senior care — Vion is always by your side.',
      'vion.hero.btn.primary': 'Start Vion Now',
      'vion.hero.btn.secondary': 'Learn More',
      'vion.intro.label': 'About the Service',
      'vion.intro.title': 'The AI That Understands<br>Your Mind Best',
      'vion.intro.body1': 'Vion uses psychology-based AI algorithms to analyze your emotional state and deliver personalized mental health care. It stays with you 24/7 so you can prioritize wellbeing even in a busy life.',
      'vion.intro.body2': 'Silver Care features are specially designed for seniors living alone or far from family, realizing warm, cross-generational care.',
      'vion.intro.btn': 'Try for Free',
      'vion.features.label': 'Key Features',
      'vion.features.title': 'Personalized Care<br>by Vion',
      'vion.f1.title': 'AI Emotion Analysis',
      'vion.f1.desc': 'Analyzes conversation patterns and emotional expressions in real time to understand your psychological state and provide personalized advice.',
      'vion.f2.title': '24/7 Counseling',
      'vion.f2.desc': 'Talk to Vion whenever you\'re struggling — at dawn, on weekends. Always there for you.',
      'vion.f3.title': 'Silver Care',
      'vion.f3.desc': 'Specialized features for seniors: easy UI, voice interface, and health monitoring for cross-generational care.',
      'vion.f4.title': 'Personalized Care Plan',
      'vion.f4.desc': 'Suggests weekly psychological reports and personalized wellbeing plans based on conversation history to support continuous mental health.',
      'vion.f5.title': 'Complete Privacy Protection',
      'vion.f5.desc': 'All counseling content is encrypted and never shared with third parties. Speak freely without worry.',
      'vion.f6.title': 'Emotional Trend Tracking',
      'vion.f6.desc': 'Visualizes emotional changes over time so you can monitor your mental health and confirm positive progress.',
      'vion.cta.label': 'Get Started',
      'vion.cta.title': 'When You\'re Struggling,<br>Vion is There',
      'vion.cta.desc': 'Your first session is free. Meet Vion today.',
      'vion.cta.btn.primary': 'Try Vion for Free',
      'vion.cta.btn.secondary': 'Other Services',

      /* Rion service page */
      'rion.status': 'Coming Soon',
      'rion.hero.desc': 'An AI legal assistant protecting your rights with trust and authority. Complex legal documents and difficult legal procedures become simple with Rion.',
      'rion.hero.btn.primary': 'Notify Me',
      'rion.hero.btn.secondary': 'Learn More',
      'rion.intro.label': 'About the Service',
      'rion.intro.title': 'The AI Legal Partner<br>That Lowers Barriers',
      'rion.intro.body1': 'Rion is an AI legal assistant that helps anyone easily understand and resolve legal issues. It provides contract review, legal terminology explanation, dispute procedure guidance, and more.',
      'rion.intro.body2': 'AI translates specialized legal knowledge into plain language. You no longer need to face legal problems alone — Rion stands by you as a reliable protector.',
      'rion.intro.btn': 'Notify Me',
      'rion.features.label': 'Key Features',
      'rion.features.title': 'Legal Protection Services<br>by Rion',
      'rion.f1.title': 'Automated Contract Review',
      'rion.f1.desc': 'Upload a contract and AI automatically analyzes unfavorable clauses, missing items, and legal risk factors.',
      'rion.f2.title': 'Case Research & Analysis',
      'rion.f2.desc': 'AI instantly searches hundreds of thousands of case records to identify similar cases and court ruling trends.',
      'rion.f3.title': 'Legal Term Explanations',
      'rion.f3.desc': 'Explains complex legal terms in everyday language. Understand the content accurately without any legal background.',
      'rion.f4.title': 'Rights Protection Guide',
      'rion.f4.desc': 'Guides you through specific methods and procedures to protect your rights in situations like unfair dismissal, wage theft, and consumer damage.',
      'rion.f5.title': 'Automated Legal Document Creation',
      'rion.f5.desc': 'AI automatically drafts written notices, complaints, contract drafts and more — significantly saving time and cost.',
      'rion.f6.title': 'Connect with Expert Lawyers',
      'rion.f6.desc': 'When you need more specialized help after AI consultation, we connect you with field-expert attorneys for one-stop legal service.',
      'rion.cta.badge': 'Coming Soon',
      'rion.cta.label': 'Get Notified',
      'rion.cta.title': 'Rion is Coming Soon',
      'rion.cta.desc': 'Register your email to be the first to hear about Rion\'s launch. Early access benefits included.',

      /* Taxon service page */
      'taxon.status': 'Coming Soon',
      'taxon.hero.desc': 'An AI service managing your finances with passion and precision. From complex tax filings and asset analysis to tax strategy — Taxon is your smart financial partner.',
      'taxon.hero.btn.primary': 'Notify Me',
      'taxon.hero.btn.secondary': 'Learn More',
      'taxon.intro.label': 'About the Service',
      'taxon.intro.title': 'Smart Financial Management<br>Without the Fear of Numbers',
      'taxon.intro.body1': 'Taxon is a financial management service where AI handles complex tax and accounting tasks. From income analysis to tax strategy — anyone can access professional CPA-level service.',
      'taxon.intro.body2': 'Provides customized financial solutions for sole proprietors, freelancers, and employees alike. Let Taxon resolve the annual stress of tax filing.',
      'taxon.intro.btn': 'Notify Me',
      'taxon.features.label': 'Key Features',
      'taxon.features.title': 'Financial Management Solutions<br>by Taxon',
      'taxon.f1.title': 'AI Asset Analysis',
      'taxon.f1.desc': 'AI automatically analyzes income, expenses, and assets to visually provide a financial health index and improvement direction.',
      'taxon.f2.title': 'Automated Tax Filing',
      'taxon.f2.desc': 'AI automatically prepares income tax, VAT, and corporate tax filings. Complete complex paperwork in just minutes.',
      'taxon.f3.title': 'Real-Time Tax Strategy',
      'taxon.f3.desc': 'Analyzes payment deadlines and deductible items in real time to suggest personalized tax minimization strategies within legal bounds.',
      'taxon.f4.title': 'Revenue Forecast Model',
      'taxon.f4.desc': 'Predicts future income and expenses based on past financial data to help you establish proactive financial plans.',
      'taxon.f5.title': 'Automated Receipt Processing',
      'taxon.f5.desc': 'Photograph receipts or tax invoices and AI automatically classifies items, judges expense eligibility, and records them in the ledger.',
      'taxon.f6.title': 'Connect with Tax Experts',
      'taxon.f6.desc': 'When complex tax issues arise, we instantly connect you with Taxon-affiliated tax accountants and CPAs for professional advice.',
      'taxon.cta.badge': 'Coming Soon',
      'taxon.cta.label': 'Get Notified',
      'taxon.cta.title': 'Taxon is Coming Soon',
      'taxon.cta.desc': 'Register your email to be the first to hear about Taxon\'s launch. Early access benefits included.',

      /* Shared CTA */
      'sp.notify.placeholder': 'Enter your email address',
      'sp.notify.btn': 'Notify Me',
      'sp.cta.other': 'Other Services',
    }
  };

  /* ===== Core logic ===== */
  var currentLang = localStorage.getItem('linkon-lang') || 'ko';

  function t(key) {
    var dict = TRANSLATIONS[currentLang];
    return (dict && dict[key] !== undefined) ? dict[key] : (TRANSLATIONS.ko[key] || key);
  }

  function applyTranslations() {
    /* Plain text */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    /* HTML content (allows <br>, <span>, etc.) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    /* Placeholder attribute */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    /* <html lang> attribute */
    document.documentElement.lang = currentLang;

    /* Sync button states */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === currentLang);
    });
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('linkon-lang', lang);
    applyTranslations();
  }

  function initLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  function init() {
    applyTranslations();
    initLangButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
