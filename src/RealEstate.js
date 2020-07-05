


const house_type = {
    BUY: "BUY",
    JEONSAE: "JEONSAE",
    CHUNGYAK: "CHUNGYAK"
}

class RealEstate{

    constructor(house_type, price, address, position, commute_time, area){
        this.house_type = house_type
        this.price = price
        this.address = address
        this.position = position
        this.commute_time = commute_time
        this.area = area
    }
}

export default RealEstate

export {house_type}