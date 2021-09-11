import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default class Database {
    private static instance: Database
    private readonly firebaseDB: any

    constructor() {
        // Initialize Firebase
        initializeApp({
            apiKey: "AIzaSyAAUpGOY7lBxacetipo7wSo2-Ks5vzdQM4",
            authDomain: "mage-arena-ddae5.firebaseapp.com",
            projectId: "mage-arena-ddae5",
            storageBucket: "mage-arena-ddae5.appspot.com",
            messagingSenderId: "841478924881",
            appId: "1:841478924881:web:f725b0d643a1cf21846670"
        });

        this.firebaseDB = getFirestore();
    }

    static getInstance (): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    async getFractions () {
        console.log('Get fractions');
        const querySnapshot = await getDocs(collection(this.firebaseDB, "fractions"));

        querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    }
}