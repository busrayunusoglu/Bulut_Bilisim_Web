import express from 'express'

import { generateUploadURL } from './s3.js'
import mysql from 'mysql'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'

const __dirname = path.resolve();
dotenv.config({ path: './.env' }); //veritabanı bilgilerini alır

const app = express()

app.use(express.static('View'))
//kullanılan görünüm yöntemini tanımladık
app.set('view engine', 'hbs');
app.use('/static', express.static(path.join(__dirname, 'public')))

//css js ve bootstrap gibi görünüm dosyalarının bulunduğu ana klasör static tanımlandı

//veritabanı bilgileri 
const db = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "bulutrds"
});
//veritabanı bağlantısı
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Mysql RDS Connected!")
    }
})

//post verilerini json formatına çevirmek için 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/s3Url', async (req, res) => {
    const url = await generateUploadURL()
    res.send({ url })

})

//tüm kullanıcılar için get
app.get('/list', (req, res) => {
    db.query('SELECT * FROM users ', (err, rows) => {
        //console.log(rows);
        res.render('list', {
            rows,
        });
    });

});

//user ekleme işlemi post ile
app.post("/form", (req, res,) => {
    console.log("Kullanıcı post işlemi yapıldı!")
    const adi = req.body.adi;
    const soyadi = req.body.soyadi;
    const eposta = req.body.eposta;
    const yas = req.body.yas;
    const unvan = req.body.unvan;
    const departman = req.body.departman;
    const aciklama = req.body.aciklama;
    const sqlQuery = "INSERT INTO users (adi, soyadi,eposta, yas, unvan, departman, aciklama) VALUES (?,?,?,?,?,?,?)";
    db.query(sqlQuery, [adi, soyadi, eposta, yas, unvan, departman, aciklama], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500)
            return
        }
        console.log("User Eklendi!");
        return res.redirect('/list');
       
    })
});

//user silme işlemi delete
app.get("/users/delete/:id", (req, res,) => {
    console.log("Kullanıcı delete işlemi yapıldı!")
    const userId = req.params.id;
    const sqlQuery = " DELETE FROM users WHERE id= ?";
    db.query(sqlQuery, userId, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500)
            return
        }
        console.log("User Silindi!");
        return res.redirect('/list');

    })
});

//id verisine göre kullanıcı için get
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sqlQuery = "SELECT * FROM users WHERE id= ? ";
    db.query(sqlQuery, [userId], (error, row) => {
        if (error) {
            console.log(error);
            res.sendStatus(500)
            res.end();
        } else {
            res.render('updateUser', {
                row,
            });
        }
    });
});
//user güncelleme işlemi put
app.post("/users/update/:id", (req, res,) => {
    console.log("Kullanıcı put işlemi yapıldı!")
    const userId = req.params.id;
    const { adi, soyadi, eposta, yas, unvan, departman, aciklama } = req.body;
    const sqlQuery = "UPDATE users SET adi=?, soyadi=?, eposta=?, yas=?, unvan=?, departman=?, aciklama=? WHERE id=?";
    db.query(sqlQuery, [adi, soyadi, eposta, yas, unvan, departman, aciklama, userId], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500)
            return
        }
        console.log("User Güncellendi!");
        return res.redirect('/list');
    })
});

app.listen(3001, () => console.log("Listening On Port 3001"))
// başlatmak için --> node Controller/server.js
// http://localhost:3001/ 

