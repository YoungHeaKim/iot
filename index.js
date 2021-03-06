import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();

let port = 3000;

import serialPort from 'serialport';
import Readline from '@serialport/parser-readline';

// 시리얼 포트 설정
// COM6 : 아두이노가 연결된 포트
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
// const portName = '/dev/cu.usbmodem145301';

const com6 = new serialPort('/dev/cu.usbmodem144301', {
    baudRate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});

com6.on('open', function () {
    console.log('open serial communication');
    com6.flush(() => {
        const parser = com6.pipe(new Readline({delimiter: '\r'}));
        return parser.on('data', line => console.log(line));
    });
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

// TODO: 이부분에서 data값 보내주는 것만 하면 완성
// led제어 해주는 부분
app.get('/controller/:_id', function (req, res) {
    console.log(new Date());
    const {_id} = req.params;
    if (_id === "temp") {
        com6.write(_id);
    } else {
        com6.write("color/" + _id);
    }
    res.status(200).send('LED Controll OK!!');

});

app.listen(port, () => console.log('Example app listening on port', port));
