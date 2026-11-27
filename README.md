# THM Tracker

A minimal, no-login progress tracker for the free [TryHackMe](https://tryhackme.com) rooms list. Mark each room as **Not started**, **In progress** or **Completed**, browse by category, and see your overall progress at a glance.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no server.

**Live demo:** https://iamrudhh.github.io/THM-Progress-Tracker/

## Features

- 700+ free rooms across 27 categories (Linux, Web, Blue Team & SOC, PrivEsc, CTFs and more)
- Three statuses per room, with per-category and overall progress bars
- Search, category filter and status filter
- Progress is saved in your browser (localStorage); nothing is sent anywhere
- Export and import a JSON backup to move progress between devices
- Responsive, works on phones

## Quick start

```bash
git clone https://github.com/iamrudhh/THM-Progress-Tracker.git
cd THM-Progress-Tracker
```

Then open `index.html` in your browser. That's it.

Or serve it locally:

```bash
npx serve .
```

## Host it yourself (free)

**GitHub Pages**
1. Fork this repo.
2. Go to Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Your tracker is live at `https://<your-username>.github.io/THM-Progress-Tracker/`.

Netlify Drop, Cloudflare Pages and Vercel also work: it's all static files.

## Your data

Progress lives in your browser's localStorage, per browser and per URL. A copy opened from a local file and one opened from a hosted URL do **not** share progress, and neither do two different devices. To move progress, use **Export backup** on one and **Import backup** on the other. Clearing site data removes your progress, so export a backup now and then.

## Updating the room list

`rooms.js` is generated from the upstream list. To refresh it (Node 18+):

```bash
npm run update-rooms
```

Your saved progress is keyed by room slug, so it survives updates. Rooms removed upstream simply disappear from the list.

## Project structure

```
index.html            page markup
style.css             styles
app.js                tracker logic
rooms.js              room data (generated)
scripts/update-rooms.js   refreshes rooms.js from upstream
```

## Credits

The room list is curated by **Abimel S B Kulumala** in [abimelsbk/free-tryhackme-rooms](https://github.com/abimelsbk/free-tryhackme-rooms). The room names and links in this project come from his list; this project is only a tracker built on top of it; all credit for finding and organising the rooms goes to him. If it helps you, star his repo too.

All rooms belong to and are hosted by TryHackMe. This project is not affiliated with or endorsed by TryHackMe or the list's maintainer.

## Contributing

Issues and pull requests are welcome. Keep it dependency-free and minimal. For wrong or missing rooms, please report them to the [upstream list](https://github.com/abimelsbk/free-tryhackme-rooms) so everyone benefits.

## License

[MIT](LICENSE) applies to the tracker code. The room list is sourced from the upstream repository and its maintainer's terms.
