# PLC AI Assistant — VS Code Extension

Rozszerzenie VS Code wspomagające pracę z kodem PLC (Siemens TIA Portal / SCL) przy użyciu Claude AI.

## Funkcje

| Komenda | Opis |
|---|---|
| **PLC AI: Analyze PLC Block** | Analiza bloku PLC — logika, wejścia/wyjścia, potencjalne błędy |
| **PLC AI: Generate Maintenance Documentation** | Dokumentacja serwisowa dla techników utrzymania ruchu |
| **PLC AI: Generate HMI Alarm List** | Lista alarmów gotowa do importu do systemu HMI |
| **PLC AI: Find Missing Diagnostics** | Wykrywa miejsca bez diagnostyki/alarmów |
| **PLC AI: Create FAT/SAT Checklist** | Lista kontrolna do testów fabrycznych i odbiorowych |
| **PLC AI: Explain Selected Code** | Wyjaśnienie zaznaczonego fragmentu kodu |
| **PLC AI: Generate SCL Block** | Generowanie nowego bloku SCL z opisu tekstowego |

## Wymagania

- VS Code 1.85.0 lub nowszy
- Klucz API Anthropic (console.anthropic.com)

## Instalacja i konfiguracja

1. Sklonuj repozytorium i otwórz w VS Code
2. Zainstaluj zależności: `npm install`
3. Zbuduj rozszerzenie: `npm run build`
4. Wciśnij **F5** aby uruchomić w trybie deweloperskim

### Ustawienia

Otwórz `File → Preferences → Settings` i wyszukaj `plcAI`:

| Ustawienie | Opis | Domyślnie |
|---|---|---|
| `plcAI.anthropicApiKey` | Klucz API z console.anthropic.com | *(wymagane)* |
| `plcAI.model` | Model Claude AI | `claude-haiku-4-5-20251001` |
| `plcAI.outputLanguage` | Język wyników | `PL+EN` |

**Modele (od najtańszego):**
- `claude-haiku-4-5-20251001` — szybki i tani, dobry do testów
- `claude-sonnet-4-6` — zalecany do produkcji
- `claude-opus-4-8` — najpotężniejszy

Lub dodaj ręcznie do `settings.json`:
```json
"plcAI.anthropicApiKey": "sk-ant-api03-...",
"plcAI.model": "claude-haiku-4-5-20251001",
"plcAI.outputLanguage": "PL+EN"
```

## Obsługiwane formaty plików

`.scl`, `.xml`, `.db`, `.udt`, `.txt`

## Jak używać

### Analiza pliku
Kliknij prawym przyciskiem myszy na plik w eksploratorze → wybierz komendę `PLC AI: ...`

### Wyjaśnienie kodu
Zaznacz fragment kodu w edytorze → prawy klik → `PLC AI: Explain Selected Code`

### Generowanie bloku SCL
`Ctrl+Shift+P` → `PLC AI: Generate SCL Block` → wpisz opis po angielsku lub polsku

## Struktura projektu

```
plc-ai-assistant/
├── src/
│   ├── extension.ts      # Główny plik rozszerzenia, rejestracja komend
│   ├── aiClient.ts       # Klient Anthropic API
│   ├── prompts.ts        # Prompty dla każdej funkcji
│   ├── fileReader.ts     # Odczyt plików i zaznaczonego tekstu
│   └── resultPanel.ts    # Panel wyników (WebView)
├── out/
│   └── extension.js      # Skompilowany bundle (esbuild)
├── package.json          # Manifest rozszerzenia
├── esbuild.js            # Konfiguracja buildu
└── tsconfig.json         # Konfiguracja TypeScript
```

## Rozwój

```bash
npm install       # zainstaluj zależności
npm run build     # jednorazowy build
npm run watch     # build z auto-odświeżaniem
```

## Licencja

MIT
