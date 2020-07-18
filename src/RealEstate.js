


const house_type = {
    BUY: "BUY",
    JEONSAE: "JEONSAE",
    CHUNGYAK: "CHUNGYAK"
}

const house_type_kor_text = {
    "BUY": "매매",
    "JEONSAE": "전세",
    "CHUNGYAK": "청약"
}

class RealEstate{

    constructor(house_type, price, address, latitude, longitude, commute_time, area){
        this.house_type = house_type
        this.price = price
        this.address = address
        this.latitude = latitude,
        this.longitude = longitude,
        this.commute_time = commute_time
        this.area = area
    }
}

export default RealEstate

export {house_type, house_type_kor_text}