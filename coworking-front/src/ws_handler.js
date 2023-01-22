
var callback = null;

const registerCallback = (c)=>{
    callback = c;
}

const messageReceved = (msg) => {
    if(!callback){
        console.log(msg);
        return;
    }
    callback(JSON.parse(msg));
}

export {registerCallback, messageReceved}