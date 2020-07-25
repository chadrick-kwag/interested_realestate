const express = require('express')
var session = require('express-session')

const axios = require('axios')
const cors = require('cors')

const app = express()
const port = 3000

const mongoose = require('mongoose')

const passport = require('passport')
var LocalStrategy = require('passport-local').Strategy



mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

let Schema = mongoose.Schema
let modelschema = new Schema({
    address: String,
    price: Number,
    area: Number,
    commute_time: Number,
    longitude: Number,
    latitude: Number,
    house_type: String,
    userid: String
})

let user_schema = new Schema({
    username: String,
    password: String
})

let RealEstate = mongoose.model('col1', modelschema)
let User = mongoose.model('users', user_schema)

let bodyparser = require('body-parser')
const { query } = require('express')

app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:8080'
}))
app.use(session({ secret: 'somekey' }))

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(passport.initialize())
app.use(passport.session())

var user_authenticate_mw = (req, res, next) => {
    if (req.user) {
        return next()
    }

    return res.status(500).send({ error: "user not authenticated" })

}


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'

}, function (username, password, done) {

    console.log('username: ' + username)


    console.log("inside localstrategy function")

    User.findOne({
        username: username
    }, (err, user) => {

        console.log('found user')
        console.log(user)
        if (err) {
            return done(err)
        }

        if (!user) {
            return done(null, false, { msg: "incorrect username" })
        }

        // validate password
        if (password !== user.password) {
            return done(null, false, { msg: "incorrect password" })
        }

        return done(null, user)
    })

}))

passport.serializeUser((user, done) => {
    console.log('serializer')
    console.log(user)
    done(null, user._id)
})

passport.deserializeUser((id, done) => {


    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            return done(err)
        }

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    })


})

app.get('/api/loggedin', (req, res) => {
    console.log('loggedin called')
    console.log(req.user)
    if (req.user) {
        return res.json({
            success: true,
            loggedin: true,
            userdata: req.user
        })

    }
    else {
        return res.json({
            success: false
        })
    }
})


app.post('/api/createaccount', (req, res) => {
    let data = req.body
    console.log('inside create account')
    console.log(data)

    // check if username is not duplicate

    User.findOne({
        username: data.username
    }, (err, user)=>{
        if (err) {
            return res.json({
                success: false,
                errtarget: null,
                msg: "db error finding duplicate user"
            })
        }

        if (user) {
            // username taken
            return res.json({
                success: false,
                errtarget: "username",
                msg: "username taken"
            })
        }
        else{
            // no user found
            let new_user = new User(data)

            new_user.save(e => {
                if (e) {
                    return res.json({
                        success: false,
                        errtarget: null,
                        msg: "failed to create user account in db"
                    })
                }

                return res.json({
                    success: true
                })
            })
        }
    })

})

app.get('/api/logout', user_authenticate_mw, (req, res) => {

    console.log('inside logout')
    req.logout()
    // res.redirect('/')

    return res.json({
        success: true
    })
})

app.post('/api/login', function (req, res, next) {

    console.log(req.body)

    passport.authenticate('local', function (err, user, info) {


        if (err) {
            console.log('error occured')
            return res.json({
                success: false,
                msg: 'err'
            })
        }

        if (user) {
            let userjson = JSON.stringify(user)

            req.logIn(user, function (err) {
                if (err) {
                    return next(err)
                }
                return res.json({
                    success: true,
                    userdata: user
                })
            })
        }
        else {
            console.log('login fail')
            res.json({
                success: false,
                msg: 'login fail'
            })
        }
    })(req, res, next)
})

app.post('/api/realestate/create', user_authenticate_mw, (req, res) => {
    let data = req.body

    console.log(data)

    let update_data = data
    update_data['userid'] = req.user._id

    console.log(update_data)

    let new_instance = new RealEstate(update_data)

    console.log(new_instance)

    new_instance.save(e => {
        if (e) {
            console.log('error creating instance')
            res.json({
                success: false
            })
            return
        }

        console.log("success creating new instance")
        res.json({
            success: true
        })


    })


})



app.get('/api/realestate/fetch', user_authenticate_mw, (req, res) => {

    let userid = req.user._id
    RealEstate.find({ userid: userid }, (err, results) => {
        if (err) {
            res.json({
                success: false
            })
            return
        }

        res.json({
            success: true,
            data: results
        })

    })
})

