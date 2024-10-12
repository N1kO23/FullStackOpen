# The production version is deployed at <https://fso.nullpointr.me/>

## Deploymentin toteutus

Kolmansien osapuolien hostauspalveluiden sijasta käytän omaa palvelintani stackin ylläpitämiseen, joten itse deployment tapahtuu paikallisesti seuraavan kaavan mukaan:

- Frontin buildaus
- Dist kopiointi backendiin
- Koko backendin kopiointi palvelimelle esimerkiksi sftp:n avulla
- Backendin ajaminen palvelimella

### Muuta tietoa ajoympäristöstä

- Nginx reverse proxy hoitaa reitityksen
- Certbot vastaa sertifikaateista palvelimen ja cloudflaren välillä
- Cloudflare vastaa välimuistista, taaten staattisten resurssien nopeamman tarjoamisen, samoin kuin suojan palvelunestohyökkäyksille
