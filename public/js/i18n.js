/* ===== LINKON i18n (KO / EN) ===== */
(function () {
  'use strict';

  var TRANSLATIONS = {
    ko: {
      'nav.services': '서비스',
      'nav.about': '회사 소개',
      'nav.contact': '문의하기',
      'nav.cta': 'Vion 시작하기',
      'nav.aria.primary': '주요 메뉴',
      'lang.toggle': '언어 선택',

      'hero.eyebrow': 'AI 기반 전문 서비스 플랫폼',
      'hero.title': '더 나은 삶을 위한<br><span class="text-gradient">AI 서비스</span>',
      'hero.sub': '심리 케어부터 법률, 재무까지<br class="hide-mobile"> 삶의 중요한 순간마다 전문 AI가 함께합니다.',
      'hero.cta.primary': 'Vion 체험하기',
      'hero.cta.secondary': '서비스 살펴보기',
      'hero.scroll': '스크롤',

      'services.label': '서비스',
      'services.title': 'Linkon이 제공하는<br>전문 AI 서비스',
      'services.desc': '각 분야에 특화된 AI가 더 명확하고 더 따뜻한 방식으로 당신의 결정을 돕습니다.',

      'badge.live': '서비스 중',
      'badge.soon': '출시 예정',

      'vion.tagline': '심리 및 실버 케어',
      'vion.desc': '마음의 건강을 지키는 AI 심리 상담 서비스입니다. 일상의 스트레스부터 깊은 고민까지, 언제 어디서나 전문적인 심리 케어를 받아보세요.',
      'vion.btn.detail': '서비스 자세히 보기',

      'rion.tagline': '법률 비서',
      'rion.desc': '복잡한 법률 문서와 절차를 쉽게 이해하도록 돕는 AI 법률 파트너입니다. 계약 검토부터 기본 상담까지 신뢰할 수 있는 안내를 제공합니다.',
      'rion.btn.preview': '서비스 미리 보기',

      'taxon.tagline': '재무 관리',
      'taxon.desc': '자산 분석부터 절세 전략까지 더 선명한 판단을 돕는 AI 재무 서비스입니다. 숫자 앞에서 망설이지 않도록 실질적인 인사이트를 제공합니다.',
      'taxon.btn.preview': '서비스 미리 보기',

      'about.label': '회사 소개',
      'about.title': '기술로 삶의 문제를<br>해결합니다',
      'about.body1': 'Linkon은 전문 지식의 장벽을 낮추고 누구나 고품질의 AI 서비스를 누릴 수 있도록 설계된 서비스 플랫폼입니다.',
      'about.body2': '심리 상담, 법률 자문, 재무 관리까지 삶의 중요한 순간마다 Linkon의 AI가 곁에서 돕습니다. 복잡한 문제를 단순하고 명확하게, 언제 어디서나.',
      'about.stat1': '전문 서비스',
      'about.stat2': 'AI 기반',
      'about.stat3': '언제 어디서나',
      'about.diagram.core.label': 'Linkon',
      'about.diagram.core.copy': '세 가지 전문 AI 서비스가 하나의 플랫폼에서 연결됩니다.',
      'about.diagram.detail.eyebrow': 'Service Focus',
      'about.diagram.vion.tag': '마음과 일상의 케어',
      'about.diagram.vion.aria': 'Vion 서비스 설명 보기',
      'about.diagram.vion.desc': '감정 분석과 대화 기반 케어를 통해 언제든 기대어 쉴 수 있는 심리 AI입니다.',
      'about.diagram.rion.tag': '법률의 장벽을 낮추는 안내',
      'about.diagram.rion.aria': 'Rion 서비스 설명 보기',
      'about.diagram.rion.desc': '어려운 법률 문서와 절차를 일상 언어로 풀어내는 AI 법률 파트너입니다.',
      'about.diagram.taxon.tag': '숫자를 더 선명하게 보는 시선',
      'about.diagram.taxon.aria': 'Taxon 서비스 설명 보기',
      'about.diagram.taxon.desc': '자산 분석부터 절세 전략까지 재무 의사결정을 더 정확하게 돕는 AI입니다.',

      'teaser.label': '곧 만나보세요',
      'teaser.title': '더 많은 AI 서비스가<br>출시 예정입니다',
      'teaser.tabs.aria': '출시 예정 서비스 탭',
      'rion.teaser.tagline': '법률 비서',
      'rion.teaser.desc': '복잡한 법률 문서도 Rion과 함께라면 쉽게 이해할 수 있습니다. AI 법률 비서가 당신의 권리를 지켜드립니다.',
      'taxon.teaser.tagline': '재무 관리',
      'taxon.teaser.desc': 'AI가 분석하는 스마트한 재무 관리. 자산 현황 파악부터 절세 전략까지, Taxon이 당신의 재무 파트너가 되어드립니다.',
      'notify.btn': '출시 알림 받기',
      'notify.placeholder': '이메일 주소를 입력해 주세요',
      'notify.aria.email': '이메일 주소',
      'notify.success': '감사합니다. 출시 소식을 가장 먼저 전해드릴게요.',
      'notify.error': '올바른 이메일 주소를 입력해 주세요.',
      'notify.loading': '처리 중...',

      'feedback.label': '함께 만들어가는 Linkon',
      'feedback.title': '의견을 보내주세요',
      'feedback.desc': '새로운 기능 아이디어, 불편한 점, 개선 제안이 있으시면 언제든지 이메일로 알려주세요. 여러분의 목소리가 Linkon을 더 좋은 서비스로 만드는 가장 직접적인 방법입니다.',
      'feedback.btn': '의견 보내기',
      'feedback.sub': '빠른 시일 내에 검토 후 서비스 개선에 반영하겠습니다.',

      'footer.tagline': '더 나은 삶을 위한 AI 서비스 플랫폼',
      'footer.heading.services': '서비스',
      'footer.heading.contact': '문의하기',
      'footer.contact.desc': '서비스 관련 문의 또는 제안이 있으시면 이메일로 연락해 주세요.',
      'footer.contact.desc.short': '서비스 관련 문의는 이메일로 연락해 주세요.',
      'footer.contact.btn': '이메일 문의',
      'footer.legal.privacy': '개인정보처리방침',
      'footer.legal.terms': '이용약관',
      'footer.services.vion': 'Vion — 심리 및 실버 케어',
      'footer.services.rion': 'Rion — 법률 비서 <em>(출시 예정)</em>',
      'footer.services.taxon': 'Taxon — 재무 관리 <em>(출시 예정)</em>',

      'sp.back': '모든 서비스 보기',
      'sp.scroll': '스크롤',
      'sp.notify.placeholder': '이메일 주소를 입력해 주세요',
      'sp.notify.btn': '출시 알림 받기',
      'sp.cta.other': '다른 서비스 보기',

      'vion.status': '현재 서비스 중',
      'vion.hero.desc': '마음의 건강을 지키는 AI 심리 상담 서비스입니다. 일상의 스트레스부터 깊은 고민, 실버 케어까지 Vion이 언제나 곁에 있습니다.',
      'vion.hero.btn.primary': '지금 Vion 시작하기',
      'vion.hero.btn.secondary': '서비스 소개 보기',
      'vion.intro.label': '서비스 소개',
      'vion.intro.title': '당신의 마음을<br>가장 잘 이해하는 AI',
      'vion.intro.body1': 'Vion은 심리학 기반 AI 알고리즘을 활용해 사용자의 감정 상태를 분석하고 맞춤형 심리 케어를 제공합니다. 바쁜 일상 속에서도 마음의 건강을 챙길 수 있도록 24시간 곁을 지킵니다.',
      'vion.intro.body2': '실버 케어 기능은 혼자 계신 어르신이나 가족과 멀리 떨어진 분들을 위해 설계되어, 세대를 아우르는 따뜻한 돌봄 경험을 제공합니다.',
      'vion.intro.btn': '무료로 체험하기',
      'vion.features.label': '핵심 기능',
      'vion.features.title': 'Vion이 제공하는<br>맞춤형 케어',
      'vion.f1.title': 'AI 감정 분석',
      'vion.f1.desc': '대화 패턴과 감정 표현을 실시간으로 분석해 현재 심리 상태를 파악하고 맞춤형 조언을 제공합니다.',
      'vion.f2.title': '24시간 상담',
      'vion.f2.desc': '언제든지 마음이 힘들 때 Vion과 대화할 수 있습니다. 새벽에도, 주말에도 항상 곁에 있습니다.',
      'vion.f3.title': '실버 케어',
      'vion.f3.desc': '어르신을 위한 특화 기능으로 쉬운 UI, 음성 인터페이스, 건강 모니터링까지 세대를 아우르는 돌봄을 제공합니다.',
      'vion.f4.title': '맞춤 케어 플랜',
      'vion.f4.desc': '대화 기록을 바탕으로 주간 심리 리포트와 개인화된 웰빙 계획을 제안해 지속적인 마음 건강을 지원합니다.',
      'vion.f5.title': '완벽한 개인정보 보호',
      'vion.f5.desc': '모든 상담 내용은 암호화되어 저장되며 제3자에게 절대 공유되지 않습니다. 안심하고 마음을 이야기해 보세요.',
      'vion.f6.title': '감정 추이 트래킹',
      'vion.f6.desc': '시간에 따른 감정 변화를 시각화해 스스로 마음 건강 상태를 모니터링하고 긍정적인 변화를 확인할 수 있습니다.',
      'vion.cta.label': '지금 시작하세요',
      'vion.cta.title': '마음이 힘들 때,<br>Vion이 함께합니다',
      'vion.cta.desc': '첫 상담은 무료입니다. 지금 바로 Vion을 만나보세요.',
      'vion.cta.btn.primary': 'Vion 무료 체험하기',
      'vion.cta.btn.secondary': '다른 서비스 보기',

      'rion.status': '출시 예정',
      'rion.hero.desc': '신뢰와 전문성을 바탕으로 당신의 권리를 지켜주는 AI 법률 비서입니다. 복잡한 법률 문서와 어려운 절차도 Rion과 함께라면 훨씬 명확해집니다.',
      'rion.hero.btn.primary': '출시 알림 받기',
      'rion.hero.btn.secondary': '서비스 소개 보기',
      'rion.intro.label': '서비스 소개',
      'rion.intro.title': '법률의 장벽을 낮추는<br>AI 법률 파트너',
      'rion.intro.body1': 'Rion은 복잡하고 낯선 법률 문제를 누구나 쉽게 이해하고 대응할 수 있도록 돕는 AI 법률 비서입니다. 계약 검토, 법률 용어 해설, 분쟁 절차 안내까지 폭넓게 지원합니다.',
      'rion.intro.body2': '전문적인 법률 지식을 일상 언어로 풀어내어 더 이상 법률 문제 앞에서 혼자 망설이지 않도록 돕습니다. Rion은 믿을 수 있는 보호자로서 곁에 있습니다.',
      'rion.intro.btn': '출시 알림 요청',
      'rion.features.label': '핵심 기능',
      'rion.features.title': 'Rion이 제공하는<br>법률 보호 서비스',
      'rion.f1.title': '계약서 자동 검토',
      'rion.f1.desc': '계약서를 업로드하면 AI가 불리한 조항, 누락된 항목, 법적 위험 요소를 자동으로 분석해 알려드립니다.',
      'rion.f2.title': '판례 검색 및 분석',
      'rion.f2.desc': '방대한 판례 데이터베이스를 AI가 빠르게 검색해 유사 사례와 법원 판단 흐름을 쉽게 파악할 수 있습니다.',
      'rion.f3.title': '법률 용어 해설',
      'rion.f3.desc': '어렵고 복잡한 법률 용어를 일상 언어로 쉽게 설명해 드립니다. 법률 지식이 없어도 내용을 정확히 이해할 수 있습니다.',
      'rion.f4.title': '권리 보호 가이드',
      'rion.f4.desc': '부당해고, 임금체불, 소비자 피해 등 다양한 상황에서 자신의 권리를 지키는 구체적인 방법과 절차를 안내합니다.',
      'rion.f5.title': '법률 문서 자동 생성',
      'rion.f5.desc': '내용증명, 고소장, 계약서 초안 등 각종 법률 문서를 AI가 자동으로 작성해 시간과 비용을 크게 줄여줍니다.',
      'rion.f6.title': '전문 변호사 연결',
      'rion.f6.desc': 'AI 상담 이후 더 전문적인 도움이 필요하면 분야별 전문 변호사와 연계해 원스톱 법률 서비스를 제공합니다.',
      'rion.cta.badge': '출시 예정',
      'rion.cta.label': '출시 알림',
      'rion.cta.title': 'Rion, 곧 만나보실 수 있습니다',
      'rion.cta.desc': '이메일을 등록하시면 Rion 출시 소식을 가장 먼저 전해드립니다. 얼리 액세스 혜택도 함께 제공될 예정입니다.',

      'taxon.status': '출시 예정',
      'taxon.hero.desc': '정확하고 선명한 데이터 기반으로 당신의 재무를 관리하는 AI 서비스입니다. 복잡한 세금 신고와 자산 분석, 절세 전략까지 Taxon이 함께합니다.',
      'taxon.hero.btn.primary': '출시 알림 받기',
      'taxon.hero.btn.secondary': '서비스 소개 보기',
      'taxon.intro.label': '서비스 소개',
      'taxon.intro.title': '숫자가 두렵지 않은<br>스마트 재무 관리',
      'taxon.intro.body1': 'Taxon은 복잡한 세무와 회계 작업을 AI가 대신 정리해 주는 재무 관리 서비스입니다. 소득 분석부터 절세 전략까지 전문적인 재무 인사이트를 더 쉽게 제공합니다.',
      'taxon.intro.body2': '개인 사업자, 프리랜서, 직장인 모두에게 맞는 재무 솔루션을 제공하며, 매년 반복되는 세금 신고 스트레스를 줄여줍니다.',
      'taxon.intro.btn': '출시 알림 요청',
      'taxon.features.label': '핵심 기능',
      'taxon.features.title': 'Taxon이 제공하는<br>재무 관리 솔루션',
      'taxon.f1.title': 'AI 자산 분석',
      'taxon.f1.desc': '소득, 지출, 자산 현황을 AI가 자동으로 분석해 재무 건강 지수와 개선 방향을 시각적으로 제공합니다.',
      'taxon.f2.title': '자동 세금 신고',
      'taxon.f2.desc': '종합소득세, 부가가치세, 법인세 신고를 AI가 자동으로 준비해 드립니다. 복잡한 서류 작업을 단 몇 분 만에 끝낼 수 있습니다.',
      'taxon.f3.title': '실시간 절세 전략',
      'taxon.f3.desc': '납부 기한과 공제 항목을 실시간으로 분석해 합법적으로 세금을 줄일 수 있는 맞춤 절세 전략을 제안합니다.',
      'taxon.f4.title': '수익 예측 모델',
      'taxon.f4.desc': '과거 재무 데이터를 기반으로 미래 수익과 지출을 예측해 선제적인 재무 계획 수립을 돕습니다.',
      'taxon.f5.title': '영수증 자동 처리',
      'taxon.f5.desc': '영수증이나 세금계산서를 촬영하면 AI가 자동으로 항목을 분류하고 경비 처리 가능 여부를 판단해 장부에 기록합니다.',
      'taxon.f6.title': '세무 전문가 연결',
      'taxon.f6.desc': '복잡한 세무 이슈가 발생할 경우 Taxon과 연동된 전문 세무사 및 공인회계사와 즉시 연결해 조언을 받을 수 있습니다.',
      'taxon.cta.badge': '출시 예정',
      'taxon.cta.label': '출시 알림',
      'taxon.cta.title': 'Taxon, 곧 만나보실 수 있습니다',
      'taxon.cta.desc': '이메일을 등록하시면 Taxon 출시 소식을 가장 먼저 전해드립니다. 얼리 액세스 혜택도 함께 제공될 예정입니다.',

      'experts.label': '전문가와 함께',
      'experts.title': 'AI와 전문가가<br>함께 만드는 신뢰',
      'experts.desc': 'Linkon의 모든 AI는 각 분야 현직 전문가가 직접 설계하고, 실제 판례·임상 기록을 기반으로 지속적으로 고도화됩니다.',
      'experts.vion.tag': 'VION · 임상심리 상담사',
      'experts.vion.title': '실제 임상 기록 기반 상담',
      'experts.vion.desc': '국내 임상심리 전문가가 직접 프롬프트를 설계하고, 실제 상담 사례와 임상 기록을 바탕으로 AI의 답변 품질을 지속 관리합니다.',
      'experts.rion.tag': 'RION · 변호사',
      'experts.rion.title': '실제 판례 기반 법률 상담',
      'experts.rion.desc': '현직 변호사가 실제 판례를 기반으로 AI를 직접 교육합니다. 유료 회원에게는 Linkon 소속 변호사의 직인이 포함된 <strong style="color:black;">공식 법률 문서</strong>(고소장 등)를 발급합니다.',
      'experts.taxon.tag': 'TAXON · 공인회계사 · 세무사',
      'experts.taxon.title': '실제 세무 기록 기반 재무 관리',
      'experts.taxon.desc': '공인회계사와 세무사가 실제 세무 데이터를 기반으로 AI를 설계합니다. 유료 회원에게는 Linkon 소속 전문가의 직인이 포함된 <strong style="color:black;">공식 세무 문서</strong>를 발급합니다.',
      
      'premium.stamp': 'Linkon<br/>인증장',
      'premium.feature': 'PREMIUM FEATURE',
      'premium.title': '전문가 직인이 들어간 공식 문서 발급',
      'premium.desc': 'AI가 전문가가 제공한 양식을 바탕으로 초안을 작성하고, Linkon 소속 변호사 및 회계사가 <strong>직접 검수 후 직인을 날인합니다.</strong> 고소장, 내용증명, 세금 신고서 등 법적 효력이 있는 공식 문서를 유료 회원에 한해 즉시 발급받으세요.',
      'premium.tag.legal': '⚖ 법률 문서',
      'premium.tag.tax': '📋 세무 문서',

      'premium.eyebrow': 'PREMIUM · 유료 회원 전용',
      'premium.rion.title': 'AI가 작성하고 변호사가 검수한<br>공식 법률 문서 발급',
      'premium.rion.desc': 'Rion AI가 변호사가 제공한 양식을 기반으로 사건 내용을 작성하고, Linkon 소속 변호사가 직접 검수 후 공식 직인을 날인합니다. 큰 비용을 들이지 않고도 공식 법적 보호를 얻을 수 있습니다.',
      'premium.step1.label': '① AI 작성',
      'premium.rion.step1': '변호사 양식에 맞춰 AI가 작성',
      'premium.step2.label': '② 전문가 검수',
      'premium.rion.step2': 'Linkon 소속 변호사 확인',
      'premium.step3.label': '③ 공식 직인',
      'premium.step3.desc': '공식 직인 포함 문서 발급',
      'premium.example.label': '발급 문서 예시',
      'premium.rion.examples': '• 고소장<br>• 내용증명<br>• 질의서 · 답변서<br>• 계약서 초안',

      'premium.taxon.title': 'AI가 작성하고 전문가가 검수한<br>공식 세무 문서 발급',
      'premium.taxon.desc': 'Taxon AI가 공인회계사·세무사가 제공한 양식을 기반으로 세무 문서를 작성하고, Linkon 소속 전문가가 직접 검수 후 공식 직인을 날인합니다. 허위 신고를 예방하는 정확한 세무 서류를 손쉽게 얻으세요.',
      'premium.taxon.step1': '전문가 양식에 맞춰 AI가 작성',
      'premium.taxon.step2': '공인회계사·세무사 확인',
      'premium.taxon.examples': '• 종합소득세 신고서<br>• 부가가치세 신고서<br>• 세금 조정신청서<br>• 경비 처리 및 세무 확인서'
    },

    en: {
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cta': 'Try Vion',
      'nav.aria.primary': 'Primary navigation',
      'lang.toggle': 'Language selection',

      'hero.eyebrow': 'AI-Powered Professional Services',
      'hero.title': 'AI Services<br><span class="text-gradient">for a Better Life</span>',
      'hero.sub': 'From mental wellness to legal and financial guidance,<br class="hide-mobile"> expert AI is with you when it matters most.',
      'hero.cta.primary': 'Try Vion',
      'hero.cta.secondary': 'Explore Services',
      'hero.scroll': 'Scroll',

      'services.label': 'Services',
      'services.title': 'Specialized AI Services<br>by Linkon',
      'services.desc': 'Each service is designed to make difficult decisions feel clearer, faster, and more human.',

      'badge.live': 'Live',
      'badge.soon': 'Coming Soon',

      'vion.tagline': 'Mental Wellness & Senior Care',
      'vion.desc': 'An AI counseling service designed to protect your mental wellbeing. From daily stress to deeper concerns, Vion offers thoughtful support whenever you need it.',
      'vion.btn.detail': 'Explore Service',

      'rion.tagline': 'Legal Assistant',
      'rion.desc': 'An AI legal partner that helps you understand documents and procedures with confidence. From contract review to basic guidance, Rion makes legal support more approachable.',
      'rion.btn.preview': 'Preview Service',

      'taxon.tagline': 'Financial Management',
      'taxon.desc': 'An AI financial service built to sharpen decision-making. From asset analysis to tax planning, Taxon brings clarity to the numbers behind your next move.',
      'taxon.btn.preview': 'Preview Service',

      'about.label': 'About',
      'about.title': 'Solving Real-Life Problems<br>with Technology',
      'about.body1': 'Linkon is a service platform built to lower the barrier to specialized knowledge and make high-quality AI support accessible to more people.',
      'about.body2': 'From mental care to legal guidance and financial management, Linkon is designed to support people at life’s most important moments with clarity, speed, and warmth.',
      'about.stat1': 'Specialized Services',
      'about.stat2': 'AI Native',
      'about.stat3': 'Always Available',
      'about.diagram.core.label': 'Linkon',
      'about.diagram.core.copy': 'Three specialized AI services, connected through one platform.',
      'about.diagram.detail.eyebrow': 'Service Focus',
      'about.diagram.vion.tag': 'Care for mind and daily life',
      'about.diagram.vion.aria': 'View Vion service description',
      'about.diagram.vion.desc': 'A mental wellness AI built around conversation, emotional insight, and care you can return to anytime.',
      'about.diagram.rion.tag': 'Guidance that lowers legal barriers',
      'about.diagram.rion.aria': 'View Rion service description',
      'about.diagram.rion.desc': 'An AI legal partner that translates complex documents and procedures into plain, actionable language.',
      'about.diagram.taxon.tag': 'A sharper view of the numbers',
      'about.diagram.taxon.aria': 'View Taxon service description',
      'about.diagram.taxon.desc': 'An AI designed to support smarter financial decisions, from asset analysis to proactive tax strategy.',

      'teaser.label': 'Coming Soon',
      'teaser.title': 'More AI Services<br>Are on the Way',
      'teaser.tabs.aria': 'Upcoming service tabs',
      'rion.teaser.tagline': 'Legal Assistant',
      'rion.teaser.desc': 'Rion helps you make sense of complex legal documents and procedures with practical, trustworthy AI guidance.',
      'taxon.teaser.tagline': 'Financial Management',
      'taxon.teaser.desc': 'Taxon brings AI-powered clarity to financial planning, from understanding your assets to shaping smarter tax decisions.',
      ‘notify.btn’: ‘Notify Me’,
      ‘notify.placeholder’: ‘Enter your email address’,
      ‘notify.aria.email’: ‘Email address’,
      ‘notify.success’: ‘Thanks. We’ll make sure you hear about the launch first.’,
      ‘notify.error’: ‘Please enter a valid email address.’,
      ‘notify.loading’: ‘Processing...’,

      ‘feedback.label’: ‘Shape Linkon with Us’,
      ‘feedback.title’: ‘Share Your Thoughts’,
      ‘feedback.desc’: ‘Have a feature idea, spotted something off, or want to suggest an improvement? Drop us a line anytime. Your feedback is the most direct way to make Linkon better.’,
      ‘feedback.btn’: ‘Send Feedback’,
      ‘feedback.sub’: ‘We review every message and aim to reflect your input in future updates.’,

      'footer.tagline': 'An AI service platform for a better life',
      'footer.heading.services': 'Services',
      'footer.heading.contact': 'Contact',
      'footer.contact.desc': 'Questions, feedback, or partnership ideas? Reach us anytime by email.',
      'footer.contact.desc.short': 'For service-related inquiries, feel free to reach out by email.',
      'footer.contact.btn': 'Email Us',
      'footer.legal.privacy': 'Privacy Policy',
      'footer.legal.terms': 'Terms of Service',
      'footer.services.vion': 'Vion — Mental Wellness & Senior Care',
      'footer.services.rion': 'Rion — Legal Assistant <em>(Coming Soon)</em>',
      'footer.services.taxon': 'Taxon — Financial Management <em>(Coming Soon)</em>',

      'sp.back': 'View All Services',
      'sp.scroll': 'Scroll',
      'sp.notify.placeholder': 'Enter your email address',
      'sp.notify.btn': 'Notify Me',
      'sp.cta.other': 'See Other Services',

      'vion.status': 'Now Live',
      'vion.hero.desc': 'An AI counseling service built to protect your mental wellbeing. From everyday stress to deeper concerns and senior care, Vion stays close when support matters most.',
      'vion.hero.btn.primary': 'Start Vion Now',
      'vion.hero.btn.secondary': 'About the Service',
      'vion.intro.label': 'About the Service',
      'vion.intro.title': 'The AI That Understands<br>Your State of Mind',
      'vion.intro.body1': 'Vion uses psychology-based AI to understand emotional patterns and deliver personalized mental wellness support. It is designed to stay with you throughout the day, even when life feels busy or overwhelming.',
      'vion.intro.body2': 'Its senior care features are built for people living alone or apart from family, extending warm, thoughtful support across generations.',
      'vion.intro.btn': 'Try It Free',
      'vion.features.label': 'Key Features',
      'vion.features.title': 'Personalized Care,<br>Powered by Vion',
      'vion.f1.title': 'AI Emotion Analysis',
      'vion.f1.desc': 'Vion reads emotional signals in real time to understand how you are feeling and respond with more relevant guidance.',
      'vion.f2.title': '24/7 Conversations',
      'vion.f2.desc': 'Whenever you need a place to talk, Vion is available, including late nights, early mornings, and weekends.',
      'vion.f3.title': 'Senior Care',
      'vion.f3.desc': 'Specialized features such as a simpler UI, voice interaction, and wellbeing support make Vion more accessible for older adults.',
      'vion.f4.title': 'Personal Care Plans',
      'vion.f4.desc': 'Conversation history is transformed into weekly emotional summaries and personalized care suggestions you can actually use.',
      'vion.f5.title': 'Privacy by Design',
      'vion.f5.desc': 'Your conversations are encrypted and never shared with third parties, so you can speak freely and confidently.',
      'vion.f6.title': 'Emotional Trend Tracking',
      'vion.f6.desc': 'Track emotional changes over time and see progress more clearly through a calm, visual overview of your wellbeing.',
      'vion.cta.label': 'Get Started',
      'vion.cta.title': 'When Things Feel Heavy,<br>Vion Is There',
      'vion.cta.desc': 'Your first session is free. Meet Vion today and start with support that feels immediate and personal.',
      'vion.cta.btn.primary': 'Try Vion for Free',
      'vion.cta.btn.secondary': 'See Other Services',

      'rion.status': 'Coming Soon',
      'rion.hero.desc': 'A reliable AI legal assistant built to protect your rights with clarity and confidence. Rion helps make documents, decisions, and procedures easier to understand.',
      'rion.hero.btn.primary': 'Notify Me',
      'rion.hero.btn.secondary': 'About the Service',
      'rion.intro.label': 'About the Service',
      'rion.intro.title': 'An AI Legal Partner<br>That Lowers the Barrier',
      'rion.intro.body1': 'Rion is designed to help more people understand and respond to legal issues with confidence. It supports contract review, legal term explanation, and procedural guidance in one streamlined experience.',
      'rion.intro.body2': 'By translating specialized legal knowledge into plain language, Rion helps users navigate difficult moments without feeling left behind or overwhelmed.',
      'rion.intro.btn': 'Request Launch Updates',
      'rion.features.label': 'Key Features',
      'rion.features.title': 'Legal Protection Tools<br>from Rion',
      'rion.f1.title': 'Automated Contract Review',
      'rion.f1.desc': 'Upload a contract and Rion highlights unfavorable clauses, missing items, and potential legal risks in minutes.',
      'rion.f2.title': 'Case Search & Analysis',
      'rion.f2.desc': 'Rion quickly searches large case datasets to surface similar decisions and help you understand likely legal direction.',
      'rion.f3.title': 'Plain-Language Legal Terms',
      'rion.f3.desc': 'Complex legal vocabulary is rewritten into everyday language so the meaning is clear without specialist knowledge.',
      'rion.f4.title': 'Rights Protection Guidance',
      'rion.f4.desc': 'Get actionable guidance for real-life issues such as unfair dismissal, unpaid wages, consumer disputes, and more.',
      'rion.f5.title': 'Automated Legal Drafting',
      'rion.f5.desc': 'From certified letters to complaint drafts, Rion helps generate essential legal documents with less time and friction.',
      'rion.f6.title': 'Lawyer Connections',
      'rion.f6.desc': 'When a case needs deeper expertise, Rion can guide users toward relevant legal professionals for the next step.',
      'rion.cta.badge': 'Coming Soon',
      'rion.cta.label': 'Launch Updates',
      'rion.cta.title': 'Rion Is Launching Soon',
      'rion.cta.desc': 'Sign up with your email to hear about the launch first and receive early-access updates as they become available.',

      'taxon.status': 'Coming Soon',
      'taxon.hero.desc': 'An AI financial service built for more precise decisions. From tax filing and asset analysis to proactive savings strategy, Taxon helps you stay ahead.',
      'taxon.hero.btn.primary': 'Notify Me',
      'taxon.hero.btn.secondary': 'About the Service',
      'taxon.intro.label': 'About the Service',
      'taxon.intro.title': 'Smart Financial Management<br>Without the Anxiety',
      'taxon.intro.body1': 'Taxon helps simplify complex financial and tax workflows with AI. From income analysis to smarter tax planning, it turns professional-grade insight into a more approachable experience.',
      'taxon.intro.body2': 'Whether you are a freelancer, business owner, or employee, Taxon is designed to reduce recurring tax stress and support clearer day-to-day decisions.',
      'taxon.intro.btn': 'Request Launch Updates',
      'taxon.features.label': 'Key Features',
      'taxon.features.title': 'Financial Management Tools<br>from Taxon',
      'taxon.f1.title': 'AI Asset Analysis',
      'taxon.f1.desc': 'Taxon analyzes income, expenses, and assets to surface a clearer picture of financial health and where to improve.',
      'taxon.f2.title': 'Automated Tax Filing',
      'taxon.f2.desc': 'Taxon helps prepare major tax filings automatically, reducing paperwork and making deadlines easier to manage.',
      'taxon.f3.title': 'Real-Time Tax Strategy',
      'taxon.f3.desc': 'Identify deductions, deadlines, and tax-saving opportunities in real time with more tailored recommendations.',
      'taxon.f4.title': 'Revenue Forecasting',
      'taxon.f4.desc': 'Use past financial data to anticipate future revenue and spending, then plan ahead with more confidence.',
      'taxon.f5.title': 'Automated Receipt Processing',
      'taxon.f5.desc': 'Snap receipts or invoices and Taxon organizes them automatically, checking category and expense eligibility as it goes.',
      'taxon.f6.title': 'Expert Tax Connections',
      'taxon.f6.desc': 'When more complex issues arise, Taxon helps connect users with qualified tax professionals for next-step guidance.',
      'taxon.cta.badge': 'Coming Soon',
      'taxon.cta.label': 'Launch Updates',
      'taxon.cta.title': 'Taxon Is Launching Soon',
      'taxon.cta.desc': 'Join the list to hear about the launch first and receive early-access news as Taxon gets ready to open up.',

      'experts.label': 'Guided by Experts',
      'experts.title': 'Trust Built Together by<br>AI and Professionals',
      'experts.desc': 'Every Linkon AI is directly guided by active professionals in their fields, continuously improving based on real precedents and clinical records.',
      'experts.vion.tag': 'VION · Clinical Psychologist',
      'experts.vion.title': 'Counseling Based on Real Clinical Records',
      'experts.vion.desc': 'Certified clinical psychologists design the prompts and manage the AI’s response quality based on real counseling cases and clinical data.',
      'experts.rion.tag': 'RION · Attorney-at-Law',
      'experts.rion.title': 'Legal Advice Based on Real Precedents',
      'experts.rion.desc': 'Active lawyers directly train the AI using real court precedents. Premium members receive <strong>Official Legal Documents</strong> (e.g., complaints) bearing the official seal of a Linkon attorney.',
      'experts.taxon.tag': 'TAXON · CPA · Tax Accountant',
      'experts.taxon.title': 'Financial Management Based on Real Tax Data',
      'experts.taxon.desc': 'Certified Public Accountants and tax specialists design the AI based on actual tax data. Premium members receive <strong>Official Tax Documents</strong> bearing the official seal of a Linkon expert.',
      
      'premium.stamp': 'Linkon<br/>Certified',
      'premium.feature': 'PREMIUM FEATURE',
      'premium.title': 'Official Document Issuance with Expert Seal',
      'premium.desc': 'AI drafts the initial document based on expert-provided templates. Then, Linkon’s in-house lawyers and accountants <strong>review and seal it directly.</strong> Get legally effective official documents—such as complaints, certified content proofs, and tax returns—instantly, exclusively for paid members.',
      'premium.tag.legal': '⚖ Legal Documents',
      'premium.tag.tax': '📋 Tax Documents',

      'premium.eyebrow': 'PREMIUM · Paid Members Only',
      'premium.rion.title': 'Official Legal Documents<br>Drafted by AI, Reviewed by Lawyers',
      'premium.rion.desc': 'Rion AI drafts the case details based on forms provided by lawyers, and a Linkon attorney personally reviews and affixes the official seal. Gain official legal protection without exorbitant costs.',
      'premium.step1.label': '① AI Drafting',
      'premium.rion.step1': 'AI drafts content to match lawyer templates',
      'premium.step2.label': '② Expert Review',
      'premium.rion.step2': 'Verified by Linkon in-house lawyers',
      'premium.step3.label': '③ Official Seal',
      'premium.step3.desc': 'Document issued with an official expert seal',
      'premium.example.label': 'Document Examples',
      'premium.rion.examples': '• Criminal Complaint<br>• Proof of Contents<br>• Statement of Inquiry / Reply<br>• Contract Draft',

      'premium.taxon.title': 'Official Tax Documents<br>Drafted by AI, Reviewed by Experts',
      'premium.taxon.desc': 'Taxon AI drafts tax documents based on formats provided by CPAs and tax accountants, and Linkon’s in-house experts review and seal them. Easily obtain accurate tax documents that prevent false reporting.',
      'premium.taxon.step1': 'AI drafts content to match expert templates',
      'premium.taxon.step2': 'Verified by CPAs and Tax Accountants',
      'premium.taxon.examples': '• Comprehensive Income Tax Return<br>• Value-Added Tax Return<br>• Tax Adjustment Application<br>• Expense Processing & Tax Confirmations'
    }
  };

  var currentLang = getInitialLanguage();

  function getInitialLanguage() {
    var storedLang = null;

    try {
      storedLang = localStorage.getItem('linkon-lang');
    } catch (error) {
      storedLang = null;
    }

    if (storedLang && TRANSLATIONS[storedLang]) {
      return storedLang;
    }

    return 'ko';
  }

  function t(key) {
    var currentDict = TRANSLATIONS[currentLang] || {};
    var fallbackDict = TRANSLATIONS.ko || {};
    return currentDict[key] !== undefined ? currentDict[key] : (fallbackDict[key] !== undefined ? fallbackDict[key] : key);
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = t(element.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (element) {
      element.innerHTML = t(element.getAttribute('data-i18n-html'));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
      element.placeholder = t(element.getAttribute('data-i18n-placeholder'));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
      element.setAttribute('aria-label', t(element.getAttribute('data-i18n-aria-label')));
    });

    document.documentElement.lang = currentLang;

    document.querySelectorAll('.lang-btn').forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-lang') === currentLang);
    });

    document.dispatchEvent(new CustomEvent('linkon:langchange', {
      detail: {
        lang: currentLang
      }
    }));
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;

    currentLang = lang;

    try {
      localStorage.setItem('linkon-lang', lang);
    } catch (error) {
      /* ignore storage errors */
    }

    applyTranslations();
  }

  function initLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        setLang(button.getAttribute('data-lang'));
      });
    });
  }

  function init() {
    initLangButtons();
    applyTranslations();
  }

  window.LinkonI18n = {
    t: t,
    setLang: setLang,
    getCurrentLang: function () {
      return currentLang;
    },
    applyTranslations: applyTranslations
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
