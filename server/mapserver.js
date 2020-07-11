const express = require('express')

const axios = require('axios')
const cors = require('cors')

const app = express()
const port = 3000

let bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(cors())

app.post('/api/geo', (req,res)=>{
    let data = req.body
    console.log(data)
    


    let address = data.address

    if(address==null){
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
            .catch(e=>{
                console.log(e)

                res.json({
                    success: false,
                    msg: 'error when requesting to geo'
                })
            }
            )

    

    // res.json({
    //     success: true,
    //     msg: "hello"
    // })
})

app.listen(port)

console.log("listening...")