import React from 'react'

import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps';



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


export default RegisterNaverMap