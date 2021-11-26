/**
 * 获取滚动条的高度
 * @param {*} element  获取的到DOM元素
 * @returns 返回滚动条的总高度
 */

function getScrollBottom(element) {
    //判断是否出现滚动条
    if(element.scrollHeight > element.clientHeight){
        console.log('show滚动条')
        //返回滚动条的总高度
        return element.scrollHeight
    }
    
}

export {getScrollBottom}