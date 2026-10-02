import {useState} from 'react'

function CreationParent() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [adresse, setAdresse] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <>
            <h1>Enregistrement du parent</h1>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Informations du parent</legend>

                    <label htmlFor="nom">Nom :</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={nom}
                        onChange={(event) => setNom(event.target.value)}
                    />

                    <label htmlFor="prenom">Prénom :</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={prenom}
                        onChange={(event) => setPrenom(event.target.value)}
                    />

                    <label htmlFor="telephone">Téléphone :</label>
                    <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={telephone}
                        onChange={(event) => setTelephone(event.target.value)}
                    />

                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label htmlFor="adresse">Adresse :</label>
                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={adresse}
                        onChange={(event) => setAdresse(event.target.value)}
                    />
                </fieldset>

                <button type="submit">Valider</button>
            </form>
        </>
    );
}

export default CreationParent;
