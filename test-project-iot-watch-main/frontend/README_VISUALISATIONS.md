# Visualisations de Température - IoT Watch

Ce document décrit les nouvelles fonctionnalités de visualisation de température ajoutées à l'application IoT Watch.

## Composants créés

### 1. TemperaturePieChart.jsx
Un composant de graphique circulaire (pie chart) qui affiche la température actuelle avec :
- **Couleurs dynamiques** basées sur la température
- **Émojis** pour une représentation visuelle intuitive
- **Pourcentage** de la température par rapport à l'échelle maximale
- **Mise à jour en temps réel** avec timestamp

**Fonctionnalités :**
- Couleurs adaptatives : Bleu (froid) → Vert (frais) → Orange (chaud) → Rouge (très chaud) → Violet (extrême)
- Émojis correspondants : ❄️ 🌿 ☀️ 🔥 🌋
- Tooltips informatifs avec détails
- Support du mode sombre/clair
- Design responsive

### 2. TemperatureGauge.jsx
Un composant de jauge analogique qui affiche la température avec :
- **Jauge SVG** avec aiguille animée
- **Arc de progression** coloré
- **Échelle de température** (0°C - 50°C)
- **Indicateurs visuels** du statut

**Fonctionnalités :**
- Jauge semi-circulaire avec aiguille
- Arc de progression qui se remplit selon la température
- Même système de couleurs que le pie chart
- Affichage central de la température
- Échelle graduée en bas

## Intégration dans la page Temperature

La page `Temperature.jsx` a été mise à jour pour inclure :

1. **Section de visualisations** avec titre et description
2. **Grille responsive** affichant les deux composants côte à côte
3. **Section d'informations** avec statistiques supplémentaires
4. **Mise à jour automatique** toutes les 10 secondes

## Utilisation

### Accès aux visualisations
1. Naviguez vers la page "Temperature" dans l'application
2. Faites défiler jusqu'à la section "Visualisations Température"
3. Vous verrez le pie chart et la jauge côte à côte

### Fonctionnalités interactives
- **Hover** sur les graphiques pour voir les tooltips
- **Mise à jour automatique** des données
- **Adaptation automatique** au mode sombre/clair
- **Design responsive** pour mobile et desktop

## Échelles de température

### Couleurs et émojis
| Température | Couleur | Émoji | Label |
|-------------|---------|-------|-------|
| < 15°C | Bleu (#3B82F6) | ❄️ | Froid |
| 15-20°C | Vert (#10B981) | 🌿 | Frais |
| 20-25°C | Orange (#F59E0B) | ☀️ | Chaud |
| 25-30°C | Rouge (#EF4444) | 🔥 | Très chaud |
| > 30°C | Violet (#7C3AED) | 🌋 | Extrême |

### Calculs
- **Pourcentage** : `(température / 50) * 100`
- **Angle de jauge** : `-135° + (pourcentage * 270°)`
- **Mise à jour** : Toutes les 10 secondes

## Technologies utilisées

- **React** : Framework principal
- **Chart.js** : Bibliothèque de graphiques
- **react-chartjs-2** : Wrapper React pour Chart.js
- **SVG** : Pour la jauge personnalisée
- **Tailwind CSS** : Styling et responsive design
- **PropTypes** : Validation des props

## Structure des fichiers

```
frontend/src/
├── components/
│   ├── TemperaturePieChart.jsx    # Nouveau composant pie chart
│   ├── TemperatureGauge.jsx       # Nouveau composant jauge
│   └── ...
├── pages/
│   ├── Temperature.jsx            # Page mise à jour
│   └── ...
└── ...
```

## Personnalisation

### Modifier les seuils de température
Dans les composants, vous pouvez ajuster les seuils dans les fonctions :
- `getTemperatureColor()`
- `getTemperatureLabel()`
- `getTemperatureEmoji()`

### Changer les couleurs
Modifiez les valeurs hexadécimales dans les fonctions de couleur pour personnaliser l'apparence.

### Ajuster l'échelle
Changez la valeur `maxTemp` (actuellement 50°C) pour adapter l'échelle à vos besoins.

## Compatibilité

- ✅ **Navigateurs modernes** : Chrome, Firefox, Safari, Edge
- ✅ **Mobile responsive** : Tablettes et smartphones
- ✅ **Mode sombre/clair** : Adaptation automatique
- ✅ **Accessibilité** : Tooltips et contrastes appropriés

## Maintenance

### Ajout de nouvelles visualisations
1. Créez un nouveau composant dans `src/components/`
2. Importez-le dans `Temperature.jsx`
3. Ajoutez-le à la grille de visualisations

### Mise à jour des données
Les composants utilisent l'API existante `fetchLatestTemperature()` et se mettent à jour automatiquement. 