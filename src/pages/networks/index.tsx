import { FormEvent, useEffect, useState } from "react";
import { CustomInput } from "../../components/customInput";
import { Header } from "../../components/header";

import { db } from '../../services/firebaseConnection';
import {
    setDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

export function Networks() {
    const [urlFace, setUrlFace] = useState('');
    const [urlInsta, setUrlInsta] = useState('');
    const [urlYoutube, setUrlYoutube] = useState('');

    useEffect(() => {
        function loadLinks() {
            const docRef = doc(db, 'social', 'link');
            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data() !== undefined) {
                    setUrlFace(snapshot.data()?.facebook);
                    setUrlInsta(snapshot.data()?.instagram);
                    setUrlYoutube(snapshot.data()?.youtube);
                }
            })
        }

        loadLinks();
    }, []);

    function handleRegister(e: FormEvent) {
        e.preventDefault();

        setDoc(doc(db, "social", "link"), {
            facebook: urlFace,
            instagram: urlInsta,
            youtube: urlYoutube,
        })
        .then(() => {
            console.log("Links cadastrados/atualizados");
        })
        .catch((e) => {
            console.log("Error: " + e);
        });
    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <h1 className="text-white text-2xl font-medium mt-8  mb-4">Minhas redes sociais</h1>

            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Link do Facebook</label>
                <CustomInput 
                    type="url"
                    placeholder="Digite a url do facebook..."
                    value={urlFace}
                    onChange={(e) => setUrlFace(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do Instagram</label>
                <CustomInput 
                    type="url"
                    placeholder="Digite a url do instagram..."
                    value={urlInsta}
                    onChange={(e) => setUrlInsta(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do Youtube</label>
                <CustomInput 
                    type="url"
                    placeholder="Digite a url do youtube..."
                    value={urlYoutube}
                    onChange={(e) => setUrlYoutube(e.target.value)}
                />

                <button 
                    type="submit"
                    className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium"
                >
                    Salvar links
                </button>
            </form>
        </div>
    )
}