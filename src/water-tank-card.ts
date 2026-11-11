import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { cardStyles } from "./styles.js";
import type { WaterTankCardConfig, Hass, HassEntity } from "./types.js";

const CARD_VERSION = "0.1.0";

export function computePct(state: string): number {
  if (state === "unavailable" || state === "unknown") return 0;
  const n = parseFloat(state);
  return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
}

export function computeLiters(pct: number, capacity: number): number {
  return Math.round((pct / 100) * capacity);
}

export function formatRelTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "mis à jour il y a quelques secondes";
  if (mins < 60) return `mis à jour il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `mis à jour il y a ${hrs} h`;
  return `mis à jour il y a ${Math.floor(hrs / 24)} j`;
}

export function formatNum(state: string | undefined): string {
  if (!state || state === "unavailable" || state === "unknown") return "—";
  const n = parseFloat(state);
  if (isNaN(n)) return state;
  return n.toFixed(2).replace(".", ",");
}

class WaterTankCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass!: Hass;
  @state() private _config!: WaterTankCardConfig;
  @state() private _detailsOpen = false;

  setConfig(config: WaterTankCardConfig): void {
    if (!config.entity_volume) {
      throw new Error("water-tank-card: 'entity_volume' est requis");
    }
    this._config = config;
  }

  static getStubConfig(): Partial<WaterTankCardConfig> {
    return {
      title: "Citerne d'eau de pluie",
      entity_volume: "sensor.citerne_volume",
      capacity: 5000,
    };
  }

  getCardSize(): number {
    return 4;
  }

  private _ent(id: string | undefined): HassEntity | undefined {
    return id ? this.hass?.states[id] : undefined;
  }

  private _fireMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } })
    );
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    const c = this._config;

    const volEnt = this._ent(c.entity_volume);
    const isUnavailable =
      !volEnt || volEnt.state === "unavailable" || volEnt.state === "unknown";
    const pct = isUnavailable ? 0 : computePct(volEnt!.state);
    const liters = c.capacity !== undefined ? computeLiters(pct, c.capacity) : undefined;

    const heightEnt = this._ent(c.entities?.height);
    const rawEnt = this._ent(c.entities?.raw);
    const hasDetails = !!(heightEnt || rawEnt || volEnt);

    return html`
      <ha-card>
        <div class="card">
          ${this._renderHeader(isUnavailable)}
          ${this._renderMain(pct, liters, volEnt)}
          ${hasDetails ? this._renderDetails(heightEnt, rawEnt, volEnt, pct) : nothing}
          ${volEnt?.last_updated
            ? html`<div class="last-updated">${formatRelTime(volEnt.last_updated)}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderHeader(isUnavailable: boolean): TemplateResult {
    const title = this._config.title ?? "Citerne d'eau de pluie";
    return html`
      <div class="header">
        <span class="title">${title}</span>
        <span class="badge ${isUnavailable ? "badge--offline" : "badge--online"}">
          <span class="badge-dot"></span>
          ${isUnavailable ? "HORS LIGNE" : "EN LIGNE"}
        </span>
      </div>
    `;
  }

  private _renderMain(
    pct: number,
    liters: number | undefined,
    volEnt: HassEntity | undefined
  ): TemplateResult {
    return html`
      <div class="main">
        <div class="tank-wrap">${this._renderTankSvg(pct)}</div>
        <div class="stats">
          <div
            class="pct-value"
            @click="${volEnt ? () => this._fireMoreInfo(volEnt!.entity_id) : nothing}"
          >
            ${pct}<span class="pct-unit">%</span>
          </div>
          ${liters !== undefined
            ? html`<div class="liters-value">${liters.toLocaleString("fr-FR")} l</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderTankSvg(pct: number): TemplateResult {
    const r = 52;
    const cx = 60;
    const cy = 60;
    const totalH = r * 2;
    const waterH = (pct / 100) * totalH;
    const waterY = cy + r - waterH;

    return html`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <clipPath id="wtc-clip">
            <circle cx="${cx}" cy="${cy}" r="${r}" />
          </clipPath>
          <radialGradient id="wtc-bg" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stop-color="#3a3d44" />
            <stop offset="100%" stop-color="#18191d" />
          </radialGradient>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#wtc-bg)" />
        ${pct > 0
          ? html`
              <rect
                x="${cx - r}"
                y="${waterY}"
                width="${r * 2}"
                height="${waterH}"
                fill="#2b6cb0"
                clip-path="url(#wtc-clip)"
              />
              <ellipse
                cx="${cx}"
                cy="${waterY}"
                rx="${r - 5}"
                ry="5"
                fill="#4299e1"
                opacity="0.55"
                clip-path="url(#wtc-clip)"
              />
            `
          : nothing}
        <circle
          cx="${cx}"
          cy="${cy}"
          r="${r}"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="2"
        />
        <ellipse cx="45" cy="30" rx="13" ry="7" fill="white" opacity="0.07" />
      </svg>
    `;
  }

  private _renderDetails(
    heightEnt: HassEntity | undefined,
    rawEnt: HassEntity | undefined,
    volEnt: HassEntity | undefined,
    pct: number
  ): TemplateResult {
    return html`
      <div class="details-wrap">
        <button
          type="button"
          class="details-toggle"
          aria-expanded="${this._detailsOpen}"
          @click="${() => {
            this._detailsOpen = !this._detailsOpen;
          }}"
        >
          <span>DÉTAILS CAPTEUR</span>
          <svg
            class="chevron ${this._detailsOpen ? "open" : ""}"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        ${this._detailsOpen
          ? html`
              <div class="details-grid">
                ${heightEnt
                  ? html`
                      <div
                        class="detail-row"
                        @click="${() => this._fireMoreInfo(heightEnt.entity_id)}"
                      >
                        <span class="detail-icon detail-icon--height">I</span>
                        <span class="detail-label">hauteur</span>
                        <span class="detail-value">
                          ${formatNum(heightEnt.state)}<span class="detail-unit">
                            ${(heightEnt.attributes.unit_of_measurement as string) || " m"}</span
                          >
                        </span>
                      </div>
                    `
                  : nothing}
                ${rawEnt
                  ? html`
                      <div
                        class="detail-row"
                        @click="${() => this._fireMoreInfo(rawEnt.entity_id)}"
                      >
                        <span class="detail-icon detail-icon--raw">—</span>
                        <span class="detail-label">mesure</span>
                        <span class="detail-value">
                          ${formatNum(rawEnt.state)}<span class="detail-unit">
                            ${(rawEnt.attributes.unit_of_measurement as string) || " m"}</span
                          >
                        </span>
                      </div>
                    `
                  : nothing}
                ${volEnt
                  ? html`
                      <div
                        class="detail-row"
                        @click="${() => this._fireMoreInfo(volEnt.entity_id)}"
                      >
                        <span class="detail-icon detail-icon--volume">○</span>
                        <span class="detail-label">volume</span>
                        <span class="detail-value">${pct}<span class="detail-unit"> %</span></span>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

if (typeof customElements !== "undefined") {
  customElements.define("water-tank-card", WaterTankCard);
}

if (typeof window !== "undefined") {
  type WindowWithCards = typeof window & {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  };
  const _w = window as WindowWithCards;
  _w.customCards = _w.customCards ?? [];
  _w.customCards.push({
    type: "water-tank-card",
    name: "Water Tank Card",
    description: "Carte Lovelace pour citerne / cuve d'eau avec visualisation du niveau",
    preview: true,
    documentationURL: "https://github.com/HOMELAB-IA/ha-water-tank-card",
  });

  console.info(
    `%c Water Tank Card %c v${CARD_VERSION} `,
    "color:#3b8bd4;font-weight:bold",
    "color:#a6abb3"
  );
}
