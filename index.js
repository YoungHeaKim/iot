import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();

let port = 3000;

import serialPort from 'serialport';

// 시리얼 포트 설정
// COM6 : 아두이노가 연결된 포트
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
// const portName = '/dev/cu.usbmodem14101';

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
    // 아두이노 데이터 가져오는 부분
    // com6.on('data', function(data) { console.log('Value: ', data[0]);});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.status(200).render('view.ejs');
    // res.status(200).render('test.ejs');
});

app.get('/controller/:_id', function (req, res) {
    const Str = '#';
    const hex = Str.concat(req.params._id);
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    let RGB = hexToRgb(hex);
    console.log(RGB);
    // com6.write(req.params.id);
    res.status(200).send('LED Controll OK!!');
});

app.listen(port, () => console.log('Example app listening on port', port));
