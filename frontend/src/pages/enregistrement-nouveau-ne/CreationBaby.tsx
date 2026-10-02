import {useState} from 'react';
import "./formulaire.css";

function CreationBaby(){
    const [name,setName]=useState("");
    const [firstname,setfirstName]=useState("");
    const [sex,setSex]=useState("");
    const [birthdate,setBirthDate]=useState("");
    const [birthplace,setBirthPlace]=useState("");
    const [weight,setWeight]=useState("");
    const [height,setHeight]=useState("");
    const [vitalstate,setVitalState]=useState("");
    const [photo,setPhoto]=useState<File | null>(null);

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
        const photo=formData.get("photo");
        
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

        if(!(photo instanceof File)){
            return;
        }

        type BabyData={
            nom:string,
            prenom:string,
            sexe:string,
            taille_naissance:number,
            poids_naissance:number,
            date_naissance:string,
            lieu_naissance:string,
            statut_vital:string,
            photo:File
        }
        const babydata:BabyData={
            nom:nom,
            prenom:prenom,
            sexe:sexe,
            taille_naissance:taille_naissance,
            poids_naissance:poids_naissance,
            statut_vital:statut_vital,
            date_naissance:date_naissance,
            lieu_naissance:lieu_naissance,
            photo:photo
        }
        console.log(babydata);

        }
    return (
        <>
        <h1>Enregistrement du nouveau né</h1>
        <form onSubmit={handleSubmit}>
            <fieldset>
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
                <input type="file" id="photo" accept="image/*" name="photo" onChange={(event)=>{
                    if(event.target.files){
                        setPhoto(event.target.files[0]);
                    }
                }}/>
            </fieldset>
            <button type='submit'>Valider</button>
        </form>
        </>
    );
}



export default  CreationBaby ;
