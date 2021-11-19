export default (number) => {
    let type = typeof number;
    if(type === 'number') {
        return number;
    }
    else if(type === 'string') {
        if(number === '') {
            return 0;
        }
        else {
            return  parseInt('0' + number.replace(/۰/g, '0').replace(/۱/g, '1')
                .replace(/۲/g, '2').replace(/۳/g, '3').replace(/۴/g, '4')
                .replace(/۵/g, '5').replace(/۶/g, '6').replace(/۷/g, '7')
                .replace(/۸/g, '8').replace(/۹/g, '9').replace(/\D/g, ''),
                10
            );
        }
    }
}