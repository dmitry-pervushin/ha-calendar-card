# Home Assistant Outlook calendar card

[English](README.en.md) · **Français** · [Русский](README.ru.md)

Une carte de calendrier Home Assistant avec des vues jour, semaine, deux semaines et mois.

## Installation

Copiez `outlook-calendar-card.js` dans le répertoire `/config/www/` de Home Assistant, puis ajoutez une ressource de tableau de bord de type **Module JavaScript** :

```text
/local/outlook-calendar-card.js
```

Si `calendars` est omis, la carte utilise automatiquement toutes les entités `calendar.*` de Home Assistant. Les nouveaux calendriers sont détectés lors des mises à jour d’état de Home Assistant. Configuration minimale :

```yaml
type: custom:outlook-calendar-card
```

Une liste `calendars` explicite limite la carte aux calendriers indiqués ; `calendars: []` la laisse sans calendrier.

Exemple de configuration :

```yaml
type: custom:outlook-calendar-card
calendars:
  - entity: calendar.work
  - entity: calendar.family
start_hour: 8
end_hour: 20
view: week
```

La couleur des événements provient de l’attribut `color` du calendrier. À défaut, la carte utilise `initial_color`, la couleur du calendrier dans le registre des entités (`options.calendar.color`) ou la palette de Home Assistant. Si la couleur choisie dans l’interface Home Assistant n’est pas disponible dans `hass`, elle est récupérée par l’API WebSocket. Les noms de couleurs de thème, comme `deep-orange`, sont convertis en variables CSS du thème. Un `color` explicite dans la configuration de la carte est prioritaire. L’icône `icon` du calendrier précède le titre, suivie d’une espace ; sans icône définie, `mdi:calendar` est utilisé.

Lorsqu’un même événement figure dans plusieurs calendriers, ses préfixes sont accolés sans espace entre eux, avec une seule espace avant le titre. Cette règle s’applique aussi aux icônes des calendriers. Un préfixe textuel unique conserve les espaces de sa configuration.

Sur un fond blanc, le texte et les icônes sont foncés, y compris lorsque le blanc provient d’une variable de thème.

Les paramètres explicites sont prioritaires :

```yaml
calendars:
  - entity: calendar.work
    color: "#4285f4"
    prefix: "Travail : "
  - entity: calendar.family
    prefix: "" # Désactiver l’icône automatique du calendrier
```

## Vue sur deux semaines

Le bouton **2 semaines** affiche deux lignes de sept jours : la semaine de la date sélectionnée et la suivante. À l’ouverture, il s’agit de la semaine en cours et de la suivante, du lundi au dimanche. **Aujourd’hui** revient à la semaine en cours ; les flèches déplacent la période de deux semaines.

Pour ouvrir cette vue par défaut :

```yaml
type: custom:outlook-calendar-card
view: two-weeks
```

## Localisation

La carte suit automatiquement la langue actuelle de Home Assistant (`hass.locale.language`, avec prise en charge de `hass.language` pour compatibilité) :

- `ru` — russe ;
- `fr` — français ;
- `en` — anglais.

Les variantes régionales, comme `fr-FR`, `fr-CA`, `ru-RU` et `en-GB`, sont prises en charge. Les autres langues utilisent l’anglais. La langue du navigateur ne détermine pas celle de l’interface de la carte.

Les traductions couvrent la navigation, les états vides, les dialogues de création et de modification, les modèles, les libellés des icônes, l’aperçu, les erreurs propres à la carte et les aides. Les noms des calendriers, le contenu des événements et les modèles personnels conservent les textes saisis par l’utilisateur. Les messages renvoyés par les intégrations sont affichés tels quels.

Les dates, noms des mois et heures sont formatés avec `Intl` selon la langue de Home Assistant. Le réglage HA du format horaire 12/24 heures (`hass.locale.time_format`) est également respecté ; avec `system`, le format du système est utilisé. La saisie des dates et la planification restent dans le fuseau horaire du navigateur.

Changer la langue de Home Assistant met à jour la carte et le dialogue ouvert sans perdre les valeurs saisies ni le plan préparé. Toutes les traductions sont incluses dans `CARD_TRANSLATIONS`, dans l’unique fichier JavaScript ; aucune ressource supplémentaire n’est nécessaire.

## Ajouter des événements

Sur un grand écran, le dialogue comporte deux colonnes : les données de l’événement à gauche, les calendriers et les répétitions à droite. Jusqu’à 640 px, une seule colonne est utilisée. Les longues listes de calendriers défilent séparément et les boutons d’action restent visibles en bas. Le pied du dialogue indique la version chargée : `2026.11.11.3`.

