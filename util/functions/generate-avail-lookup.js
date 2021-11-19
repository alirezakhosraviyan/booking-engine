export default (bookingAvail) => {
    try {
        let { rate_plans, room_types, room_rates, id } = bookingAvail.data.hotel;
        let roomDict = {};
        for (let i of room_types) {
            roomDict[i.id] = {
                info: i,
                rates: {},
            };
        }
        for (let i of room_rates) {
            roomDict[i.room_type_id].rates[i.rate_plan_id] = i;
        }
        return {
            roomDict,
            ratePlans: rate_plans,
            hotelId: id
        }
    } catch (e) {}
}