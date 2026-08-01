const ENDPOINT = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const CACHE_TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 8000;

class EarthquakeFeed extends HTMLElement {
  static get observedAttributes() {
    return ["minmagnitude", "limit"];
  }

  constructor() {
    super();
    this._built = false;
    this._abortController = null;
    this._fetchId = 0;
  }

  connectedCallback() {
    if (!this._built) this._build();
    this._fetchData();
  }

  disconnectedCallback() {
    if (this._abortController) this._abortController.abort();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (this.isConnected && this._built) this._fetchData();
  }

  get minMagnitude() {
    return this.getAttribute("minmagnitude") || "2.5";
  }

  get limit() {
    return this.getAttribute("limit") || "8";
  }

  _build() {
    this._template = this.querySelector("template");
    this._fallback = this.querySelector(".eq-fallback");

    this._status = document.createElement("p");
    this._status.className = "eq-status";
    this._status.setAttribute("role", "status");
    this._status.setAttribute("aria-live", "polite");

    this._list = document.createElement("ul");
    this._list.hidden = true;

    this._retry = document.createElement("button");
    this._retry.type = "button";
    this._retry.className = "eq-retry";
    this._retry.textContent = "Retry";
    this._retry.hidden = true;
    this._retry.addEventListener("click", () => this._fetchData());

    this._attribution = document.createElement("p");
    this._attribution.className = "eq-attribution";
    this._attribution.textContent = "Data: USGS Earthquake Hazards Program";
    this._attribution.hidden = true;

    this.append(this._status, this._list, this._retry, this._attribution);
    this.dataset.state = "idle";
    this._built = true;
  }

  _cacheKey(url) {
    return `earthquake-feed:${url}`;
  }

  _readCache(url) {
    try {
      const raw = window.sessionStorage.getItem(this._cacheKey(url));
      if (!raw) return null;
      const { timestamp, data } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_TTL_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  _writeCache(url, data) {
    try {
      window.sessionStorage.setItem(
        this._cacheKey(url),
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch {
      /* storage unavailable or full: caching is a best-effort optimization only */
    }
  }

  async _fetchData() {
    if (this._abortController) this._abortController.abort();
    const controller = new AbortController();
    this._abortController = controller;
    const fetchId = (this._fetchId += 1);
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const url =
      `${ENDPOINT}?format=geojson&orderby=time` +
      `&minmagnitude=${encodeURIComponent(this.minMagnitude)}` +
      `&limit=${encodeURIComponent(this.limit)}`;

    this._setState("loading");
    this._status.textContent = "Loading recent earthquakes…";
    this._retry.hidden = true;

    const cached = this._readCache(url);
    if (cached) {
      clearTimeout(timeoutId);
      this._render(cached);
      return;
    }

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`USGS responded with ${response.status}`);
      const data = await response.json();
      this._writeCache(url, data);
      if (!this.isConnected || fetchId !== this._fetchId) return;
      this._render(data);
    } catch (err) {
      if (!this.isConnected || fetchId !== this._fetchId) return;
      this._setState("error");
      this._status.textContent =
        err.name === "AbortError"
          ? "The request timed out. Please try again."
          : "Couldn't load earthquake data right now.";
      this._list.hidden = true;
      this._attribution.hidden = true;
      if (this._fallback) this._fallback.hidden = false;
      this._retry.hidden = false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  _setState(state) {
    this.dataset.state = state;
  }

  _render(geojson) {
    const features = (geojson && geojson.features) || [];
    this._list.textContent = "";

    if (features.length === 0) {
      this._setState("idle");
      this._status.textContent = "No recent earthquakes matched this filter.";
      this._list.hidden = true;
      this._attribution.hidden = true;
      if (this._fallback) this._fallback.hidden = false;
      return;
    }

    for (const feature of features) {
      const item = this._template.content.cloneNode(true);
      const props = feature.properties || {};
      const mag = typeof props.mag === "number" ? props.mag.toFixed(1) : "?";
      const magEl = item.querySelector(".eq-mag");
      const placeEl = item.querySelector(".eq-place");
      const timeEl = item.querySelector(".eq-time");
      if (magEl) magEl.textContent = `M${mag}`;
      if (placeEl) placeEl.textContent = props.place || "Unknown location";
      if (timeEl && props.time) {
        const date = new Date(props.time);
        timeEl.setAttribute("datetime", date.toISOString());
        timeEl.textContent = date.toLocaleString();
      }
      this._list.appendChild(item);
    }

    this._setState("ready");
    this._status.textContent = `Showing ${features.length} recent earthquake${
      features.length === 1 ? "" : "s"
    }.`;
    this._list.hidden = false;
    this._retry.hidden = true;
    this._attribution.hidden = false;
    if (this._fallback) this._fallback.hidden = true;
  }
}

customElements.define("earthquake-feed", EarthquakeFeed);
