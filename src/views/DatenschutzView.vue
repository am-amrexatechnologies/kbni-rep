<template>
  <div>
    <NavBar />
    <main class="page-wrapper">
      <div class="container">
        <div class="legal-card fade-in-up">
          <div class="legal-badge">
            <span>🔒</span>
            <span class="badge">Rechtliches</span>
          </div>
          <h1 class="page-title">Datenschutzerklärung</h1>
          <p class="legal-updated">Letzte Aktualisierung: Juni 2026</p>

          <div class="legal-body">
            <section class="legal-section">
              <h2>1. Datenschutz auf einen Blick</h2>
              <h3>Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.
              </p>
              <h3>Datenerfassung auf dieser Website</h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten kannst du dem Impressum dieser Website entnehmen. Deine Daten werden zum einen dadurch erhoben, dass du uns diese mitteilst (z. B. durch Eingabe in ein Kontaktformular).
              </p>
            </section>

            <section class="legal-section">
              <h2>2. Hosting</h2>
              <p>
                Wir hosten die Inhalte unserer Website bei Vercel Inc., 340 Pine Street Suite 701, San Francisco, California 94104. Vercel ist ein Dienstleister, der im Bereich Hosting und Content-Delivery tätig ist. Details entnimmst du der Datenschutzerklärung von Vercel: <a href="https://vercel.com/legal/privacy-policy" target="_blank" class="legal-link">vercel.com/legal/privacy-policy</a>.
              </p>
            </section>

            <section class="legal-section">
              <h2>3. Pflichtinformationen und Rechte</h2>
              <h3>Verantwortliche Stelle</h3>
              <p>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br><br>
                Alexandru Mardari<br>
                Michaelsbucherstraße 14, 94447 Plattling<br>
                E-Mail: alexdemardari@gmail.com
              </p>
              <h3>Speicherdauer</h3>
              <p>
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wird, verbleiben deine personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn du ein berechtigtes Löschersuchen geltend machst oder eine Einwilligung zur Datenverarbeitung widerrufst, werden deine Daten gelöscht, sofern wir keinen anderen rechtlich zulässigen Grund für die Speicherung haben.
              </p>
            </section>

            <section class="legal-section">
              <h2>4. Datenerfassung auf dieser Website</h2>
              <h3>Lokaler Speicher (localStorage)</h3>
              <p>
                Diese Website speichert bestimmte Daten (z. B. Chat-Nachrichten, Anime-Bewertungen) lokal in deinem Browser via localStorage. Diese Daten verlassen deinen Browser nicht und werden nicht an unsere Server übertragen. Du kannst sie jederzeit über die Einstellungen deines Browsers löschen.
              </p>
              <h3>Registrierung auf dieser Website</h3>
              <p>
                Wenn du dich auf dieser Website registrierst, erheben wir die Daten, die du im Eingabeformular eingibst (Benutzername, E-Mail-Adresse, Passwort). Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </p>
            </section>

            <section class="legal-section">
              <h2>5. Deine Rechte</h2>
              <p>
                Du hast jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten personenbezogenen Daten. Du hast außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn du eine Einwilligung zur Datenverarbeitung erteilt hast, kannst du diese Einwilligung jederzeit für die Zukunft widerrufen. Des Weiteren hast du das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung deiner personenbezogenen Daten zu verlangen.
              </p>
              <p style="margin-top:10px">
                Zur Ausübung deiner Rechte wende dich per E-Mail an: <a href="mailto:info@kbni.app" class="legal-link">info@kbni.app</a>
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
