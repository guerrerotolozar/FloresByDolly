const qrcode = require('qrcode-terminal');
qrcode.generate('https://www.floresbydolly.com/rifa', {small: true}, function (qr) {
    console.log(qr);
});
