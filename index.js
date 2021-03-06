// Import the functions you need from the SDKs you need
// with Commonjs syntax (if using Node)
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const express = require('express');
const cors = require("cors");
const express_app = express();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

const categorias = [
    "Libro Album",
    "Cuento",
    "Novela",
    "Mitos y leyendas",
    "Historieta",
    "Teatro",
    "Poesia"
]

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firestore.getFirestore();
const Libros = firestore.collection(db, 'libros');
// firestore.getDocs(Libros).then((result) => {
//     result.docs.forEach((libro) => {
//         console.log(libro.data());
//     })
// })

express_app.use(express.json());
express_app.use(cors());

let router = express.Router();


router.get("/", async(req,res) => {
    let querySnapshot = await firestore.getDocs(Libros);
    let todos_los_libros = querySnapshot.docs.map(doc => doc.data());
    // console.log(todos_los_libros);
    res.json(todos_los_libros);
})


router.get("/mas-destacados", async(req, res) => {
    let querySnapshot = await firestore.getDocs(firestore.query(Libros, firestore.orderBy("puntaje", "desc"), firestore.limit(5)));
    let mas_destacados = querySnapshot.docs.map(doc => doc.data());

    console.log(mas_destacados);
    res.json(mas_destacados);
})


router.get("/libros/:id", async (req, res)=>{
    let libro_id = `${req.params.id}`;
    let libro = await firestore.getDoc(firestore.doc(Libros, libro_id));

    if (libro.exists()){
        res.json(libro.data());
    }

    else {
        res.json({mensaje:"El libro no existe :("});
    }
})

// Filtrar por categorias
router.get("/libros", async(req, res) => {
    let categoria = req.query.categoria;

    if (categorias.indexOf(categoria) === -1){
        res.json({mensaje: "No existe la categor??a: " + categoria});

    } else {
        let querySnapshot = await firestore.getDocs(firestore.query(Libros, firestore.where("categoria", "==", categoria)))
        let libros_categoria = querySnapshot.docs.map(doc => doc.data());
        res.json(libros_categoria)
    }
})


express_app.use(router);

express_app.listen(process.env.PORT || 3000, ()=>{
    console.log("Node server running on http://localhost:3000");
})
