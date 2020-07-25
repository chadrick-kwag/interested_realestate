import React from 'react'

import { Form, Button } from 'react-bootstrap'
import "./loginpage.css"

import CreateUserBox from './CreateAccountBox'

class LoginPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: 'a',
            password: 'b',
            errmsg: null,
            displaymode: 'login'
        }

        this.onsubmit = this.onsubmit.bind(this)
        this.changeDisplayMode = this.changeDisplayMode.bind(this)


    }


    changeDisplayMode(v) {
        this.setState({
            displaymode: v
        })
    }


    onsubmit() {
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
            credentials: 'include',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(d => d.json())
            .then(d => {

                console.log(d)

                if (d.success) {
                    // update userinfo
                    this.props.update_user_profile(d.userdata.username)
                    return;
                }
                else {
                    this.setState({
                        password: "",
                        errmsg: "login failed"
                    })
                }

            })
            .catch(e => {
                console.log(e)

                this.setState({
                    errmsg: "login server fail"
                })
            })
    }

    render() {


        let center_display

        if (this.state.displaymode == "login") {
            center_display = <div className="loginbox">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>username</span>
                    <Form.Control value={this.state.username} onChange={e => this.setState({
                        username: e.target.value
                    })}></Form.Control>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>password</span>
                    <Form.Control type='password' value={this.state.password} onChange={e => this.setState({
                        password: e.target.value
                    })}></Form.Control>
                </div>
                <div className="button-group-area">
                    <Button onClick={e => this.onsubmit()}>login</Button>
                    <Button onClick={e => this.changeDisplayMode('create')}>계정생성</Button>
                </div>

            </div>

        }
        else if (this.state.displaymode == 'create') {
            center_display = <CreateUserBox displaymode={this.changeDisplayMode} />
        }


        return <div>
            <div className="background">
            </div>
            <div className="title-div noselect">
                <h1 className="title-h1">부동산 트래커</h1>
                
            </div>
            {center_display}

        </div>

    }
}


export default LoginPage