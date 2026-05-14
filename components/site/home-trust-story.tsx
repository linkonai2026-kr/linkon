/**
 * 홈 trust(이용 방법) 섹션 — 정적 2컬럼 그리드.
 *
 * 2026-05-14 단순화: PinnedStory + 3 NeuralOrb 제거. 원래의 `.lp-trust-grid` +
 * `.lp-trust-copy` + `.lp-flow-cards` 마크업으로 복원 (globals.css 기존 스타일 재사용).
 */
export default function HomeTrustStory() {
  return (
    <section className="section section--alt lp-trust-section" id="trust">
      <div className="container lp-trust-grid">
        <div className="lp-trust-copy">
          <p className="section-label">이용 방법</p>
          <h2 className="section-title">가입은 한 번, 이용은 필요한 만큼</h2>
          <p className="about-body">
            Linkon에서 계정을 만들면 Vion을 바로 시작할 수 있고, Rion과 Taxon은 출시 알림을 받아볼 수 있습니다.
            이후 새 서비스가 열리면 같은 계정으로 자연스럽게 이어집니다.
          </p>
        </div>

        <div className="lp-flow-cards">
          <article>
            <span>01</span>
            <strong>Linkon 계정 만들기</strong>
            <p>이메일과 비밀번호만으로 통합 계정을 생성합니다.</p>
          </article>
          <article>
            <span>02</span>
            <strong>서비스 선택하기</strong>
            <p>Vion을 바로 이용하거나 Rion, Taxon 출시 알림을 신청합니다.</p>
          </article>
          <article>
            <span>03</span>
            <strong>필요할 때 다시 연결</strong>
            <p>같은 계정으로 서비스 간 이동과 재접근을 더 쉽게 이어갑니다.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
