// grabber

const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

let $, jsonArr;

module.exports = function grabber (){
    //считываем сайт
    let promise = new Promise((resolve, reject) => {
	    request.get('http://www.tsn.ua/', (error, response, data) => {
			if (!error && response.statusCode == 200) {
				jsonArr = [];
				//грабим ленту новостей, формируя json
		        $ = cheerio.load(data);
				$('.h-feed article').each(function(i, element){
					jsonArr.push({
						'title' : $(this).find('h4').text().trim(),
						'link' : $(this).find('h4 a').attr('href'), 
						'category' : $(this).find('.p-category').text().trim(), 
						'time' : $(this).find('time').text().trim(), 
					});
					if($(this).find('a img')){
	                    jsonArr[i]['img'] = $(this).find('a.c-post-img-wrap img').attr('src');
					    jsonArr[i]['imgAlt'] = $(this).find('a.c-post-img-wrap img').attr('alt');
					}
				});
				//последние 20 новостей
				resolve(jsonArr.slice(0,20));
			}
		});
	});
    //пишем json файл для просмотра в ридере
	promise.then(result => fs.writeFile(path.join('public','json','news.json'), JSON.stringify(result), setTimeout(grabber, 10000)));
    //ловим ошибки
	promise.catch(error => console.error(`Пизданулось :(  ${error.message}`));

};
