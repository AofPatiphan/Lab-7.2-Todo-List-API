const { v4: uuidv4 } = require('uuid');
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const { writeFile } = require('fs/promises');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8888, () => console.log('server is running on port 8888'));

//find todo
const data = require('./todolist.json');

// saveTodos
const save = async (result) => {
    await writeFile('todolist.json', JSON.stringify(result));
};

// Readfile
app.get('/users', (req, res, next) => {
    res.json({ data });
    next();
});

// Create
app.put('/users', async (req, res, next) => {
    try {
        const body = req.body;
        const obj = {}; // สร้าง blank Object
        obj.id = uuidv4(); // gen new id
        obj.title = req.body.title; // รับค่าจาก body ที่ส่งมาทาง client จาก tag ที่ชื่อว่า "title"
        obj.completed = req.body.completed; // รับค่าจาก body ที่ส่งมาทาง client จาก tag ที่ชื่อว่า "completed"
        obj.duedate = req.body.duedate; // สร้าง duedate ใหม่
        const result = [obj, ...data]; // ทำการเพิ่ม Object user เข้าไปใน Array users
        await save(result);
        return res.status(201).json({ result });
    } catch (err) {
        next(err);
    }
});

// Delete
app.delete('/users/:id', async (req, res, next) => {
    try {
        const removeId = req.params.id; // รับค่า params จาก url
        const result = data.filter((item) => item.id !== removeId);
        await save(result);
        res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
});

// Edit
app.patch('/users', async (req, res) => {
    const replaceId = req.body.id; // รับค่า params จาก url
    const position = data.findIndex(function (item) {
        return item.id == replaceId;
    });
    console.log(data[position]);
    data[position].title = req.body.title; // ทำการกำหนดค่า title ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    data[position].completed = req.body.completed; // ทำการกำหนดค่า completed ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    data[position].duedate = req.body.duedate; // ทำการกำหนดค่า duedate ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    const result = [...data];
    await save(result);
    return res.status(200).json({ result });
});
