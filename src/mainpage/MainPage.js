import React from 'react'

import ListView from '../ListView'
import TopNavBar from '../TopNavBar'
import MapView from '../MapView'
import RegisterPage from '../registerpage/RegisterPage'
import DetailViewPage from '../detaeilviewpage/DetailViewPage'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import RealEstate, { house_type } from '../RealEstate'


class MainPage extends React.Component{

    constructor(props){
        super(props)

        this.state={
            viewmode: "listview",
            data: [],
            detailview_id: null
        }

        this.remove_data = this.remove_data.bind(this)
        this.submitData = this.submitData.bind(this)
        this.toggleViewMode = this.toggleViewMode.bind(this)
        this.sort_data_by_key = this.sort_data_by_key.bind(this)
        this.fetch_data = this.fetch_data.bind(this)
    }

    componentDidMount(){
        this.fetch_data()
    }


    
    remove_data(id, remove_from_data_flag, callback) {

        console.log('remove data triggered. id=' + id)
        fetch("http://localhost:3000/api/realestate/delete", {
            method: 'POST',
            body: JSON.stringify({
                "id": id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(d => d.json())
            .then(d => {
                console.log(d)

                if (!d.success) {
                    console.log('failed to remove re item from db')
                    return
                }

                console.log('success removing re item from db')
                if(remove_from_data_flag){
                    let new_data=[]

                    this.state.data.forEach(d=>{
                        if(d.id!==id){
                            new_data.push(d)
                        }
                    })

                    this.setState({
                        data: new_data
                    })
                }

                if (callback) callback()
            })
            .catch(e => {
                console.log('error while fetching for delete')
                console.log(e)
            })
    }

    
    fetch_data() {
        fetch('http://localhost:3000/api/realestate/fetch').then(d => d.json())
            .then(d => {
                console.log(d)

                if (!d.success) {
                    console.log("not success in fetching data")
                    this.setState({
                        data: []
                    })
                    return
                }

                let re_arr = []

                d.data.map(i => {
                    let re = new RealEstate(i._id, i.house_type, i.price, i.address, i.latitude, i.longitude, i.area, i.commute_time)
                    re_arr.push(re)
                })

                console.log("re_arr")
                console.log(re_arr)

                this.setState({
                    data: re_arr
                })


            })
    }

    
    sort_data_by_key(key, is_ascending) {

        let data_list = this.state.data


        data_list.sort((a, b) => {
            if (a[key] < b[key]) {
                return is_ascending ? -1 : 1;
            }
            else {
                return is_ascending ? 1 : -1;
            }
        })


        this.setState({
            data: data_list
        })
    }


    submitData(newdata) {


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

    render(){


        let redetail_data = null
        if (this.state.detailview_id == null) {
            redetail_data = null
        }
        else {
            for (let i = 0; i < this.state.data.length; i++) {
                if (this.state.data[i].id == this.state.detailview_id) {
                    redetail_data = this.state.data[i]
                    break
                }
            }

        }


        return <BrowserRouter>
        <div>
            <TopNavBar viewmode={this.state.viewmode} toggleCallback={this.toggleViewMode} />
            <Switch>
                <Route path='/register'>
                    <RegisterPage submitCallback={this.fetch_data} />
                </Route>
                <Route path='/redetail'>
                    <DetailViewPage data={redetail_data} />
                </Route>
                <Route exact path='/'>


                    {this.state.viewmode == "listview" ? <ListView data={this.state.data} sort_by_key={this.sort_data_by_key}
                        setDetailViewId={(id) => {
                            console.log('set detail view id prop fn')
                            this.setState({
                                detailview_id: id
                            })
                        }}

                        remove_re_item = {this.remove_data}
                    /> : null}
                    {this.state.viewmode == "mapview" ? <MapView data={this.state.data} /> : null}
                </Route>
                <Route>
                    <div>invalid url</div>
                </Route>

            </Switch>



        </div>
    </BrowserRouter>

    }
}


export default MainPage