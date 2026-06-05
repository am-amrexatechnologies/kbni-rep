<template>
  <div>
    <NavBar />
    <main class="page-wrapper">
      <div class="container">
        <div class="legal-card fade-in-up">
          <div class="legal-badge">
            <span>📄</span>
            <span class="badge">Rechtliches</span>
          </div>
          <h1 class="page-title">Impressum</h1>
          <p class="legal-updated">Letzte Aktualisierung: Juni 2026</p>

          <div class="legal-body">
            <section class="legal-section">
              <h2>Angaben gemäß § 5 TMG</h2>
              <p>
                KBNI Platform<br>
                Musterstraße 1<br>
                94447 Plattling<br>
                Deutschland
              </p>
            </section>

            <section class="legal-section">
              <h2>Vertreten durch</h2>
              <p>Alexandru Mardari</p>
            </section>

            <section class="legal-section">
              <h2>Kontakt</h2>
              <p>
                E-Mail: <a href="mailto:info@kbni.app" class="legal-link">info@kbni.app</a>
              </p>
            </section>

            <section class="legal-section">
              <h2>Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</h2>
              <p>
                Alexandru Mardari<br>
                Musterstraße 1<br>
                94447 Plattling
              </p>
            </section>

            <section class="legal-section">
              <h2>Haftungsausschluss</h2>
              <h3>Haftung für Inhalte</h3>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <h3>Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section class="legal-section">
              <h2>Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.legal-card {
  max-width: 760px;
  margin: 0 auto;
  background: var(--white);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow-sm);
}

.legal-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1.2rem;
}

.legal-updated {
  font-size: .85rem;
  color: var(--slate-400);
  margin-bottom: 40px;
  margin-top: -4px;
}

.legal-body { display: flex; flex-direction: column; gap: 0; }

.legal-section {
  padding: 24px 0;
  border-bottom: 1px solid var(--slate-100);
}

.legal-section:last-child { border-bottom: none; }

.legal-section h2 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--slate-900);
  margin-bottom: 10px;
}

.legal-section h3 {
  font-size: .9rem;
  font-weight: 600;
  color: var(--slate-700);
  margin: 14px 0 6px;
}

.legal-section p {
  font-size: .9rem;
  color: var(--slate-600);
  line-height: 1.7;
}

.legal-link {
  color: var(--blue-600);
  font-weight: 500;
}

.legal-link:hover { text-decoration: underline; }

@media (max-width: 600px) {
  .legal-card { padding: 28px 20px; }
}
</style>
