// ThingSpeak API configuration and service
export interface ThingSpeakConfig {
  channelId: string;
  readApiKey: string;
  writeApiKey: string;
  baseUrl: string;
}

export interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1?: string; // Battery Level
  field2?: string; // Solar Voltage
  field3?: string; // Solar Current
  field4?: string; // LDR Raw Value
  field5?: string; // Temperature
  field6?: string; // Humidity
  field7?: string; // Trap Status (0/1)
  field8?: string; // Trap Intensity
}

export interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakEntry[];
}

class ThingSpeakService {
  private config: ThingSpeakConfig;

  constructor(config: ThingSpeakConfig) {
    this.config = config;
  }

  // Read data from ThingSpeak channel
  async readChannelData(results: number = 100): Promise<ThingSpeakResponse> {
    const url = `${this.config.baseUrl}/channels/${this.config.channelId}/feeds.json?api_key=${this.config.readApiKey}&results=${results}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      throw error;
    }
  }

  // Get latest entry from channel
  async getLatestEntry(): Promise<ThingSpeakEntry | null> {
    const url = `${this.config.baseUrl}/channels/${this.config.channelId}/feeds/last.json?api_key=${this.config.readApiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest ThingSpeak entry:', error);
      return null;
    }
  }

  // Write data to ThingSpeak channel (for control commands)
  async writeData(data: Partial<Record<string, string | number>>): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('api_key', this.config.writeApiKey);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${this.config.baseUrl}/update`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error writing to ThingSpeak:', error);
      return false;
    }
  }

  // Get field data for charts
  async getFieldData(fieldNumber: number, results: number = 100): Promise<Array<{created_at: string, value: number}>> {
    const url = `${this.config.baseUrl}/channels/${this.config.channelId}/fields/${fieldNumber}.json?api_key=${this.config.readApiKey}&results=${results}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.feeds
        .filter((feed: any) => feed[`field${fieldNumber}`] !== null)
        .map((feed: any) => ({
          created_at: feed.created_at,
          value: parseFloat(feed[`field${fieldNumber}`]) || 0
        }));
    } catch (error) {
      console.error(`Error fetching field ${fieldNumber} data:`, error);
      return [];
    }
  }
}

// Default configuration - users should update these values
export const defaultThingSpeakConfig: ThingSpeakConfig = {
  channelId: '2739166', // Example channel ID - replace with your actual channel
  readApiKey: 'YOUR_READ_API_KEY', // Replace with your read API key
  writeApiKey: 'YOUR_WRITE_API_KEY', // Replace with your write API key
  baseUrl: 'https://api.thingspeak.com'
};

export const thingSpeakService = new ThingSpeakService(defaultThingSpeakConfig);