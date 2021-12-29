const { v4: uuidv4 } = require('uuid');
const express = require('express');
const req = require('express/lib/request');
const { type, json } = require('express/lib/response');
const res = require('express/lib/response');
const path = require('path');
const app = express();
const axios = require('axios');
const { use } = require('express/lib/application');
const { response } = require('express');
const { readFile, writeFile } = require('fs/promises');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8888, () => console.log('server is running on port 8888'));

//find todo
const data = require('./todolist.json');

// saveTodos
const saveTodos = async (result) => {
    await writeFile('todolist.json', JSON.stringify(result));
};

// Readfile
app.get('/users', (req, res) => {
    res.json({ data });
    next();
});

// Create
app.put('/users', async (req, res, next) => {
    try {
        const body = req.body;
        const obj = {}; // สร้าง Object user
        obj.id = uuidv4(); // id จำลองมาจาก auto increment ใน database โดยนับจากจำนวน length เริ่มต้นที่ 1
        obj.title = req.body.title; // รับค่าจาก body ที่ส่งมาทาง client จาก tag ที่ชื่อว่า "name"
        obj.completed = req.body.completed; // รับค่าจาก body ที่ส่งมาทาง client จาก tag ที่ชื่อว่า "age" พร้อมกับแปลงค่านั้นเป็นตัวเลขโดยฟังก์ชั่น Number()
        obj.duedate = req.body.duedate; // รับค่าจาก body ที่ส่งมาทาง client จาก tag ที่ชื่อว่า "movie"
        console.log(obj);
        const result = [obj, ...data]; // ทำการเพิ่ม Object user เข้าไปใน Array users
        // console.log('Users :', data.name, 'Created!');
        await saveTodos(result);
        return res.status(201).json({
            result,
        });
    } catch (err) {
        next(err);
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const removeId = req.params.id; // รับค่า params จาก url
        const result = data.filter((item) => item.id !== removeId);

        await saveTodos(result);
        res.status(200).json({
            result,
        });
    } catch (err) {
        next(err);
    }
});

app.patch('/users/', async (req, res, next) => {
    const replaceId = req.body.id; // รับค่า params จาก url
    // console.log(req.body);
    const position = data.findIndex(function (val) {
        // หา Index จาก array users
        return val.id == replaceId;
    });
    console.log(data[position]);
    data[position].title = req.body.title; // ทำการกำหนดค่า name ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    data[position].completed = req.body.completed; // ทำการกำหนดค่า age ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    data[position].duedate = req.body.duedate; // ทำการกำหนดค่า movie ใหม่เข้าไปจาก req.body ที่รับเข้ามา
    const result = [...data];
    await saveTodos(result);
    return res.status(200).json({ result });
});
