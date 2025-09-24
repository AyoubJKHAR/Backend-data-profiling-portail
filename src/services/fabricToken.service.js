import axios from "axios";

export async function getFabricToken() {
  const { data } = await axios.post(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://api.fabric.microsoft.com/.default",
      grant_type: "client_credentials",
    })
  );
  return data.access_token;
}
