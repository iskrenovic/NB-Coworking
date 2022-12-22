module.exports = {
    
    RecordsToJSON : (records) =>{
        let item= []    
        records.forEach(element => {       
            
            item.push(element._fields[0].properties)
        })
        return item
    },

    NodeTOString : (node) =>{
       return JSON.stringify(Object.fromEntries(node._properties));
    },
    NodeToJson : (node) => { 
        return Object.fromEntries(node._properties);
    },
    sortStoresBy : (stores,sortFilter) => { 
        stores.sort((a,b) => {
              
               //#region OpisFje
                // a,b
                // > 0 sort b before a 
                // < 0 sort a before b
                // === 0 keep original order of a and b
                //    function compare(a, b) {
                //     if (a is less than b by some ordering criterion) {
                //       return -1;
                //     }
                //     if (a is greater than b by the ordering criterion) {
                //       return 1;
                //     }
                //     // a must be equal to b
                //     return 0;
                //   }
               //#endregion

            if (!a[sortFilter]) return -1;
            if (!b[sortFilter]) return 1;
            if (a[sortFilter] > b[sortFilter]) return  1
            if (a[sortFilter]< b[sortFilter]) return -1
            return 0
        })
        return stores;
    }
    
}