Le bouton **+** ouvre un dialogue permettant de choisir plusieurs calendriers, un titre, un début et une fin, l’option toute la journée, un lieu et une description. Seuls les calendriers configurés qui permettent la création d’événements sont proposés comme destinations. Le bouton est désactivé si aucun n’est disponible. Les champs de répétition inactifs sont exclus de la validation. Un champ actif manquant ou incorrect produit un message traduit et reçoit le focus.

### Icônes des événements

Choisissez une icône avec un bouton du dialogue ou saisissez son nom MDI, par exemple `mdi:tennis-ball`. Si Home Assistant a déjà chargé `ha-icon-picker`, son sélecteur avec recherche est utilisé ; sinon, un champ texte et des choix rapides sont disponibles.

Liste principale :

| Événement | Unicode dans le titre | MDI |
| --- | --- | --- |
| Théâtre | 🎭 | `mdi:drama-masks` |
| Musique | 🎵 | `mdi:music` |
| Tennis | 🎾 | `mdi:tennis-ball` |
| Voile | ⛵ | `mdi:sail-boat` |
| Football | ⚽ | `mdi:soccer` |
| Course à pied | 🏃 | `mdi:run` |
| Chat | 🐱 | `mdi:cat` |
| Chien | 🐶 | `mdi:dog` |
| Réunion à l’école | 🏫 | `mdi:school` |

Le titre peut se limiter à une icône, par exemple `🎾`, sans texte supplémentaire.

La conversion fonctionne dans les deux sens : choisir `mdi:tennis-ball` ajoute immédiatement `🎾` au début du titre ; saisir `🎾 Tennis` sélectionne l’icône MDI correspondante. Le calendrier enregistre le titre ordinaire `🎾 Tennis` et la description reste inchangée. Au chargement, la carte affiche ce symbole comme une icône MDI près du titre, en conservant les préfixes des calendriers séparément. L’icône est mémorisée dans les modèles et appliquée à tous les événements d’une série.

Les icônes MDI sans équivalent Unicode utilisent un préfixe textuel : `[mdi:atom] Activité`. La carte reconnaît ces préfixes et affiche l’icône. **Sans icône** permet de la retirer. Seul un symbole ou marqueur au début du titre est converti ; les autres restent du texte ordinaire. Les emojis inconnus et les variantes composées non prises en charge sont conservés comme texte.

### Répétitions et conditions

Créez des événements quotidiens ou hebdomadaires avec l’intervalle choisi. Pour les répétitions hebdomadaires, sélectionnez les jours, par exemple chaque samedi. La date de fin des répétitions est incluse. Une série est limitée à deux ans et à 366 dates.

Dans **Sauf pendant les vacances ou les jours fériés**, sélectionnez un ou plusieurs calendriers d’exclusion. Tout événement dans l’un de ces calendriers exclut la journée entière, quelle que soit son heure. Pour un événement qui passe minuit, toutes les journées concernées sont vérifiées. Tous les calendriers existants sont proposés ici, y compris ceux en lecture seule ou absents de la liste affichée par la carte.

**Jusqu’à la fin de l’année scolaire** remplace la date de fin manuelle. Choisissez un calendrier de vacances scolaires : la carte recherche son premier événement commençant en juin, juillet ou août de l’année scolaire concernée. Le titre de cet événement n’est pas pris en compte. La série s’arrête avant ce jour. Pour un début à partir de septembre, la recherche porte sur l’été suivant ; de janvier à août, sur l’été de la même année. La création ne commence pas si les vacances d’été sont introuvables ou si un calendrier d’exclusion est indisponible.

**Aperçu** affiche les dates, le nombre total d’entrées dans les calendriers choisis, les dates ignorées et leurs raisons, ainsi que le début des vacances d’été détecté. Avec plusieurs calendriers, des répétitions ou des exclusions, le premier clic sur **Créer** prépare aussi un aperçu ; le second écrit les événements. Modifier un champ invalide l’aperçu.

