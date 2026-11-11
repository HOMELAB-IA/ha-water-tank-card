import { css } from "lit";

export const cardStyles = css`
  :host {
    --wtc-accent: #3b8bd4;
    --wtc-card-bg: var(--ha-card-background, #1a1c20);
    --wtc-text: var(--primary-text-color, #e1e1e1);
    --wtc-text-sec: var(--secondary-text-color, #9b9b9b);
    --wtc-border: rgba(255, 255, 255, 0.08);
    display: block;
    width: 100%;
    container-type: inline-size;
    container-name: wtc;
  }

  ha-card {
    width: 100%;
  }

  .card {
    background: var(--wtc-card-bg);
    border-radius: 16px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: inherit;
    color: var(--wtc-text);
    box-sizing: border-box;
  }

  /* ── Header ───────────────────────────── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
    color: var(--wtc-text);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .badge--online {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  .badge--online .badge-dot {
    background: #4caf50;
  }
  .badge--offline {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }
  .badge--offline .badge-dot {
    background: #ff9800;
  }

  /* ── Main: tank + stats ───────────────── */
  .main {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    gap: 20px;
  }

  .tank-wrap {
    width: 110px;
  }

  .tank-wrap svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .stats {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .pct-value {
    font-size: 56px;
    font-weight: 300;
    color: var(--wtc-text);
    line-height: 1;
    cursor: pointer;
    user-select: none;
  }

  .pct-value:hover {
    opacity: 0.75;
  }

  .pct-unit {
    font-size: 28px;
    font-weight: 300;
    opacity: 0.7;
  }

  .liters-value {
    font-size: 15px;
    color: var(--wtc-text-sec);
  }

  /* ── Sensor details ───────────────────── */
  .details-wrap {
    border-top: 1px solid var(--wtc-border);
    padding-top: 12px;
  }

  .details-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--wtc-text-sec);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: inherit;
  }

  .chevron {
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  .chevron.open {
    transform: rotate(180deg);
  }

  .details-grid {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 2px 0;
  }
  .detail-row:hover {
    opacity: 0.8;
  }

  .detail-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .detail-icon--height {
    background: rgba(59, 139, 212, 0.25);
    color: #3b8bd4;
  }
  .detail-icon--raw {
    background: rgba(255, 255, 255, 0.08);
    color: #9b9b9b;
  }
  .detail-icon--volume {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .detail-label {
    font-size: 13px;
    color: var(--wtc-text-sec);
    flex: 1;
  }

  .detail-value {
    font-size: 13px;
    color: var(--wtc-text);
    font-weight: 500;
  }

  .detail-unit {
    color: var(--wtc-text-sec);
    font-weight: 400;
  }

  /* ── Last updated ─────────────────────── */
  .last-updated {
    font-size: 11.5px;
    color: var(--wtc-text-sec);
    opacity: 0.7;
  }

  /* ── Responsive ───────────────────────── */
  @container wtc (max-width: 280px) {
    .main {
      grid-template-columns: 80px 1fr;
      gap: 14px;
    }
    .tank-wrap {
      width: 80px;
    }
    .pct-value {
      font-size: 40px;
    }
    .pct-unit {
      font-size: 20px;
    }
  }
`;
