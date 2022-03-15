module.exports = {
    makeid,
}

function makeid(length) {
    var result='';
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlength = charaters.length;

    for (var i = 0; i< length; i++)
    {
        result+= charaters.charAt(Math.floor(Math.random()* charlength));
    }

    return result;
}