const API_URL = "http://localhost:5000";

export default API_URL;

export async function postData(endpoint: string, data: object) {
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

  return reponse.json();
}