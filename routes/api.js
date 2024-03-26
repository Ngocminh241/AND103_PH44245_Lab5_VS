const express = require('express');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:admin@cluster0.jcetqj6.mongodb.net/md18309'

const app = express();
const Distributors  = require('../models/distributors');
app.use(express.json());

// day danh sach len
app.listen(3000, () => {
    console.log("Server chay cong 3000");
})
mongoose.connect(uri).then(() => console.log("Connect thanh cong"))

app.get('/get-list-distributor', async (req, res) => {
    try {
        const data = await Distributors.find().populate();
        res.json({
            "status": 200,
            "messenger": "Danh sách distributor",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body;
        const newDistributors = new Distributors({
            name: data.name
        });
        const result = await newDistributors.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})
app.put('/update-distributor-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        const data = req.body
        const updateDistributor = await Distributors.findById(id)
        let result = null;
        if (updateDistributor) {
            updateDistributor.name = data.name ?? updateDistributor.name

            result = await updateDistributor.save();
        }
        if (result) {
            res.json({
                'status': 200,
                'messenger': 'Cập nhật thành công',
                'data': result
            })
        } else {
            res.json({
                'status': 400,
                'messenger': 'Cập nhật không thành công',
                'data': []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

app.delete('/destroy-distributor-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await Distributors.findByIdAndDelete(id);
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi! xóa không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/search-distributor', async (req, res) => {
    try {
        const key = req.query.key

        const data = await Distributors.find({ name: { "$regex": key, "$options": "i" } })
            .sort({ createdAt: -1 });

        if (data) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

