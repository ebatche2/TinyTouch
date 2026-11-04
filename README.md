# Tiny Touch

A p5.js project for playful fine motor practice.

## Current files

| File | Purpose |
| --- | --- |
| `home.html` | Opens the welcome page in a browser and loads p5.js. |
| `home.js` | Welcome page, forest artwork, animals, and buttons. |
| `index.html` | Opens the existing car exercise prototype. |
| `sketch.js` | Existing car exercise prototype. |

The welcome page works on desktop and phone-sized screens. **Create Account** and **Log In** currently open placeholder screens; account creation and login are not implemented.

## Preview the welcome page

Run this command from the project folder:

```sh
python3 -m http.server 8080
```

Open <http://localhost:8080/home.html>.

Alternatively, copy all of `home.js` into `sketch.js` in the p5.js web editor. No images or extra libraries are needed. The local HTML files load p5.js 2 from a CDN, so they require an internet connection.

## Team workflow

1. Pull the latest `main` before starting a new feature.
2. Create a descriptive branch for one task, such as `welcome-page` or `trace-the-path`.
3. Work in the file for that feature. Coordinate before editing another person's file.
4. Preview the result, including a phone-sized screen, and test the buttons.
5. Commit with a clear message, then push the branch to GitHub.
6. Open a pull request into `main`. Have a teammate review it before merging.

Use `main` for the working version. Keep each pull request focused on one page, exercise, or fix. Add future exercises in their own clearly named files rather than putting every exercise into `home.js`.

Treat the repository as the shared source of truth. If you change a sketch in the p5.js editor, copy the complete updated code back into the matching repository file before committing. Avoid parallel versions such as `home-final.js` and `home-final2.js`; Git keeps the history.

Track remaining work as GitHub issues, and assign one person to each task. Never commit passwords, API keys, or user information.
