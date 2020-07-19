import React from 'react'
import { withRouter } from 'react-router'
import { Button } from 'react-bootstrap'


class DetailViewPage extends React.Component {


    render() {

        if (this.props.data == null) {
            return <div>invalid view id</div>
        }

        return <div>

            <div>
                <div>
                    <span>주소:</span> <span>{this.props.data.address}</span>
                </div>

                <div>
                    <span>가격:</span> <span>{this.props.data.price}</span>
                </div>


            </div>

            <div>
                <Button onClick={e => {
                    this.props.history.push('/')
                }}>이전으로</Button>
            </div>
        </div>
    }
}


export default withRouter(DetailViewPage)