var array = [1,2,3,6,1,3];

for(var i = 0; i<array.length;i++){
    if(array.indexOf(5) == -1){
        console.log('不存在')
        return
    }else{
        console.log('存在')
        return
    }
}