app.post('/api/realestate/delete', (req, res) => {

    let query_id = req.body.id
    console.log("query_id: " + query_id)

    if (query_id == null) {
        res.json({
            success: false,
            msg: "query id is null"
        })
        return
    }

    RealEstate.findByIdAndRemove(query_id, (err) => {
        console.log(err)
        if (err) {
            console.log('error occured in removing')
            res.json({
                success: false
            })

            return
        }

        console.log("success in removing")
        res.json({
            success: true
        })
        return
    })

    // model.find({
    //     "_id": query_id
    // }, (err, results)=>{
    //     if(err){
    //         console.log(err)
    //         res.json({
    //             success: false,
    //             msg: "error while fetching from db"
    //         })
    //         return
    //     }

    //     console.log(results)

    //     if(results.length<1){
    //         res.json({
    //             success: false,
    //             msg: "no results found"
    //         })
    //         return
    //     }

    //     if(results.length >2){
    //         res.json({
    //             success: false,
    //             msg: "multiple results found."
    //         })
    //         return
    //     }

    //     let result = results[0]


    // })
})

app.post('/api/geo', (req, res) => {
    let data = req.body
    console.log(data)



    let address = data.address

    if (address == null) {
        res.json({
            success: false,
            msg: 'address is null'
        })
        return
    }

    let url = encodeURI('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=' + address)

    console.log(url)

    axios.get(url, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": "bz0k7065a0",
            "X-NCP-APIGW-API-KEY": "hh75tiXOGrIdpc7FQZIN7woY5j7w0SrbkDcqPWZm"
        }
    })
        .then(r => {
            let d = r.data
            // console.log(d)
            if (d.addresses.length == 0) {
                console.log("no result received")

                res.json({
                    success: false,
                    msg: 'no result fetchted from geo'
                })
                return
            }

            let location_longitude = d.addresses[0].x
            let location_latitude = d.addresses[0].y

            console.log(location_latitude)
            console.log(location_longitude)

            res.json({
                success: true,
                latitude: location_latitude,
                longitude: location_longitude
            })
            return
        })
        .catch(e => {
            console.log(e)

            res.json({
                success: false,
                msg: 'error when requesting to geo'
            })
        }
        )

})


app.post('/api/reversegeo', (req, res) => {
    let data = req.body

    console.log('inside reversegeo')
    console.log(data)

    let _coords = data.coords

    if (_coords == null) {
        res.json({
            success: false,
            msg: 'coords is null'
        })
        return
    }

    let sendjson = {
        coords: _coords,
        output: 'json',
        orders: 'roadaddr'
    }

    const reverse_geo_url = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc'

    let url = reverse_geo_url + "?coords=" + _coords + "&output=json&orders=roadaddr"

    console.log(url)

    axios.get(url, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": "bz0k7065a0",
            "X-NCP-APIGW-API-KEY": "hh75tiXOGrIdpc7FQZIN7woY5j7w0SrbkDcqPWZm"
        }
    }).then(d => {

        console.log("received")
        // console.log(d)
        console.log(d.data)

        if (d.data.status.name !== "ok") {
            res.json({
                success: false,
                msg: "naver response status not ok"
            })


            return
        }

        console.log(d.data.status.name)

        let results = d.data.results

        if (results.length == 0) {
            res.json({
                success: false,
                msg: 'no results received'
            })
            return
        }


        let result = results[0]

        console.log(result)

        let roadaddr = ""

        let roadaddr_items = [
            result.region.area1.name,
            result.region.area2.name,
            result.region.area3.name,
            result.region.area4.name,
            result.land.number1,
            result.land.number2
        ]

        roadaddr_items.forEach(d => {
            if (d !== "") {
                roadaddr += d + " "
            }
        })

        roadaddr = roadaddr.trim()

        console.log('reconstructed roadaddr: ' + roadaddr)

        res.json({
            success: true,
            "roadaddr": roadaddr
        })

        return


    }).catch(e =>
    // console.log(e))
    {
        console.log("error")
        res.json({
            success: false,
            msg: 'error on post'
        })
        return
    })

})

app.listen(port)

console.log("listening...")