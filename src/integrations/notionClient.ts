import axios from "axios";

const NOTION_API_BASE_URL = "https://api.notion.com/v1";
const NOTION_API_VERSION = "2022-06-28";

interface NotionClientConfig {
  apiKey: string;
}

export class NotionClient {
  private apiKey: string;

  constructor(config: NotionClientConfig) {
    this.apiKey = config.apiKey;
  }

  async queryDatabase(databaseId: string) {
    const url = NOTION_API_BASE_URL + "/databases/" + databaseId + "/query";
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Authorization": "Bearer " + this.apiKey,
            "Notion-Version": NOTION_API_VERSION,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao consultar banco de dados Notion:", error);
      throw error;
    }
  }
}
