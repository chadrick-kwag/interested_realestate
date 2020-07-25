import React from 'react'
import {Form, Button} from 'react-bootstrap'

import './loginpage.css'

class CreateUserBox extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            username: "",
            password: "",
            re_password: "",
            username_fb : null,
            password_fb : null,
            re_password_fb : null

        }

        this.createAccount = this.createAccount.bind(this)
        this.validate_entries = this.validate_entries.bind(this)
    }


    validate_username(username){
        if(username.length <4){
            return "username length too short"
        }

        return null
    }

    validate_password(passwd){
        if(passwd.length < 8){
            return "password length too short"
        }

        return null
    }

    validate_re_password(passwd, repasswd){
        if(passwd!==repasswd){
            return "not match"
        }

        return null
    }

    validate_entries(){
        let res;
        if(this.validate_username(this.state.username)!=null){
            return false
        }

        if(this.validate_password(this.state.password)!=null){
            return false
        }

        if(this.validate_re_password(this.state.password, this.state.re_password)!=null){
            return false
        }

        return true
    }
    


    createAccount(){

        let sendjson = {
            username: this.state.username,
            password: this.state.password
        }

        fetch('http://localhost:3000/api/createaccount', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendjson)

        }).then(d=>d.json())
        .then(d=>{

            console.log('received data')
            console.log(d)
            let data = d

            console.log(data)

            if(data.success){
                // change to login box
                return this.props.displaymode('login')
            }

            // failed
            // if failed due to username taken, handle it

            if(data.errtarget == "username"){
                console.log("setting username_fb " + data.msg)
                return this.setState({
                    username_fb: data.msg
                })
            }

            alert("failed to create user due to server problems")

            console.log('failed create confirmation from server')
        })
        .catch(e=>{
            console.log('err sending create account fetch')
        })
    }


    render(){

        let enable_submit_button = this.validate_entries()

        console.log(enable_submit_button)

        return <div className="loginbox">
            <div>
                <span>username</span>
                <Form.Control value={this.state.username} onChange={e=>this.setState({
                    username: e.target.value
                })}></Form.Control>
                {this.state.username_fb!=null? <span className="fb-danger">{this.state.username_fb}</span> : null}
            </div>
            <div>
                <span>password</span>
                <Form.Control type="password" value={this.state.password} onChange={e=>this.setState({
                    password: e.target.value})} />
            </div>
            <div>
                <span> re-enter password</span>
                <Form.Control type="password" value={this.state.re_password} onChange={e=> this.setState({
                    re_password: e.target.value
                })} />
            </div>

            <div className="button-group-area">
                <Button onClick={e=>this.props.displaymode('login')}>취소</Button>
                <Button disabled={!enable_submit_button} onClick={e=>this.createAccount()}>생성</Button>
            </div>
        </div>
    }
}


export default CreateUserBox