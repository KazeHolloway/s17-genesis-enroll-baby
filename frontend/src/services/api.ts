const API_URL = "http://localhost:5000";

export default API_URL;
type BabyData = {
  nom: string;
  prenom: string;
  sexe: string;
  taille_naissance: number;
  poids_naissance: number;
  date_naissance: string;
  lieu_naissance: string;
  statut_vital: string;
};

export async function postData(endpoint:string,
data:BabyData) {
try{
  const reponse=await fetch(API_URL + endpoint,
{ method:"POST",
  header:{
  "Content-Type":"application/json",
},
  body:JSON.stringfy(data),
  
);if (!reponse.ok) {
  throw new Error("Erreur lors de la requête");
}
  const result=await reponse.json();
  return result;
}
catch(error){
throw error;
}
}
