export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_updated?: string;
  last_changed?: string;
}

export interface Hass {
  states: Record<string, HassEntity>;
}

export interface WaterTankCardConfig {
  type: string;
  title?: string;
  entity_volume: string;
  capacity?: number;
  entities?: {
    height?: string;
    raw?: string;
  };
}
