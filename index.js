let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let cors = require('cors');
var session = require('express-session')
let app = express();
const FB = require('./fb')
const env = require('dotenv').config()
var request = require('request');
const authRoutes = require('./routes/auth')
const fbRoutes = require('./routes/fb')
const psuRoutes = require('./routes/psu')
app.use(cors({ origin: ['http://localhost:3000'], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
/* session*/
app.use(session({
    secret: 'keyboard cat', cookie: { maxAge: 60000 },
    resave: false, saveUninitialized: false
}))
// all of our routes will be prefixed with /api
app.use('/api', bodyParser.json(), router);   //[use json]
app.use('/api', bodyParser.urlencoded({ extended: false }), router);
let bears = [
    { 'id': 0, 'name': 'FANTA', 'price': 15, 'img': 'https://sc01.alicdn.com/kf/UTB8TOkMmVPJXKJkSahVq6xyzFXaR/Fanta-Peach.jpg_350x350.jpg' },
    { 'id': 1, 'name': 'COLA', 'price': 18, 'img': 'https://asiavape.co/wp-content/uploads/2014/04/1000x1000.jpg' },
    { 'id': 2, 'name': 'SODA', 'price': 12, 'img': 'https://img.freepik.com/free-vector/soda-can-aluminium-white_1308-32368.jpg?size=626&ext=jpg' },
    { 'id': 3, 'name': 'MIRINDA', 'price': 14, 'img': 'https://i2.wp.com/www.opusdandies.com/wp-content/uploads/2018/04/mirinda-orange_-330ml-can.jpg?fit=500%2C500&ssl=1' },
    { 'id': 4, 'name': 'EST', 'price': 16, 'img': 'https://www.promo.in.th/wp-content/uploads/2017/04/est_product_groupshot-512.jpg' },
    { 'id': 5, 'name': 'PEPSI', 'price': 17, 'img': 'https://i5.walmartimages.com/asr/68600fb3-d857-4a2d-9fe1-b635a82b27c2_1.55420b10672b613f15c1c96ae87bcdd3.jpeg' },
    { 'id': 6, 'name': 'TEA', 'price': 25, 'img': 'https://obs.line-scdn.net/0hfqcsfE-9OV5eChOK785GCXFVNy9taGABZ2h0PnJdZnImPHcKfmkmPSsWN2Z7PGIAZG0iOnkDbmwmb39aMjhzO3kMYCtyMipfNm5_Og/w960' },
    { 'id': 7, 'name': 'COFFEE', 'price': 25, 'img': 'https://img.kapook.com/u/2016/surauch/Health/coffee2.jpg' },
    { 'id': 8, 'name': 'COCOA', 'price': 25, 'img': 'https://fg.lnwfile.com/_/fg/_resize/300/300/zf/w6/xm.jpg' },
];

router.route('/bears')
    // get all bears
    .get((req, res) => res.json(bears))
    // insert a new bear
    .post((req, res) => {
        var bear = {};
        bear.id = bears.length > 0 ? bears[bears.length - 1].id + 1 : 0;
        bear.name = req.body.name
        bear.price = req.body.price
        bear.img = req.body.img
        bears.push(bear);
        res.json({ message: 'Bear created!' })
    })
router.route('/bears/:bear_id')
    .get((req, res) => {
        let id = req.params.bear_id
        let index = bears.findIndex(bear => (bear.id === +id))
        res.json(bears[index])                   // get a bear
    })
    .put((req, res) => {                               // Update a bear
        let id = req.params.bear_id
        let index = bears.findIndex(bear => (bear.id === +id))
        bears[index].name = req.body.name;
        bears[index].price = req.body.price;
        bears[index].img = req.body.img;
        res.json({ message: 'Bear updated!' + req.params.bear_id });
    })
    .delete((req, res) => {                   // Delete a bear
        // delete     bears[req.params.bear_id]
        let id = req.params.bear_id
        let index = bears.findIndex(bear => bear.id === +id)
        bears.splice(index, 1)
        res.json({ message: 'Bear deleted: ' + req.params.bear_id });
    })

/* face book*/
router.route('/auth')
    .get(authRoutes.index);
router.route('/auth/logout')
    .get(authRoutes.logout);
router.route('/auth/facebook')
    .get(fbRoutes.loginUrl);
router.route('/auth/facebook/login/callback')
    .get(fbRoutes.loginCallback);

/* PSU*/
router.route('/auth/psu')
    .post(psuRoutes.login);

app.use("*", (req, res) => res.status(404).send('404 Not found'));
app.listen(process.env.PORT, () => console.log(process.env.PORT));
// app.listen(80, () => console.log("Server is running"));