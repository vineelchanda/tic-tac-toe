# React + Firestore Realtime Tic-Tac-Toe

A two-player Tic-Tac-Toe game using **React** (Vite) and **Firestore** for realtime synchronization.

## Features
- Realtime board + turn synchronization via Firestore snapshots
- Player seat claiming (X or O)
- Transaction-based move writes to avoid race conditions
- Win / draw detection
- Reset while keeping seats
- Shareable game URL (?game=<id>)
- Dockerized production build (Nginx static hosting)

## Data Model
Collection: `games`  
Document: `<gameId>`

```json
{
  "players": { "X": "abc123", "O": "def456" },
  "board": ["X","","","O","","","","",""],
  "turn": "X",
  "winner": "",
  "status": "in_progress",
  "createdAt": <serverTimestamp>,
  "lastMoveAt": <serverTimestamp>
}
```

Statuses: `waiting`, `in_progress`, `finished`, `abandoned`.

## Setup

```bash
npm install
cp .env.example .env
# Fill in Firebase config
npm run dev
```

Open: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t react-firestore-ttt .
docker run -p 8080:80 react-firestore-ttt
```

Visit: http://localhost:8080

## Firestore Rules

Deploy:

```bash
firebase deploy --only firestore:rules
```

(Ensure you have a `firebase.json` referencing `firestore.rules`.)

## Extending
- Authentication (Anonymous / Google)
- Spectators & chat subcollection
- Move history / undo
- Presence via Realtime Database hybrid
- Cloud Function cleanup for stale games

## Security Notes
See `SECURITY_NOTES.txt` for hardening guidance (turn validation, auth checks).

## Troubleshooting
| Issue | Hint |
|-------|------|
| Blank screen | Check `.env` values; restart dev |
| Moves not syncing | Verify rules; browser console errors |
| Docker 404 | Ensure build generated `dist/` and copied correctly |
| Wrong Firebase project | Double-check project ID variables |

## License
MIT (add/confirm a LICENSE file if needed).