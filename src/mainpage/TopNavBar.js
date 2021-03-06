import React from 'react'
import {withRouter} from 'react-router'
import {Button} from 'react-bootstrap'
import location_img from '../../public/location.png'
import list_img from '../../public/menu.png'

import './topnavbar.css'

class TopNavBar extends React.Component {



    render() {
        let change_icon_path = this.props.viewmode=="listview"? location_img : list_img
        return (
            
            <div style={{
                display: 'flex',
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: "row"
                }}>

                <Button onClick={e=>this.props.history.push('/register')}>매물추가</Button>
                <div style={{
                    
                    backgroundImage: "url(./"+change_icon_path+")",
                    backgroundSize: "100% 100%",
                    width: "30px",
                    height: "30px",
                    margin: "5px"
                }} 
                onClick={e=>this.props.toggleCallback()}
                />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <span className="username">{this.props.username}</span>
                    <Button onClick={e=>this.props.logout()}>로그아웃</Button>
                </div>


            </div>
        )

    }
}

export default withRouter(TopNavBar)