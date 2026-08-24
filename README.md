# My IPTV Player

A small, static IPTV/HLS web-player starter designed for GitHub Pages.

## What it does

- Responsive dark IPTV interface
- Searchable channel list
- Add HLS `.m3u8` streams from the browser
- Stores the channel list in `localStorage`
- Plays HLS through hls.js where supported
- Uses native HLS playback where the browser provides it
- No server or database required

## Important

This project is a player, not a stream-hosting service. Add only streams you own or are authorized to access and display.

GitHub Pages hosts the HTML/CSS/JavaScript application; it does not proxy the video streams.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and this README.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save and wait for GitHub Pages to publish the site.

Your site will normally be available at:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Add a channel

Open the site and click **+ Add stream**.

Enter:

- Channel name
- An authorized HTTPS HLS `.m3u8` URL
- Category

## Common reason a stream doesn't play

The stream server must permit browser access (CORS) and the stream must be reachable over HTTPS when your GitHub Pages site is HTTPS. A playlist URL can be valid but still fail in a browser if the provider blocks cross-origin requests or requires authentication.

hls.js documentation:
https://github.com/video-dev/hls.js
