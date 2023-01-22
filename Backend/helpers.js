
const keyIndexLookup = (keys, tag)=>{
    for(let i = 0;i<keys.length;i++){
        if(keys[i] == tag) return i;
    }
    return -1;
}

const newToArray = (arr, item)=>{
    arr.forEach(element=>{
        if(element.properties.ID == item.properties.ID) return false;
    })
    return true;
}
//Ova funkcija se koristi kako bi izvukli potrebne informacije iz recorda
//Saljemo tag kako bi odredili tip podataka
//I to se prosledjuje dalje

const cypherLookup = (records, tag, distinct = true)=>{    
    if(!records || records.length==0) return [];
    let arr = [];
    let i = keyIndexLookup(records[0].keys, tag);
    if(i == -1){
        console.error("TAG NOT FOUND");
    }
    records.forEach(record=>{
        let item = record._fields[i];
        if(!distinct){
            arr.push(item);
        }
        else if(newToArray(arr, item)){
            arr.push(item);
        }
    })
    return arr;    
}

module.exports = {  
    cypherLookup    
}