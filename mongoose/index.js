const mongoose = require('mongoose')
const Schema = mongoose.Schema

// test 为数据库名
const uri = 'mongodb://localhost:27017/test'

mongoose
  .connect(uri)
  .then(db => {
    console.log('😄 连接数据库成功')

    // 定义 schema
    let schema = new Schema({title:String, url: String})

    // 定义 model
    // 数据库中会新建（如果没有） bookmarks 的 document
    let Bookmark = mongoose.model('bookmark', schema)
    

    // 以下操作数据库
    ///////////////////////////////////////////////////////

    // 增
    let doc0 = new Bookmark({title: '我的博客', url: 'https://hanzichi.github.io/blog'})
    let doc1 = new Bookmark({title: '我的 GitHub', url: 'https://github.com/hanzichi'})
    let doc2 = new Bookmark({title: '谷歌', url: 'https://google.com'})
    let doc3 = new Bookmark({title: '思否', url: 'http://sf.gg'})

    doc0.save(err => {
      if (err) {
        console.log('出错了')
        return
      }

      console.log('保存成功')
    })

    let data = [
      doc1, doc2, doc3
    ]

    Bookmark.insertMany(data, (err, docs) => {
      console.log(docs)
    })


    // 查 
    Bookmark.find({}, (err, docs) => {
      docs.forEach(item => {
        console.log(item.title, item.url)
      })
    })


    // 改
    // 条件
    var myWhere = {title: '思否'}

    // 设置新值
    // 更新的数据比较少用 $set，可用性还是很好
    var newValue = {$set: {title: 'sf'}}

    Bookmark.update(myWhere, newValue, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('update ok')
      }
    })
    
    
    // 删
    Bookmark.remove({title: 'sf'}, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('remove ok')
      }
    })

    
    // 关闭数据库
    // db.close()
  })
  .catch(error => console.log('😿 连接数据库失败'))