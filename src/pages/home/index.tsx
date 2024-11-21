import { useEffect, useState } from 'react';
import { SocialMedia } from '../../components/socialMedia';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

import { db } from '../../services/firebaseConnection';
import {
    doc,
    getDoc,
    collection,
    query,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { LinkProps } from '../admin';

interface SocialLinksProps {
    facebook: string;
    youtube: string;
    instagram: string;
}

export function Home() {
    const [links, setLinks] = useState<LinkProps[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

    useEffect(() => {
        function getDados() {
            const linksRef = collection(db, 'links');
            const queryRef = query(linksRef, orderBy("created", "asc"));
            getDocs(queryRef)
            .then((snapShot) => {
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
        }

        getDados();
    }, []);

    useEffect(() => {
        function loadLinks() {
            const docRef = doc(db, 'social', 'link');
            getDoc(docRef)
            .then((snapShot) => {
                if(snapShot.data() !== undefined) {
                    setSocialLinks({
                        facebook: snapShot.data()?.facebook,
                        youtube: snapShot.data()?.youtube,
                        instagram: snapShot.data()?.instagram,   
                    })
                }
            })
        }

        loadLinks();
    }, []);

    return (
        <div className="flex flex-col w-full py-4 items-center justify-center">
            <h1 className="md:text-4xl  text-3xl font-bold text-white mt-20">Márcio Jorge</h1>
            <span className="text-gray-50 mb-5 mt-3">Veja meus links!👇</span>

            <main className="flex flex-col w-11/12 max-w-xl text-center">
                {links.map((item) => (
                    <article 
                        className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                        style={{ backgroundColor: `${item.bg}`, color: `${item.color}`}}
                        key={item.id}
                    >
                    <a href={item.url} target='_blank'>
                        <p>{item.name}</p>
                    </a>
                </article>
                ))}

                {socialLinks &&  Object.keys(socialLinks).length > 0 && (
                    <footer className="flex justify-center gap-3 my-4">
                    <SocialMedia url={socialLinks?.facebook}>
                    <FaFacebook size={35} color='#FFF'/>
                    </SocialMedia>

                    <SocialMedia url={socialLinks?.instagram}>
                    <FaInstagram size={35} color='#FFF'/>
                    </SocialMedia>

                    <SocialMedia url={socialLinks?.youtube}>
                    <FaYoutube size={35} color='#FFF'/>
                    </SocialMedia>
                </footer>
                )}
            </main>
        </div>
    )
}