# Moon Phase

A web-based moon phase calculator that displays the current lunar phase, illumination percentage, and important Hindu lunar calendar dates (Tithi). Built as a Progressive Web App (PWA) for offline use.

## Features

- Real-time moon phase visualization with SVG rendering
- Date picker to view moon phase for any date
- Hindu lunar calendar integration (Tithi, Paksha)
- Special day tracking: Ekadashi (11th), Chaturthi (19th), Chaturdashi (14th)
- Next New Moon (Amavasya) and Full Moon (Purnima) dates
- Dark/Light theme support
- PWA support for offline use

## How the Calculations Work

### Julian Date Calculation

The foundation of all moon phase calculations is the **Julian Date (JD)** - a continuous count of days since the beginning of the Julian Period (January 1, 4713 BC). This system eliminates the complexity of varying month lengths, leap years, and calendar reforms.

The Julian Date is calculated using the following formula:

```
JD = 367 × year
   - floor(7 × (year + floor((month + 9) / 12)) / 4)
   + floor(275 × month / 9)
   + day
   + 1721013.5
```

Where:

- `year`, `month`, `day` are the Gregorian (civil) year, month, and day you want to convert.
- All multiplications use regular multiplication (×).
- `floor(...)` means round down to the nearest integer.

For example, January 6, 2000 has a Julian Date of approximately 2,451,549.5.

### The Synodic Month

The **synodic month** is the time it takes for the Moon to complete one full cycle of phases (from New Moon to New Moon). This period is approximately **29.53058867 days**.

This is different from the sidereal month (27.32 days), which is the time for the Moon to orbit Earth relative to the stars. The synodic month is longer because Earth is also moving around the Sun, so the Moon needs extra time to "catch up" to the same Sun-Earth-Moon alignment.

### Moon Age Calculation

The **moon age** represents how many days have passed since the last New Moon. It's calculated by:

1. Computing the Julian Date for the target date
2. Subtracting a known New Moon reference date (January 6, 2000 = JD 2,451,549.5)
3. Taking the modulo of the synodic month length

```javascript
const daysSinceNew = julianDate - 2451549.5; // Days since Jan 6, 2000 New Moon
const moonAge = daysSinceNew % 29.53058867; // Current position in lunar cycle
```

The moon age ranges from 0 to ~29.53 days:

- **0 days** = New Moon
- **~7.4 days** = First Quarter
- **~14.77 days** = Full Moon
- **~22.1 days** = Last Quarter

### Phase Fraction

The **phase fraction** normalizes the moon age to a value between 0 and 1:

```javascript
const phase = moonAge / synodicMonth;
```

- **0.0 (or 1.0)** = New Moon
- **0.25** = First Quarter (right half illuminated)
- **0.5** = Full Moon
- **0.75** = Last Quarter (left half illuminated)

### Illumination Percentage

The **illumination percentage** indicates how much of the Moon's visible surface is lit by the Sun. It's calculated using a cosine function:

```javascript
const illumination = (1 - Math.cos(phase � 2 � �)) / 2;
```

This produces a smooth curve:

- New Moon (phase = 0): `(1 - cos(0)) / 2 = 0%`
- First Quarter (phase = 0.25): `(1 - cos(�/2)) / 2 = 50%`
- Full Moon (phase = 0.5): `(1 - cos(�)) / 2 = 100%`
- Last Quarter (phase = 0.75): `(1 - cos(3�/2)) / 2 = 50%`

### Next New Moon and Full Moon

To find the next occurrence of a specific phase:

```javascript
function getNextPhase(currentPhase, targetPhase, fromDate) {
  let daysUntil;

  if (targetPhase > currentPhase) {
    daysUntil = (targetPhase - currentPhase) � synodicMonth;
  } else {
    daysUntil = (1 - currentPhase + targetPhase) � synodicMonth;
  }

  return fromDate + daysUntil;
}
```

For Next New Moon, `targetPhase = 0`. For Next Full Moon, `targetPhase = 0.5`.

## Hindu Lunar Calendar (Tithi)

The Hindu calendar divides the lunar month into 30 **Tithis** (lunar days), with two fortnights:

### Paksha (Fortnight)

- **Shukla Paksha** (Bright/Waxing fortnight): Days 1-15, from New Moon to Full Moon
- **Krishna Paksha** (Dark/Waning fortnight): Days 16-30, from Full Moon to New Moon

### Lunar Day (Tithi) Names

| Day | Sanskrit Name    | Telugu Name       |
| --- | ---------------- | ----------------- |
| 1   | Prathama         | Padyami           |
| 2   | Dwitiya          | Vidiya            |
| 3   | Tritiya          | Tadiya            |
| 4   | Chaturthi        | Chavithi          |
| 5   | Panchami         | Panchami          |
| 6   | Shashthi         | Shashthi          |
| 7   | Saptami          | Sapthami          |
| 8   | Ashtami          | Ashtami           |
| 9   | Navami           | Navami            |
| 10  | Dashami          | Dasami            |
| 11  | Ekadashi         | Ekadasi           |
| 12  | Dwadashi         | Dvadasi           |
| 13  | Trayodashi       | Tryodasi          |
| 14  | Chaturdashi      | Chaturdasi        |
| 15  | Purnima/Amavasya | Pournami/Amavasya |

### Special Fasting Days

The app tracks these important days:

- **Ekadashi (11th day)**: Occurs twice per month - once in Shukla Paksha (day 11) and once in Krishna Paksha (day 26)
- **Chaturthi (4th day)**: Krishna Paksha Chaturthi (day 19) is significant for Ganesha worship
- **Chaturdashi (14th day)**: Krishna Paksha Chaturdashi (day 29) is significant for Shiva worship

## Moon Phase Visualization

The SVG visualization uses arc paths to render the shadow on the moon:

### Waxing Phases (0 to 0.5)

Light appears on the **right side**, shadow on the left:

- **Waxing Crescent**: Concave shadow arc on the left
- **Waxing Gibbous**: Convex shadow arc on the left

### Waning Phases (0.5 to 1.0)

Light appears on the **left side**, shadow on the right:

- **Waning Gibbous**: Convex shadow arc on the right
- **Waning Crescent**: Concave shadow arc on the right

## Accuracy Notes

This calculator uses simplified astronomical algorithms suitable for general use. The calculations are accurate to within a few hours for most purposes. For precise astronomical data, professional ephemeris data or astronomy libraries should be used.

Factors not accounted for in this simplified model:

- Orbital eccentricity variations
- Perturbations from other celestial bodies
- Exact timing of lunar phases (which can vary by several hours)

## Technology

- HTML5, CSS3 (Tailwind CSS)
- Vanilla JavaScript
- SVG for moon visualization
- Service Worker for PWA/offline support

## License

MIT License
