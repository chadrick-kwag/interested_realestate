import React from 'react'
import ReactDOM from 'react-dom'

import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps';
import ListView from './ListView'
import TopNavBar from './TopNavBar'
import MapView from './MapView'
import RegisterPage from './registerpage/RegisterPage'

import RealEstate, {house_type} from './RealEstate'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';





class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            viewmode: "listview",
            data: [
                new RealEstate(house_type.BUY, 90000000, "서울 강남구", 37.5532931,126.9779355, 40, 98),
                new RealEstate(house_type.CHUNGYAK, 80000000, "서울 캉남구", 37.4958917,127.0355279, 30, 58)
            ]
        }

        this.submitData = this.submitData.bind(this)
        this.toggleViewMode = this.toggleViewMode.bind(this)
        this.sort_data_by_key = this.sort_data_by_key.bind(this)
        this.fetch_data = this.fetch_data.bind(this)
    }

    componentDidMount(){
        this.fetch_data()
    }


    fetch_data(){
        fetch('http://localhost:3000/api/realestate/fetch').then(d=>d.json())
        .then(d=>{
            console.log(d)

            if(!d.success){
                console.log("not success in fetching data")
                this.setState({
                    data: []
                })
                return
            }

            let re_arr = []

            d.data.map(i=>{
                let re = new RealEstate(i.house_type, i.price, i.address, i.latitude, i.longitude, i.area, i.commute_time)
                re_arr.push(re)
            })

            console.log("re_arr")
            console.log(re_arr)

            this.setState({
                data: re_arr
            })


        })
    }

    sort_data_by_key(key, is_ascending){

        let data_list = this.state.data


        data_list.sort((a,b)=>{
            if(a[key] < b[key]){
                return is_ascending? -1: 1;
            }
            else{
                return is_ascending? 1:-1;
            }
        })


        this.setState({
            data: data_list
        })
    }


    submitData(newdata){


        let new_data_list = this.state.data
        new_data_list.push(newdata)
        this.setState({
            data: new_data_list
        })


        return true
    }

    toggleViewMode() {
        if (this.state.viewmode == "listview") {
            this.setState({
                viewmode: "mapview"
            })
        }
        else if (this.state.viewmode == "mapview") {
            this.setState({
                viewmode: "listview"
            })
        }
        else {
            console.log("invalid viewmode")
        }
    }

    render() {

        return (
            <BrowserRouter>
                <div>
                    <TopNavBar viewmode={this.state.viewmode} toggleCallback={this.toggleViewMode}/>
                    <Switch>
                        <Route path='/register'>
                            <RegisterPage submitCallback={this.fetch_data}/>
                        </Route>
                        <Route path='/'>


                            {this.state.viewmode == "listview" ? <ListView data={this.state.data} sort_by_key={this.sort_data_by_key}/> : null}
                            {this.state.viewmode == "mapview" ? <MapView data={this.state.data} /> : null}
                        </Route>

                    </Switch>



                </div>
            </BrowserRouter>

        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))