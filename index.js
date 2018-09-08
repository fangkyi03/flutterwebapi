const axios = require('axios')
const cheerio = require('cheerio')
axios.get("https://docs.flutter.io/index.html")
.then((e)=>{
    const $ = cheerio.load(e.data)
    $(".summary").each((index,e)=>{
        const title = $(e).find('h2').text().toLowerCase()
        const children = $(e).find('dl>dt>span').map((i,el)=>$(el).text()).toArray()
        console.log('object', index,title, children)
    })
    console.log('object')
})