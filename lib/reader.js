//reader

const fs = require('fs');

module.exports = function (res){
    //читаем json-файл
	let promise = new Promise((resolve, reject) => {
		fs.stat('./public/json/news.json', (err, exists) => {
			if(exists){
				fs.readFile("./public/json/news.json", (err, data) => {
					resolve(JSON.parse(data.toString()));
				})
			}else{
				resolve("no data");
			}  
		});
	});
    //передаем прочитанное в шаблон
	promise.then(result => {
		res.render('index', { title: 'ТСН ВРАЖАЭ', data: result });
	});
    //ловим ошибки
	promise.catch(error => {
		console.log(`Пизданулось :(  ${error}`); 
	});
};