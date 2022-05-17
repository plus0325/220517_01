// 發送async請求需要的套件
import axios from 'axios'
// 解析HTML需要的套件
import cheerio from 'cheerio'
// 引進我們所做的資料庫，直接用js格式，不用JSON格式就不用另外個工法
import template from './template.js'
// import fs from 'fs'

// 爬蟲抓到資料後存在這個courses陣列變數裡面來匯出使用
// ****** 匯出資料(1)共通課程的資料
const courses = []

// ****** 匯出資料(2)
const fetchData = async () => {
  try {
    // { data }是這個網頁HTML的所有內容原始碼文字

    const { data } = await axios.get('https://wdaweb.github.io/')
    // console.log(data) >> 看一下是否有抓到html原始碼
    // 利用 cheerio去解析data內容設定一個＄變數
    const $ = cheerio.load(data)
    // 針對'#general .col-md-3'去跑迴圈抓裡面的東西
    $('#general .col-md-3').each(function () {
      // trim()移除目前字串開頭和結尾的所有空白字元
      // 這抓到的東西放在courses這個空陣列變數裡面
      // 以下是分解步驟
      // 1.抓取這邊的文字
      // courses.push(($(this).text()))
      // 2.把html的空白字元拿掉\t > .replace(XX, ’‘) >> 空‘’的意思就是拿掉
      // courses.push(($(this).text().replace(/\t/g, '')))
      // courses.push(($(this).text().replace(/\t/g, '').replace(/\n/g, '')))
      // 4.把html的換行字元拿掉\n 會用.split來切割是因標題和內文中間的\n用.replace會一並處理掉,到時候資料出就不清楚誰是標題誰是內文
      // courses.push(($(this).text().replace(/\t/g, '').split('\n')))
      // 5.filter()文字的長度大於0就留下來。因為刪除掉的\n還是有很多空的東西
      // courses.push(($(this).text().replace(/\t/g, '').split('\n').filter(text => text.length > 0)))
      // 6.利用 解構 組成一個陣列把圖片也放進來
      courses.push(
        [
          // this是代表目前這個迴圈跑到的東西
          'https://wdaweb.github.io/' + $(this).find('img').attr('src'),
          ...($(this).text().replace(/\t/g, '').split('\n').filter((text) => {
            return text.length > 0
          }
          ))
        ]
      )
      /*
      // 以上例外一個寫法 //

      >>> $(this).text().replace(/\t/g, '').split('\n').filter(text => text.length > 0)原本就是一個陣列

      const temp = $(this).text().replace(/\t/g, '').split('\n').filter(text => text.length > 0)
      temp.push($(this).find('img').attr('src'))
      courses.push(temp)

      */
    })
    // console.log(courses)
  } catch (error) {
    console.log(error)
  }
}

// ****** 匯出資料(3)
const replyCourses = (event) => {
  // .map重組資料
  const bubbles = courses.map((course) => {
    // 運用深層複製將template的資料複製一個新備份的內容(就不會改到原本的東西)，轉成文字後又轉成可以用的JSON
    const bubble = JSON.parse(JSON.stringify(template))
    bubble.hero.url = course[0]
    bubble.body.contents[0].text = course[1]
    bubble.body.contents[1].text = course[2]
    return bubble
  })
  // console.log(JSON.stringify(bubbles, null, 2))
  // fs.writeFileSync('bubbles.json', JSON.stringify(bubbles, null, 2))

  // console.log(JSON.stringify(bubbles, null, 2))

  /*
  // fix bugs方式:這邊nodejs會把資料收納起來變成物件，所以不好看讀到內容有哪些
  console.log(bubbles)

  // 解1轉成好閱讀的JSON文字
  console.log(JSON.stringify(bubbles, null, 2))

  // 解2利用Nodejs原本內有的套件fs來將格式另存文件
  （a)先引入
   import fs from 'fs'
   (b)fs.writeFileSync('放要寫[生]出來的檔案名',要放的文字(資料內容))。傳訊後就會在資料夾就會多一個bubbles.json檔案了
   fs.writeFileSync('bubbles.json‘, JSON.stringify(bubbles, null, 2))
  */

  event.reply([
    {
      type: 'flex',
      altText: '這邊是預覽文字,會顯示在line預覽',
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 1)
      }
    }
  ])
}

/*
一開始老師打這些，但出現bugs，所以一直找fix bugs的方式：
const replyCourses = (event) => {
  // 將template裡面的內容先製作成陣列(就是位置跟courses位置呼應)
  const bubbles = courses.map((course) => {
    // courses陣列裡面第一個位置(0)的圖片連結
    template.hero.url = course[0]
    // courses陣列裡面.contents第一個位置(0)的文字(大標)
    template.body.contents[0].text = course[1]
    // courses陣列裡面.contents第一個位置(0)的文字(大標)
    template.body.contents[1].text = course[2]
    // 回傳以上的東西出去
    return template
  })
  console.log(bubbles)
  // line訊息的flex樣式
  event.reply({
    type: 'carousel',
    contents: bubbles
  }).catch((err) => {
    console.log(err)
  })
}

解決的方式過程出現有：
1.用nodejs內建的fs來找找看要提供給line的template內容格式是否有問題
2.改成JSON格式內容來看資料
*/
export default {
  fetchData,
  courses,
  replyCourses
}
