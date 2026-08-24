# My IPTV — M3U + TV Interface

A GitHub Pages IPTV player with M3U playlist loading, categories, search, logos, favorites and fullscreen playback.

## Load playlists

You can load an M3U playlist in three ways:
1. URL — requires the playlist server to permit browser CORS requests.
2. Paste — paste M3U text directly.
3. File — select an `.m3u`/`.m3u8` file from your computer.

## Deploy

Upload `index.html`, `style.css`, `app.js`, and `README.md` to the root of your GitHub repository. Publish with GitHub Pages from `main` and `/ (root)`.

## Important

GitHub Pages hosts the player only. It does not host or proxy video streams. Stream and playlist URLs must be ones you are authorized to access, display, or redistribute. Browser playback also depends on the stream server permitting cross-origin access.

Example format:

#EXTM3U
#EXTINF:-1 tvg-logo="https://example.com/logo.png" group-title="News",Example News
https://example.com/live/news.m3u8
