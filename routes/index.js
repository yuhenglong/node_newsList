var express = require('express');
var router = express.Router();

// 引入mongoose
const mongoose = require('mongoose');
// 连接mongodb数据库,其中'mongodb://localhost:27017/newsList'中的newList是数据库名；
mongoose.connect('mongodb://localhost:27017/newsListYu', (err) => {
        if (err) {
            throw err;
        } else {
            console.log('数据库连接成功。。。')
        }
    })
    // 监听连接状态
mongoose.connection.on('connected', () => {
    console.log('已连接')
})

// 定义字段名和类型，即定义骨架
const Schema = mongoose.Schema;
const newsSchema = new Schema({
    title: String,
    author: String,
    from: String,
    content: String,
    time: String,
    hits: Number
})

// 定义Schema模型实例化，即定义模型(它才能操作数据数据库),其中‘newsModel’是上面数据库newsList的集合，名字为：newsModel
const Model = mongoose.model('newsModelYu', newsSchema, 'newsModelYu');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// 显示数据库的新闻列表内容
router.get('/list.html', (req, res) => {
    Model.find().exec((err, data) => {
        // 对象{list:data}里面的'list'为渲染模板里面的循环数组，data为获取到的数据库的data数据
        res.render('newsList.ejs', { list: data });
    })
})

// 定义路由,挂载一个保存新增数据的路由save_news.html
router.post('/save_news.html', function(req, res) {
    // 接收客户端POST传过来的数据
    const title = req.body.title;
    const author = req.body.author;
    const from = req.body.from;
    const content = req.body.content;
    const time = new Date().toString();
    // 操作数据库用model
    const listModel = new Model();
    listModel.title = title;
    listModel.author = author;
    listModel.from = from;
    listModel.content = content;
    listModel.time = time;
    listModel.hits = 1;
    // 保存到数据库
    listModel.save((err) => {
        res.send('<h1>数据已经保存</h1>')
    })
})

// 删除对应的数据库数据
router.get('/del.html', (req, res) => {
    const id = req.query.id;
    Model.findById(id).exec(function(err, data) {
        data.remove(() => {
            res.send(`<script>alert("删除成功!");window.location.href = '/list.html';</script>`)
        })
    })
})

// 编辑数据
router.get('/edit.html', (req, res) => {
    const id = req.query.id;
    Model.findById(id).exec((err, data) => {
        res.render('oldEdit.ejs', { data: data })
    })
})

// 保存编辑好的数据
router.post('/save_edit.html', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let author = req.body.author;
    let from = req.body.from;
    let content = req.body.content;
    Model.findById(id).exec((err, data) => {
        data.title = title;
        data.author = author;
        data.from = from;
        data.content = content;
        data.save((err) => {
            res.send(`<script>alert('修改成功！');location.href = '/list.html'</script>`)
        })
    })
})

module.exports = router;