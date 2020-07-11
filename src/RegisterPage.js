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
            zoomlevel: 13,
            longitude: this.props.longitude == null ? default_longitutde : this.props.longitude,
            latitude: this.props.latitude == null ? default_latitude : this.props.latitude
        }
    }

    

    render() {

        const navermaps = window.naver.maps

        console.log('rendering subnavermap')

        return <NaverMap
            mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
            style={{
                width: '100%', // 네이버지도 가로 길이
                height: '85vh' // 네이버지도 세로 길이
            }}
            center={{ lat: this.props.latitude == null ? default_latitude : this.props.latitude, lng: this.props.longitude == null ? default_longitutde : this.props.longitude }} // 지도 초기 위치
            
            defaultZoom={this.state.zoomlevel} // 지도 초기 확대 배율
        >

            {
                (this.props.latitude!=null && this.props.longitude !=null )? <Marker
                key={1}
                position={new navermaps.LatLng(this.props.latitude, this.props.longitude)}
                onClick={
                    () => alert('this is seoul tower')
                }
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

    shouldComponentUpdate(nextprops, nextstate){
        if(this.props.longitude == nextprops.longitude && this.props.latitude == nextprops.latitude){
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
            <SubNaverMap longitude={this.props.longitude} latitude={this.props.latitude} />
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
            latitude: null
        }


        this.attempt_address_search = this.attempt_address_search.bind(this)
        this.get_location_from_address = this.get_location_from_address.bind(this)

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


    render() {
        return (

            <div>


                <span>address</span>
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

                <RegisterNaverMap longitude={this.state.longitude} latitude={this.state.latitude}></RegisterNaverMap>


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