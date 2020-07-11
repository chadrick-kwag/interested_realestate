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
                // {
                //     address: "서울 강남구",
                //     price: 90000000,
                //     area: 98,
                //     commute_time: 40

                // }
                new RealEstate(house_type.BUY, 90000000, "서울 강남구", null, 40, 98)
            ]
        }

        this.submitData = this.submitData.bind(this)
        this.toggleViewMode = this.toggleViewMode.bind(this)
    }


    submitData(newdata){

        console.log('received new data: ', newdata)

        let new_data_list = this.state.data
        new_data_list.push(newdata)
        this.setState({
            data: new_data_list
        })

        console.log('after registering, data')
        console.log(this.state.data)

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
                    <TopNavBar toggleCallback={this.toggleViewMode}/>
                    <Switch>
                        <Route path='/register'>
                            <RegisterPage submitCallback={this.submitData}/>
                        </Route>
                        <Route path='/'>


                            {this.state.viewmode == "listview" ? <ListView data={this.state.data} /> : null}
                            {this.state.viewmode == "mapview" ? <MapView data={this.state.data} /> : null}
                        </Route>

                    </Switch>



                </div>
            </BrowserRouter>

        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))