function test(str,num) {
    var s = str
    for(var i = 0;i < num;i++){
        str += s
    }
    return str
}

console.log(test('abc',6))