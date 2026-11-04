# Tiny Touch

A p5.js project for fine motor practice.

## Project files

| Files | Purpose |
| --- | --- |
| `home.html` / `home.js` | Existing welcome prototype. |
| `entry.html` / `entry.js` | Team home screen; Drag Shapes opens the matching game. |
| `account.html` / `accountentry.js` | Existing account setup. |
| `goals.html` / `goals.js` | Existing goals page. |
| `carobs.html` / `carobs.js` | Existing Car Obstacles exercise. |
| `shapes.html` / `shapes.js` | Shape Matching exercise. |

## Preview

Run this from the project folder:

```sh
python3 -m http.server 8080
```

Open <http://localhost:8080/entry.html> for the team home screen or <http://localhost:8080/shapes.html> for Shape Matching. The HTML files load p5.js from a CDN and require internet access.

## Shape Matching

Choose **30s timer** or **No timer**, then a difficulty. Watch the demonstration and press **Let's play**. Each session has three rounds with shuffled source and target positions. Pieces get slightly smaller and the fit gets tighter each round.

| Difficulty | Shapes per round | Challenge |
| --- | --- | --- |
| Easy | 3 | Large circle, square, and triangle. |
| Medium | 4 | Adds a star and tighter alignment. |
| Hard | 5 | Adds a diamond and smaller pieces. |
| Expert | 6 | Adds a hexagon with the smallest pieces and tightest fit. |

Drag with a mouse or finger and release when the matching outline turns green. Touch controls use larger pickup areas, choose the nearest available shape, and hold it 64 screen pixels above the finger. Small taps do not count as missed drops. The matching tolerance stays the same for mouse and touch.

Correct matches snap into place with a green checkmark and particle burst. Incorrect drops return to their starting position with feedback. Live hints help with alignment, and a sliding countdown bar changes color as time runs out. Untimed practice never expires.

Between rounds, choose **Next round** or **Retry this round**. Retrying replaces that round's result. The final summary combines accuracy across all three rounds; wrong drops and unfinished shapes count as misses. Completed sessions save a personal best on the current device for each difficulty and play mode. Gameplay also works when browser storage is blocked.

**Back** pauses an active round or returns to the previous screen. **Home** opens `entry.html`. **Pause** freezes time and animations. **Exit** ends the exercise and shows an end screen. Leaving an active session asks for confirmation.

The game scales for phones and computers and repositions the board after resizing. All visible game elements are drawn in p5.js; no images or extra libraries are needed. To use the p5.js editor, copy all of `shapes.js` into `sketch.js`. Set `HOME_URL` to your hosted Home screen's full URL, or `""` to use the in-sketch exit screen.

## Team workflow

1. Pull the latest `main` before starting work.
2. Create a feature branch, such as `codex/shape-game`.
3. Keep changes in the files for that feature and coordinate shared file edits.
4. Preview on computer and phone sizes, then check the controls.
5. Commit, push the branch, and open a pull request for review before merging.

GitHub is the shared source of truth. Copy p5.js editor changes back into the matching repository file before committing. Git keeps earlier versions, so avoid duplicate files such as `shapes-final.js`.
