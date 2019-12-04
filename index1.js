import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();

let port = 3000;

import serialPort from 'serialport';

// 시리얼 포트 설정
// COM6 : 아두이노가 연결된 포트
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
// const portName = '/dev/cu.usbmodem145301';

const com6 = new serialPort('/dev/cu.usbmodem145301', {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});
const Readline = require('@serialport/parser-readline');
const parser = port.pipe(new Readline({delimiter: '\n'}));

com6.on('open', function () {
    console.log('open serial communication');
    // 아두이노 데이터 가져오는 부분
    // com6.on('data', function (data) {
    //     console.log('Value: ', data);
    // });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ejs template 보여주는 부분
app.get('/', function (req, res) {
    res.status(200).render('view.ejs');
    // res.status(200).render('test.ejs');
});

// led제어 해주는 부분
aapp.get('/controller/:_id', function (req, res) {
    console.log('req.params._id', req.params._id);
    // TODO: 값을 두번 보내는 오류
    let hexFront = '0x';
    let hex = hexFront.concat(req.params._id);
    console.log('전', hex);
    com6.write(hex);
    console.log('후');
    res.status(200).send('LED Controll OK!!');
});

// temp 온도 보내주는 부분
app.get('/temp', function (req, res) {
    res.status(200).send('동권쓰');
});

app.listen(port, () => console.log('Example app listening on port', port));
