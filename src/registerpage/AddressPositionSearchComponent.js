import React from 'react'

import RegisterNaverMap from './AddressSearchNaverMap.js'
import { Button, Form } from 'react-bootstrap'


const reverse_geo_base_url = "http://localhost:3000/api/reversegeo"
const geo_url = 'http://localhost:3000/api/geo'


class AddressPositionSearch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // address: this.props.address,
            position: this.props.position,
            address_search_results: [],
            // selected_search_address: null,
            longitude: null,
            latitude: null,
            show_search_by_address_area: false,
            map_center_lat: null,
            map_center_lng: null,
            custom_marker_lat: null,
            custom_marker_lng: null

        }


        this.attempt_address_search = this.attempt_address_search.bind(this)
        this.get_location_from_address = this.get_location_from_address.bind(this)
        this.custom_marker_rightclick_callback = this.custom_marker_rightclick_callback.bind(this)

    }

    attempt_address_search() {
        if (this.props.address === null || this.props.address == "") {
            return
        }

        let fetch_url = 'http://www.juso.go.kr/addrlink/addrLinkApi.do' + '?confmKey=' + "devU01TX0FVVEgyMDIwMDcwNjAxMzIyMTEwOTkyNzI=" + "&currentPage=1&countPerPage=10&keyword=" + this.props.address + "&resultType=json"


        fetch(fetch_url).then(d => d.json())
            .then(d => {
                console.log(d)

                let new_search_list = []

                if(d.results.errorMessage){
                    console.log(d.results.errorMessage)
                    return
                }

                d.results.juso.map(i => new_search_list.push(i.roadAddr))

                this.setState({ address_search_results: new_search_list })
            })
            .catch(e=>console.log(e))
    }


    get_location_from_address(new_address) {

        if (new_address == null) {
            console.log('address is null')
            return
        }

        console.log(new_address)

        let sendjson = JSON.stringify({
            address: new_address
        })

        console.log(sendjson)

        fetch(geo_url, {
            method: 'POST',
            body: sendjson,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(d => d.json())
            .then(d => {

                console.log(d)


                let location_longitude = d.longitude
                let location_latitude = d.latitude

                console.log("location_longitude: " + location_longitude + ", location_latitude=" + location_latitude)


                this.setState({
                    longitude: location_longitude,
                    latitude: location_latitude,
                    map_center_lat: location_latitude,
                    map_center_lng: location_longitude
                })

                this.props.updateAddress(new_address, location_latitude, location_longitude)


            })

    }

    custom_marker_rightclick_callback(lat, lng){

        console.log("custom_marker_rightclick_callback triggered")

        // fetch address of custom location

        let sendjson = {
            coords : lng+","+ lat
        }

        console.log(sendjson)

        fetch(reverse_geo_base_url,{
            method: 'POST',
            body: JSON.stringify(sendjson),
            headers:{
                "Content-Type": "application/json"
            }
        }).then(d=>d.json())
        .then(d=>{
            if(!d.success){
                console.log('fetch fail msg=' + d.msg)
                return
            }

            let roadaddr = d.roadaddr

            this.setState({
                map_center_lat: lat,
                map_center_lng: lng,
                custom_marker_lat: lat,
                custom_marker_lng: lng
                // selected_search_address: roadaddr
    
            })

            this.props.updateAddress(roadaddr, lat, lng)


        })
        .catch(e=>{
            console.log(e)

        })


        
    }


    render() {
        return (

            <div>


                <span>address</span>
                <input type="text" style={{ width: "70%" }} value={this.props.address} disabled />
                <Button onClick={e => this.setState({
                    show_search_by_address_area: true
                })}>주소검색</Button>

                {
                    this.state.show_search_by_address_area ?
                        <div>
                            <span>검색주소</span>
                            <input type="text" value={this.props.address} onChange={e=>this.props.updateAddress(e.target.value)}></input>
                            <button onClick={e => this.attempt_address_search()}>search</button>

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                {this.state.address_search_results.length == 0 ? <span>no results</span> :
                                    <table>
                                        {this.state.address_search_results.map(d => <tr onClick={e => {

                                            this.get_location_from_address(d)
                                        }

                                        }>{d}</tr>)}
                                    </table>}


                            </div>
                        </div> : null
                }


                <RegisterNaverMap longitude={this.state.longitude} latitude={this.state.latitude} map_center_lat={this.state.map_center_lat} map_center_lng={this.state.map_center_lng} updateCustomMarkerCallback={this.custom_marker_rightclick_callback}
                custom_marker_lng={this.state.custom_marker_lng}
                custom_marker_lat = {this.state.custom_marker_lat}
                ></RegisterNaverMap>


            </div>
        )
    }
}

export default AddressPositionSearch
