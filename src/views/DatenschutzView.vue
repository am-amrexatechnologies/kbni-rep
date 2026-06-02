<template>
  <div class="page-wrapper">
    <div class="legal-card card">
      <h1>Datenschutzerklärung</h1>
      <hr class="divider" />
      <div class="legal-section">
        <h3>1. Allgemeines</h3>
        <p>Personenbezogene Daten (z.B. Benutzername, E-Mail) werden ausschließlich in einer Turso-Datenbank (libSQL) auf EU-Infrastruktur gespeichert. Es werden keine Daten an Dritte weitergegeben.</p>
      </div>
      <div class="legal-section">
        <h3>2. Gespeicherte Daten</h3>
        <ul>
          <li>Benutzername und E-Mail-Adresse (bei Registrierung)</li>
          <li>Passwort (gehasht mit bcrypt, nicht im Klartext)</li>
          <li>Chat-Nachrichten</li>
          <li>Charakterbewertungen und persönliche Top-5-Listen</li>
        </ul>
      </div>
      <div class="legal-section">
        <h3>3. Authentifizierung</h3>
        <p>Die Sitzung wird über ein JWT-Token verwaltet, das lokal im Browser gespeichert wird (localStorage). Das Token läuft nach 7 Tagen ab.</p>
      </div>
      <div class="legal-section">
        <h3>4. Löschung</h3>
        <p>Du kannst deine Daten jederzeit löschen lassen. Wende dich dazu an info@kbni.de.</p>
      </div>
      <div class="legal-section">
        <h3>5. Kontakt</h3>
        <p>Bei Fragen zum Datenschutz: info@kbni.de</p>
      </div>
      <div class="legal-back">
        <RouterLink to="/" class="btn btn-ghost btn-sm">Zurück zur Startseite</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-card { max-width: 700px; }
.legal-card h1 { margin-bottom: 0; }
.legal-section { margin-bottom: 1.5rem; }
.legal-section h3 { margin-bottom: 0.5rem; font-size: 1rem; color: var(--color-primary); }
.legal-section p, .legal-section li { font-size: 0.9rem; line-height: 1.7; color: var(--color-text-muted); }
.legal-section ul { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.3rem; }
.legal-back { margin-top: 2rem; }
</style>
