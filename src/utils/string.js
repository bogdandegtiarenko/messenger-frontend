export function removeSubstring(inputString, substringToRemove) {
    return inputString.replace(new RegExp(substringToRemove, 'g'), '');
}

export function isNullOrEmptyOrUndefined(str){
    return str === '' || str === null || str === undefined;
}

export function getLastMessageContactBlockDate(date){
    const now = new Date();
    if(
        now.getFullYear() == date.getFullYear() && 
        now.getMonth() == date.getMonth() &&
        now.getDate() - date.getDate() <= 1
    ){
        if(now.getDate() == date.getDate()){
            return addZeroToNumber(date.getHours())  + ':' +  addZeroToNumber(date.getMinutes());
        }
        else{
            return 'Вчера';
        }
    }
    else{
        return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    }

    return date.toString();
}

function addZeroToNumber(num){
    if(num >= 0 && num <= 9){
        return '0' + num;
    };
    return num;
}