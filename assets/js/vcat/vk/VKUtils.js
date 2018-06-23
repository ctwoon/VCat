function pad(n){
    return n<10 ? '0'+n : n
}

function passVal(str) {
    if (!str) {
        console.error();
    }
    return str;
}

function getUserByID(user_id) {
    return new User(user_id);
}