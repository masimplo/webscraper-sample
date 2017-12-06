var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  //All the web scraping magic will happen here
  const titlesUrl = 'http://www.telegraph.co.uk/news/';

  const titles = [];

  request(titlesUrl, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      $('.list-of-entities__item-body-headline').filter(function () {
        const data = $(this);
        const element = data.children().last();
        titles.push({
          text: element.text(),
          link: `http://www.telegraph.co.uk/${element.attr('href')}`
        })
      })

      res.json(titles);
    }
  })
})

app.get('/scrape/article', function (req, res) {
  const articleUrl = 'http://www.telegraph.co.uk/news/2017/12/05/uk-weather-storm-caroline-named-met-office-ahead-80mph-winds/';
  let articleText = '';
  request(articleUrl, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      $('.articleBodyText').filter(function () {
        const data = $(this);
        articleText += data.children().text();
      })

      res.send(articleText);
    }
  })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;