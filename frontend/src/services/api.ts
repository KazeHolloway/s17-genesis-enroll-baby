
const API_URL = "http://localhost:5000";
import type { EnregistrementBaby } from "../lib/types";

export default API_URL;

export async function postData(endpoint: string, data: object) {
  try {
    const reponse = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!reponse.ok) {
      throw new Error("Erreur lors de la requête");
    }

    const result = await reponse.json();
    return result;
  } catch (error) {
    throw error;
  }

}

export async function getData(endpoint: string) {
  try {
    const reponse = await fetch(API_URL + endpoint);

    if (!reponse.ok) {
      throw new Error("Erreur lors de la requête");
    }

    const result = await reponse.json();
    return result;
  } catch (error) {
    throw error;
  }
}
