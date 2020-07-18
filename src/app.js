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
                new RealEstate(house_type.BUY, 90000000, "서울 강남구", 0,0, 40, 98),
                new RealEstate(house_type.CHUNGYAK, 80000000, "서울 캉남구", 0,0, 30, 58)
            ]
        }

        this.submitData = this.submitData.bind(this)
        this.toggleViewMode = this.toggleViewMode.bind(this)
        this.sort_data_by_key = this.sort_data_by_key.bind(this)
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
                            <RegisterPage submitCallback={this.submitData}/>
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