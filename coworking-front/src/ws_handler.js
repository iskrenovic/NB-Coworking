
var callback = null;

const registerCallback = (c)=>{
    callback = c;
}

const messageReceved = (msg) => {
    if(!callback) return;
    callback(msg);
}

export {registerCallback, messageReceved}