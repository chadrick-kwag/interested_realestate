import React from 'react'
import ReactDOM from 'react-dom'



import RealEstate, { house_type } from './RealEstate'


import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './loginpage/LoginPage'

import MainPage from './mainpage/MainPage'





class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: null
            
        }

        
        this.updateUserProfile = this.updateUserProfile.bind(this)
        this.checkloginstatus = this.checkloginstatus.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {

        this.checkloginstatus()
    }

    logout(){
        fetch('http://localhost:3000/api/logout', {
            withCredentials: true,
            credentials: 'include'
        }).then(d=>d.json())
        .then(d=>{
            console.log(d)
            if(d.success){
                this.setState({
                    username: null
                })
                return
            }

            console.log('logout failed')
        })
        .catch(e=>{
            console.log('error logout call')
        })
    }

    
    checkloginstatus(){
        fetch('http://localhost:3000/api/loggedin', {
            withCredentials: true,
            credentials: 'include',
        }).then(d=>d.json())
        .then(d=>{

            console.log('check login status result')
            console.log(d)
            if(d.loggedin){
                this.setState({
                    username: d.userdata.username
                })
            }
            else{
                console.log('not logged in confirmed')
            }
        })
        .catch(e=>console.log(e))
    }



    updateUserProfile(up){
        this.setState({
            username: up
        })
    }

    render() {


        if(this.state.username!=null){
            return (

                <MainPage logout={this.logout}/>
            
    
            )
        }
        else{
            return <LoginPage update_user_profile={this.updateUserProfile}/>
        }
       
    }
}

ReactDOM.render(<App />, document.getElementById("app")) 