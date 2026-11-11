# Water Tank Card

![Banner](docs/banner.png)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

Carte Lovelace Home Assistant pour visualiser le niveau d'une citerne ou cuve d'eau.

![Aperçu de la carte](docs/preview.svg)

## Fonctionnalités

- Visualisation circulaire du niveau d'eau (remplissage SVG dynamique)
- Affichage du pourcentage et du volume en litres
- Badge En ligne / Hors ligne
- Section détails capteur repliable (hauteur, mesure brute, volume)
- Horodatage relatif de la dernière mise à jour

## Installation via HACS

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=HOMELAB-IA&repository=ha-water-tank-card&category=plugin)

Ou manuellement :

1. Dans HACS, aller dans **Frontend** → **⋮** → **Dépôts personnalisés**
2. Ajouter `https://github.com/HOMELAB-IA/ha-water-tank-card` (catégorie : **Lovelace**)
3. Chercher **Water Tank Card** et cliquer **Télécharger**
4. Redémarrer Home Assistant si demandé

## Installation manuelle

1. Télécharger `water-tank-card.js` depuis la [dernière release](https://github.com/HOMELAB-IA/ha-water-tank-card/releases/latest)
2. Copier le fichier dans `/config/www/`
3. Dans **Paramètres** → **Tableau de bord** → **Ressources**, ajouter :
   - URL : `/local/water-tank-card.js`
   - Type : **Module JavaScript**

## Configuration

```yaml
type: custom:water-tank-card
title: Citerne d'eau de pluie   # optionnel, défaut : "Citerne d'eau de pluie"
entity_volume: sensor.citerne_volume   # requis : pourcentage 0-100
capacity: 5000                          # optionnel : capacité en litres
entities:
  height: sensor.citerne_hauteur        # optionnel : hauteur d'eau (m)
  raw: sensor.citerne_mesure            # optionnel : mesure brute capteur (m)
```

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `entity_volume` | `string` | ✅ | Entité capteur volume (0-100 %) |
| `title` | `string` | ❌ | Titre de la carte |
| `capacity` | `number` | ❌ | Capacité totale en litres |
| `entities.height` | `string` | ❌ | Capteur hauteur d'eau |
| `entities.raw` | `string` | ❌ | Capteur mesure brute |

## Licence

MIT
