import { FormEvent, useEffect, useState } from "react";
import { CustomInput } from "../../components/customInput";
import { Header } from "../../components/header";

import { FiTrash } from 'react-icons/fi';

import { db } from "../../services/firebaseConnection";
import {
    addDoc, //define o auto-id
    collection, //cria uma nova coleção
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc
} from "firebase/firestore";

export interface LinkProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

export function Admin() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [textColor, setTextColor] = useState('#f1f1f1');
    const [backgrounColor, setBackgrounColor] = useState('#121212');
    const [links, setLinks] = useState<LinkProps[]>([]);

    useEffect(() => {
        const linksRef = collection(db, "links");
        const queryRef = query(linksRef, orderBy('created', "asc"));

        const unsub = onSnapshot(queryRef, (snapShot) => {
            let lista = [] as LinkProps[];

            snapShot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })

            setLinks(lista);
        })

        return () => {
            unsub();
        }
    }, [])

    function handleRegister(e: FormEvent) {
        e.preventDefault();

        if(name ==='' || url === '')  {
            alert("Preencha todos os campos.");
            return;
        }

        addDoc(collection(db, "links"), {
            name: name,
            url: url,
            bg: backgrounColor,
            color: textColor,
            created: new Date()
        })
        .then(() => {
            setName('');
            setUrl('');
        })
        .catch((e) => {
            console.log("error: " + e);
        });
    }

    async function handleDeleteLink(id: string) {
        const docRef = doc(db, "links", id);
        await deleteDoc(docRef);
    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <form className="flex flex-col mt-8 mb-8 w-full max-w-xl"  onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do link</label>
                <CustomInput 
                    placeholder="Digite o nome do link..."
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">URL do link</label>
                <CustomInput 
                    placeholder="Digite a URL..."
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <section className="flex my-4 gap-5">
                    <div  className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Cor do link</label>
                        <input 
                            type="color"
                            value={textColor} 
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do link</label>
                        <input 
                            type="color"
                            value={backgrounColor} 
                            onChange={(e) => setBackgrounColor(e.target.value)}
                        />
                    </div>
                </section>

                {name !== '' && (
                    <div className="flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                        <label className="text-white font-medium mt-2 mb-3">Veja como está ficando:</label>
                        <article
                            className="w-11/12 max-w-lg flex flex-col items-center justify-center bg-zinc-900 rounded px-1 py-3"
                            style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgrounColor }}
                        >
                            <p className="font-medium" style={{ color: textColor }}>{name}</p>
                        </article>
                    </div>
                )}

                <button type="submit" className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center">
                    Cadastrar
                </button>
            </form>

            <h2 className="font-bold text-white text-2xl">
                Meus links
            </h2>

            {links.map((item) => (
                <article 
                    className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                    style={{ backgroundColor: `${item.bg}`, color: `${item.color}`}}
                    key={item.id}
                >
                    <p>{item.name}</p>
                    <div>
                        <button
                            className="border border-dashed p-1 rounded bg-neutral-900"
                        >
                            <FiTrash size={18} color="#FFF" onClick={() => handleDeleteLink(item.id)} />
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}