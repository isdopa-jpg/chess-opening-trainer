# Opening Trainer

A Lichess-styled chess opening trainer. **You play White**; the bot plays Black
and follows prepared repertoire lines. Wherever Black has more than one option,
the bot picks one at random and you must find the correct White reply. Any move
off the repertoire shows **"Failure, try again."** Reaching the end of a line
shows **"Line complete."**

Static site — no build step. Works on desktop and iPhone (Safari).

## Add or edit lines

Everything lives in [`lines.js`](lines.js). Each opening is a list of
`variations`; each variation is the full move sequence (SAN) from move 1,
alternating White, Black, White, Black… Variations that share opening moves are
merged automatically, so just type each line out in full.

## Run locally

Any static server works. Included helper (Windows, no dependencies):

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1 8777
# then open http://localhost:8777/
```

## Credits

- Board logic: [chess.js](https://github.com/jhlywa/chess.js) (loaded from CDN)
- Pieces: cburnett set from [Lichess](https://github.com/lichess-org/lila) (GPL)
