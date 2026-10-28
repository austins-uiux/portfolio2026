# A+studio language support

Korean is the default. The header switches immediately between Korean and English, preserves the current route and component state, and stores the selection under `aplus:language` in browser storage. Prerendered pages stay Korean; the saved selection is restored after hydration.

`en.json` contains the editorial English copy, keyed by the original Korean text. `translate` handles complete copy, position-based dynamic labels such as `{0}`, and known fragments inside composite labels. `translateText` and `localize` apply translation only to display values. Route IDs, selection values, source code, and visitor-authored messages remain data.

When adding or revising Korean copy, update its corresponding English entry. Translate complete paragraphs when possible. Preserve project facts, numerical results, and the distinction between synthetic simulations and real research. Screenshots and embedded Figma designs retain their source language.

Run `npm run check:i18n` to verify English display text across public routes, dynamic labels, the Korean default, and bilingual search. `npm run check:chat` also checks the language preference passed to the AI assistant without calling the real provider.
