import {useState} from 'react';
import { postData } from "../../services/api";
import type {BabyData} from "../../lib/types";
import type {dataParent} from "../../lib/types";
import logo from "../../assets/logo.png";
import "./CreationBaby.css";

function CreationBaby(){
    const [name,setName]=useState("");
    const [firstname,setfirstName]=useState("");
    const [sex,setSex]=useState("");
    const [birthdate,setBirthDate]=useState("");
    const [birthplace,setBirthPlace]=useState("");
    const [weight,setWeight]=useState("");
    const [height,setHeight]=useState("");
    const [vitalstate,setVitalState]=useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
  

        const nom=formData.get("nom");
        const prenom=formData.get("prenom");
        const sexe=formData.get("sexe");
        const date_naissance=formData.get("date_naissance");
        const lieu_naissance=formData.get("lieu_naissance");
        const statut_vital=formData.get("statut_vital");
        const taille_naissance=Number(formData.get("taille_naissance"));
        const poids_naissance=Number(formData.get("poids_naissance"));
        
        const mereNom = formData.get("mere_nom");
        const merePrenom = formData.get("mere_prenom");
        const mereTelephone = formData.get("mere_telephone");
        const mereEmail = formData.get("mere_email");
        const mereAdresse = formData.get("mere_adresse");

        const pereNom = formData.get("pere_nom");
        const perePrenom = formData.get("pere_prenom");
        const pereTelephone = formData.get("pere_telephone");
        const pereEmail = formData.get("pere_email");
        const pereAdresse = formData.get("pere_adresse");
        
        if(typeof nom!=="string"
        || typeof prenom!=="string" 
        ||typeof sexe!=="string"
        ||typeof date_naissance!=="string"
        ||typeof lieu_naissance!=="string"
        ||typeof statut_vital!=="string"){
            return;
        }

        if(Number.isNaN(poids_naissance)||Number.isNaN(taille_naissance)){
            return;
        }

        
        if ( typeof mereNom !== "string" 
            || typeof merePrenom !== "string" 
            || typeof mereTelephone !== "string"
            || typeof mereEmail !== "string" 
            || typeof mereAdresse !== "string" 
            || typeof pereNom !== "string" 
            || typeof perePrenom !== "string" 
            || typeof pereTelephone !== "string" 
            || typeof pereEmail !== "string" 
            || typeof pereAdresse !== "string" ) {
                 return; }

        const babydata:BabyData={
            nom:nom,
            prenom:prenom,
            sexe:sexe,
            taille_naissance:taille_naissance,
            poids_naissance:poids_naissance,
            statut_vital:statut_vital,
            date_naissance:date_naissance,
            lieu_naissance:lieu_naissance,
            
        }
        const mere: dataParent = {
            nom: mereNom,
            prenom: merePrenom,
            telephone: mereTelephone,
            email: mereEmail,
            adresse: mereAdresse,
            lien: "mere",
        };
        const pere: dataParent = {
        nom: pereNom,
        prenom: perePrenom,
        telephone: pereTelephone,
        email: pereEmail,
        adresse: pereAdresse,
        lien: "pere",
    };

try {
    await postData("/api/enfants/enregistrement", {
        enfant: babydata,
        parents: [mere, pere],
    });

    setMessageType("success");
    setMessage("Nouveau-né enregistré avec succès.");
} catch {
} catch {
    setMessageType("error");
    setMessage("Impossible d'enregistrer le nouveau-né.");
}

setTimeout(() => {
    setMessage("");
}, 3000);


         
}
    return (
        <>
        <div className="page-enregistrement">
        <div className="entete-enregistrement">
        <img src={logo} alt="Logo Enroll Baby" />
        <h1>Enregistrement du nouveau né</h1>

        {message && (
            <div className={`message-succes ${messageType}`}>
                <span className="message-icon">
                    {messageType === "success" ? "✓" : "!"}
                </span>

                <span>{message}</span>
            </div>
        )}


        </div>
        <form onSubmit={handleSubmit} className="formulaire-enregistrement">
            <fieldset className="formulaire-bebe">
                <legend>Information du nouveau né</legend>
                <label htmlFor="nom">Nom:</label>
                <input placeholder="Entrez le nom du nouveau-né" type="text" id="nom" name="nom" value={name} onChange={(event)=>
                    setName(event.target.value)
                }/>
                <label htmlFor="prenom">Prénom:</label>
                <input placeholder="Entrez le prénom du nouveau-né" type="text" id="prenom" name="prenom" value={firstname}
                onChange={(event)=>setfirstName(event.target.value)}
                />

                <label htmlFor="sexe">Sexe:</label>
                <select id="sexe" value={sex} name='sexe'
                onChange={(event)=>setSex(event.target.value)}
                >
                    <option value="">Selectionner le sexe du nouveau-né</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                </select>

                <label htmlFor="date-naissance">Date de naissance:</label>
                <input type="date" id="date-naissance" value={birthdate} name="date_naissance"
                    onChange={(event)=>setBirthDate(event.target.value)}
                />

                <label htmlFor="lieu-naissance">Lieu de naissance:</label>
                <input placeholder="Entrez lelieu de naissance" type="text" id="lieu-naissance" name='lieu_naissance'
                    value={birthplace} onChange={(event)=>setBirthPlace(event.target.value)}
                 />
                
                <label htmlFor="poids_naissance">Poids à la naissance(en kg):</label>
                <input placeholder="Entrez le poids_naissance" type="number" id="poids_naissance" name="poids_naissance"
                    value={weight} onChange={(event)=>setWeight(event.target.value)}
                />
                
                <label htmlFor="taille_naissance">Taille à la naissance(en cm):</label>
                <input placeholder="Entrez la taille_naissance" type="number" id="taille_naissance" name='taille_naissance'
                    value={height} onChange={(event)=>setHeight(event.target.value)}
                />

                <label htmlFor="statut-vital">Statut vital:</label>
                <select id="statut-vital" value={vitalstate} name="statut_vital" onChange={(event)=>{
                    setVitalState(event.target.value)
                }}>
                    <option value="">Selectionnez le statut vital du nouveau-né</option>
                    <option value="vivant">Vivant</option>
                    <option value="mort_ne">Mort-né</option>
                    <option value="decede">Décédé</option>
                </select>

                <label htmlFor="photo">Photo du nouveau-né:</label>
                <input type="file" id="photo" accept="image/*" name="photo"/>
            </fieldset>
            <div className="formulaires-parents">
            <fieldset className="formulaire-parent">
                <legend>Informations de la mère</legend>

                <label htmlFor="mere_nom">Nom :</label>
                <input
                    type="text"
                    id="mere_nom"
                    name="mere_nom"
                    placeholder="Entrez le nom de la mère"
                />

                <label htmlFor="mere_prenom">Prénom :</label>
                <input
                    type="text"
                    id="mere_prenom"
                    name="mere_prenom"
                    placeholder="Entrez le prénom de la mère"
                />

                <label htmlFor="mere_telephone">Téléphone :</label>
                <input
                    type="tel"
                    id="mere_telephone"
                    name="mere_telephone"
                    placeholder="Entrez le téléphone de la mère"
                />

                <label htmlFor="mere_email">Email :</label>
                <input
                    type="email"
                    id="mere_email"
                    name="mere_email"
                    placeholder="Entrez l'email de la mère"
                />

                <label htmlFor="mere_adresse">Adresse :</label>
                <input
                    type="text"
                    id="mere_adresse"
                    name="mere_adresse"
                    placeholder="Entrez l'adresse de la mère"
                />
        </fieldset>
        <fieldset className="formulaire-parent">
            <legend>Informations du père</legend>

            <label htmlFor="pere_nom">Nom :</label>
            <input
                type="text"
                id="pere_nom"
                name="pere_nom"
                placeholder="Entrez le nom du père"
            />

            <label htmlFor="pere_prenom">Prénom :</label>
            <input
                type="text"
                id="pere_prenom"
                name="pere_prenom"
                placeholder="Entrez le prénom du père"
            />

            <label htmlFor="pere_telephone">Téléphone :</label>
            <input
                type="tel"
                id="pere_telephone"
                name="pere_telephone"
                placeholder="Entrez le téléphone du père"
            />

            <label htmlFor="pere_email">Email :</label>
            <input
                type="email"
                id="pere_email"
                name="pere_email"
                placeholder="Entrez l'email du père"
            />

            <label htmlFor="pere_adresse">Adresse :</label>
            <input
                type="text"
                id="pere_adresse"
                name="pere_adresse"
                placeholder="Entrez l'adresse du père"
            />
        </fieldset>
        </div>
        <button type='submit'>Valider</button>
        </form>


    </div>
        </>
    );
}



export default  CreationBaby ;