Les répétitions sont créées comme des **événements distincts**, via [`calendar.create_event`](https://www.home-assistant.io/actions/calendar.create_event/). Les conditions sont vérifiées lors de la préparation de la série. Les modifications ultérieures des vacances ou des calendriers d’exclusion ne recalculent pas les événements préparés ou créés. Pour actualiser les conditions avant l’écriture, cliquez de nouveau sur **Aperçu**. La série n’est pas une unique entrée récurrente modifiable en groupe.

Si l’écriture échoue en cours de route, le formulaire indique le nombre d’événements créés. **Réessayer les événements restants** ignore les écritures confirmées. Les paramètres d’une série partiellement créée restent verrouillés jusqu’à la fin ou la fermeture du dialogue. L’état de reprise n’existe que dans le dialogue ouvert. Si une requête expire, le résultat de cette écriture peut être inconnu : vérifiez le calendrier avant de la relancer.

### Modèles

Le modèle intégré **Activité scolaire** active une répétition hebdomadaire le jour de début de l’activité, la limite de fin d’année scolaire et présélectionne les calendriers de vacances et jours fériés selon leurs noms. Vérifiez ces choix et ajustez-les avant l’aperçu.

Dans **Enregistrer ces paramètres comme modèle**, saisissez un nom pour créer votre propre modèle. Il mémorise les calendriers, conditions, répétitions, titre, icône de l’événement, lieu, description, heure et durée. Son application conserve la date de début sélectionnée et reprend l’heure et la durée du modèle. Pour une fin de répétition manuelle, la durée de la période est conservée plutôt que l’ancienne date absolue.

Les modèles sont stockés localement dans ce navigateur, séparément pour chaque utilisateur Home Assistant. Enregistrez sous le même nom pour mettre à jour un modèle, ou supprimez le modèle sélectionné. Ils ne sont pas synchronisés entre navigateurs ou appareils.

### Dates et heures

La date de fin d’un événement sur toute la journée est exclusive : un événement couvrant seulement le 11 novembre se termine le 12 novembre. Le passage en mode toute la journée choisit automatiquement le lendemain comme fin si le début et la fin étaient le même jour.

Changer le début décale automatiquement la fin en conservant la dernière durée valide. Vous pouvez ajuster la fin manuellement. Si elle précède le début, une erreur apparaît directement sous le champ de fin.

Le formulaire utilise le fuseau horaire du navigateur. Les répétitions conservent l’heure locale de l’activité lors des changements d’heure d’été ou d’hiver. Après l’enregistrement, la carte recharge les événements ; leur délai d’apparition dépend de l’intégration du calendrier. La langue de l’interface, des dates et des heures suit Home Assistant : russe, français et anglais sont pris en charge.

## Modifier des événements

Cliquez sur un événement dans les vues jour, semaine, deux semaines ou mois ; au clavier, utilisez Tab puis Entrée/Espace. Le dialogue contient le titre, l’icône, le début et la fin, l’option toute la journée, le lieu et la description. **Enregistrer les modifications** met à jour l’entrée existante par son `uid` via l’API WebSocket `calendar/event/update`.

Si un événement regroupe des entrées de plusieurs calendriers, choisissez celle à modifier dans **Événement du calendrier**. Ses propres valeurs remplissent le formulaire. Seule cette entrée est modifiée ; les copies dans les autres calendriers restent inchangées.

La modification nécessite une intégration prenant en charge `UPDATE_EVENT` (bit `4` de `supported_features`) et un événement possédant un `uid`. La possibilité de créer des événements n’implique pas celle de les modifier. Les entrées non modifiables restent consultables et le dialogue explique pourquoi l’enregistrement est désactivé.

Pour une série récurrente native, seule l’occurrence sélectionnée, identifiée par son `recurrence_id`, est modifiée ; les occurrences futures et la règle de répétition restent inchangées. L’enregistrement est désactivé si le calendrier renvoie une règle de répétition sans identifier l’occurrence. Les séries créées par cette carte comme événements distincts se modifient date par date.

En cas d’erreur de l’API, vos modifications restent dans le dialogue ouvert. Les mises à jour de la carte en arrière-plan préservent aussi le formulaire. Les événements sont rechargés après une modification réussie.

## Vérifications

Le développement nécessite Node.js 18 ou une version ultérieure :

```sh
npm ci
npm run check
npm test
```

Les tests couvrent les couleurs et préfixes, icônes, regroupements de doublons, possibilités d’écriture, répétitions, calendriers multiples, exclusions de journées entières, vacances d’été, changements d’heure, aperçus, reprises après échec partiel et stockage des modèles. Pour tester les changements d’heure : `TZ=Europe/Paris npm test`.

La compatibilité avec `scoped-custom-element-registry` est vérifiée séparément : sa collection `form.elements` permet un accès par index mais ne prend pas en charge l’itération. La carte accède aux contrôles sans appeler cet itérateur.
