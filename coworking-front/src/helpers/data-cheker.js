
const validateObjects = (...args)=>{
    for(let i = 0;i<args.length;i++){
        if(!validateArgument(args[i])){
            console.error('INVALID INPUT');
            return false;
        }
    }
    return true;
}

const validateArgument = (arg)=>{
    switch(typeof arg){
        case'string':
            return arg!='';
        case 'number': case 'bigint':
            return arg>0;        
    }
    return !!arg;
}

export {
    validateObjects
}