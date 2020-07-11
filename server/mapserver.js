const express = require('express')

const axios = require('axios')
const cors = require('cors')

const app = express()
const port = 3000

let bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors())

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



    // res.json({
    //     success: true,
    //     msg: "hello"
    // })
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