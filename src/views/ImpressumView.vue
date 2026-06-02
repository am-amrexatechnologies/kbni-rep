<template>
  <div class="page-wrapper">
    <div class="legal-card card">
      <h1>Impressum</h1>
      <hr class="divider" />
      <div class="legal-section">
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>Max Mustermann<br>Musterstraße 1<br>12345 Musterstadt</p>
      </div>
      <div class="legal-section">
        <h3>Kontakt</h3>
        <p>Telefon: +49 (0) 123 456 78 90<br>E-Mail: info@kbni.de</p>
      </div>
      <div class="legal-section">
        <h3>Haftungsausschluss</h3>
        <p>Diese App ist ein privates Freizeitprojekt. Alle Inhalte dienen ausschließlich informativen Zwecken. Fiktive Charakterbewertungen stellen keine kommerziellen Interessen dar.</p>
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
.legal-section p  { font-size: 0.9rem; line-height: 1.7; }
.legal-back { margin-top: 2rem; }
</style>
