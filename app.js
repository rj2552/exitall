const video = document.getElementById("video");
const emptyState = document.getElementById("emptyState");
const channelsEl = document.getElementById("channels");
const countEl = document.getElementById("channelCount");
const nowTitle = document.getElementById("nowTitle");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("search");
const dialog = document.getElementById("addDialog");
const addForm = document.getElementById("addForm");

let hls = null;
let channels = JSON.parse(localStorage.getItem("iptvChannels") || "[]");
let selectedId = null;

function save() {
  localStorage.setItem("iptvChannels", JSON.stringify(channels));
}

function iconFor(name) {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const visible = channels.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.category.toLowerCase().includes(query)
  );

  countEl.textContent = `${channels.length} channel${channels.length === 1 ? "" : "s"}`;

  if (!visible.length) {
    channelsEl.innerHTML = `<div class="empty-list">${channels.length ? "No channels match your search." : "No channels yet.<br>Click “+ Add stream” to add one."}</div>`;
    return;
  }

  channelsEl.innerHTML = visible.map(c => `
    <button class="channel ${c.id === selectedId ? "active" : ""}" data-id="${escapeHtml(c.id)}">
      <span class="channel-icon">${escapeHtml(iconFor(c.name))}</span>
      <span class="channel-info">
        <span class="channel-name">${escapeHtml(c.name)}</span>
        <span class="channel-meta">${escapeHtml(c.category)}</span>
      </span>
    </button>
  `).join("");

  channelsEl.querySelectorAll(".channel").forEach(btn => {
    btn.addEventListener("click", () => play(btn.dataset.id));
  });
}

function play(id) {
  const channel = channels.find(c => c.id === id);
  if (!channel) return;

  selectedId = id;
  nowTitle.textContent = channel.name;
  statusEl.textContent = "Loading…";
  statusEl.className = "status";
  emptyState.style.display = "none";
  render();

  if (hls) {
    hls.destroy();
    hls = null;
  }

  video.pause();
  video.removeAttribute("src");
  video.load();

  if (window.Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(channel.url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      statusEl.textContent = "Ready";
      statusEl.className = "status";
      video.play().catch(() => {});
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error("HLS error", data);
      if (data.fatal) {
        statusEl.textContent = "Stream error";
        statusEl.className = "status";
      }
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = channel.url;
    video.addEventListener("loadedmetadata", () => {
      statusEl.textContent = "Ready";
      video.play().catch(() => {});
    }, { once: true });
  } else {
    statusEl.textContent = "HLS not supported";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

document.getElementById("addBtn").addEventListener("click", () => {
  addForm.reset();
  dialog.showModal();
  document.getElementById("name").focus();
});

function closeDialog() {
  dialog.close();
}

document.getElementById("closeDialog").addEventListener("click", closeDialog);
document.getElementById("cancelBtn").addEventListener("click", closeDialog);

addForm.addEventListener("submit", event => {
  event.preventDefault();

  const channel = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: document.getElementById("name").value.trim(),
    url: document.getElementById("url").value.trim(),
    category: document.getElementById("category").value
  };

  channels.push(channel);
  save();
  render();
  dialog.close();
  play(channel.id);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (!channels.length) return;
  if (!confirm("Remove all saved channels from this browser?")) return;

  channels = [];
  selectedId = null;
  save();
  if (hls) hls.destroy();
  video.pause();
  video.removeAttribute("src");
  video.load();
  emptyState.style.display = "";
  nowTitle.textContent = "Nothing selected";
  statusEl.textContent = "Ready";
  statusEl.className = "status";
  render();
});

searchEl.addEventListener("input", render);

video.addEventListener("playing", () => {
  statusEl.textContent = "Playing";
  statusEl.className = "status live";
});

video.addEventListener("waiting", () => {
  statusEl.textContent = "Buffering…";
  statusEl.className = "status";
});

render();
