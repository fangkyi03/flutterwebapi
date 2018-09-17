const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const process = require('child_process')

const baseUrl = "https://docs.flutter.io/";
const basePath = __dirname + '/lib/'

// 存放所有的文件引用路径
const obj = {}

/**
 * 转换类的数据
 *
 */
function tranClass () {

}


/**
 * 判断路径是否为空 如果不为空 先清空对应目录
 *
 * @param {*} path
 */
function isPathEmtry (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}


/**
 * 创建文件
 *
 * @param {*} path
 * @param {*} content
 */
function createFile (path,content = '') {
    fs.writeFileSync(path,content )
}


/**
 * 初始化文件夹 如果有文件就删除
 *
 * @param {*} callBack
 */
function initPath (callBack) {
    process.exec('rm -rf ' + basePath, () => {
        fs.mkdirSync(basePath)
        callBack()
    })
}


/**
 * 获取第二级数据
 *
 * @param {*} {item,parentPath,pathName}
 */
function getChildrenInfo ({item,parentPath,pathName}) {
    axios.get(item.url)
    .then((e)=>{
        const $ = cheerio.load(e.data)
        isPathEmtry(parentPath + "/" + item.text)
        $("#classes>dl>dt>span").each((index,e)=>{
            const title = $(e).text().split('<')[0]
            const url = $(e).find('a').attr('href')
            createFile(parentPath + "/" + item.text + "/" + title + '.ts', "");
        })
    })
}


/**
 *  获取第一级接口数据
 *
 * @param {*} url
 */
function getParentInfo (url) {
    axios.get(url)
    .then((e) => {
        const $ = cheerio.load(e.data)
        $(".summary").each((index, e) => {
            const pathName = $(e).find('h2').text().toLowerCase()
            const children = $(e).find('dl>dt>span').map((i, el) => {
                const url = baseUrl + 'flutter/' + $(el).find('a').attr('href')
                const text = $(el).text()
                return {url,text}
            }).toArray();
            isPathEmtry(basePath + pathName);
            children.map((item) => getChildrenInfo({item,parentPath:basePath + pathName, pathName}))
        })
    })
}

initPath(() => getParentInfo(baseUrl + 'index.html'))