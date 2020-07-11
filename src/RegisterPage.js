import React from 'react'
import { withRouter } from 'react-router'

import './RegisterPage.css'

import RealEstate, { house_type } from './RealEstate'

import { Button, Form } from 'react-bootstrap'

import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps';


const geo_url = 'http://localhost:3000/api/geo'
const default_longitutde = 126.970833
const default_latitude = 37.554722

class SubNaverMap extends React.Component {

    constructor(props) {
        super(props)


        this.state = {
            zoomlevel: 15,
            longitude: this.props.longitude == null ? default_longitutde : this.props.longitude,
            latitude: this.props.latitude == null ? default_latitude : this.props.latitude,


        }

        this.rightclick_callback = this.rightclick_callback.bind(this)
    }

    rightclick_callback(e) {
        console.log(e)


        let lat = e.latlng._lat
        let lng = e.latlng._lng


        this.props.updateCustomMarkerCallback(lat, lng)

    }



    render() {

        const navermaps = window.naver.maps

        console.log('rendering subnavermap')

        console.log(this.props)

        return <NaverMap
            mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
            style={{
                width: '50%', // 네이버지도 가로 길이
                height: '30vh' // 네이버지도 세로 길이
            }}
            center={{ lat: this.props.map_center_lat == null ? default_latitude : this.props.map_center_lat, lng: this.props.map_center_lng == null ? default_longitutde : this.props.map_center_lng }} // 지도 초기 위치

            onRightclick={e => this.rightclick_callback(e)}

            defaultZoom={this.state.zoomlevel} // 지도 초기 확대 배율
        >

            {
                (this.props.latitude != null && this.props.longitude != null) ?
                    <Marker
                        key={1}
                        position={new navermaps.LatLng(this.props.latitude, this.props.longitude)}
                        onClick={
                            () => alert('this is seoul tower')
                        }
                    /> : null
            }

            {
                (this.props.custom_marker_lat!=null & this.props.custom_marker_lng!=null) ?
                <Marker
                key="2"
                position={new navermaps.LatLng(this.props.custom_marker_lat, this.props.custom_marker_lng)}

                /> : null
            }

        </NaverMap>
    }
}


class RegisterNaverMap extends React.Component {

    constructor(props) {
        super(props)


        this.state = {

            longitude: this.props.longitude,
            latitude: this.props.latitude
        }

    }

    shouldComponentUpdate(nextprops, nextstate) {
        if (this.props.longitude == nextprops.longitude && this.props.latitude == nextprops.latitude
            && this.props.map_center_lat == nextprops.map_center_lat
            && this.props.map_center_lng == nextprops.map_center_lng
            && this.props.custom_marker_lat == nextprops.custom_marker_lat
            && this.props.custom_marker_lng == nextprops.custom_marker_lng
            && this.props.updateCustomMarkerCallback == nextprops.updateCustomMarkerCallback) {
            return false
        }

        return true
    }


    render() {

        console.log('rendering navermaps')

        return <RenderAfterNavermapsLoaded
            ncpClientId={'bz0k7065a0'} // 자신의 네이버 계정에서 발급받은 Client ID
            error={<p>Maps Load Error</p>}
            loading={<p>Maps Loading...</p>}
        >
            <SubNaverMap {...this.props}/>
        </RenderAfterNavermapsLoaded>
    }
}



class AddressPositionSearch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            address: this.props.address,
            position: this.props.position,
            address_search_results: [],
            selected_search_address: null,
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
        if (this.state.address === null || this.state.address == "") {
            return
        }

        let fetch_url = 'http://www.juso.go.kr/addrlink/addrLinkApi.do' + '?confmKey=' + "devU01TX0FVVEgyMDIwMDcwNjAxMzIyMTEwOTkyNzI=" + "&currentPage=1&countPerPage=10&keyword=" + this.state.address + "&resultType=json"


        fetch(fetch_url).then(d => d.json())
            .then(d => {
                console.log(d)

                let new_search_list = []

                d.results.juso.map(i => new_search_list.push(i.roadAddr))

                this.setState({ address_search_results: new_search_list })
            })
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
                    selected_search_address: new_address,
                    longitude: location_longitude,
                    latitude: location_latitude
                })


            })

    }

    custom_marker_rightclick_callback(lat, lng){

        console.log("custom_marker_rightclick_callback triggered")

        this.setState({
            map_center_lat: lat,
            map_center_lng: lng,
            custom_marker_lat: lat,
            custom_marker_lng: lng

        })
    }


    render() {
        return (

            <div>


                <span>address</span>
                <input type="text" style={{ width: "70%" }} value={this.state.selected_search_address} disabled />
                <Button onClick={e => this.setState({
                    show_search_by_address_area: true
                })}>주소검색</Button>

                {
                    this.state.show_search_by_address_area ?
                        <div>
                            <span>검색주소</span>
                            <input type="text" value={this.state.address} onChange={e => this.setState({ address: e.target.value })}></input>
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


class RegisterPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            _house_type: null,
            address: "",
            price: "",
            area: "",
            commute_time: "",
            position: null
        }

        this.trysubmit = this.trysubmit.bind(this)
    }


    trysubmit() {


        // verify if all inputs are filled in properly



        let rs = new RealEstate(this.state._house_type, this.state.price, this.state.address, this.state.position, this.state.commute_time, this.state.area)


        let result = this.props.submitCallback(rs)

        if (result) {
            this.props.history.push('/')
        }
        else {
            alert("error registering")
        }
    }

    render() {

        return (
            <div>

                <div>
                    <span>house type</span>
                    <div>
                        <Button variant={this.state._house_type == house_type.BUY ? "warning" : "light"} onClick={e => this.setState({
                            _house_type: house_type.BUY
                        })}>매매</Button>
                        <Button variant={this.state._house_type == house_type.JEONSAE ? "warning" : "light"} onClick={e => this.setState({ _house_type: house_type.JEONSAE })}>전세</Button>
                        <Button variant={this.state._house_type == house_type.CHUNGYAK ? "warning" : "light"} onClick={e => this.setState({ _house_type: house_type.CHUNGYAK })}>청약</Button>
                    </div>
                </div>
                <AddressPositionSearch />
                <div>
                    <span>price</span>
                    <input type="number" value={this.state.price} onChange={e => this.setState({ price: e.target.value })}></input>
                </div>
                <div>
                    <span>area</span>
                    <input type="number" value={this.state.area} onChange={e => this.setState({ area: e.target.value })}></input>
                </div>
                <div>
                    <span>commute time</span>
                    <input type="number" value={this.state.commute_time} onChange={e => this.setState({ commute_time: e.target.value })}></input>
                </div>

                <div>
                    <button onClick={e => this.trysubmit()}>submit</button>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterPage)