import axios from 'axios';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
getDocIndex();
async function getDocIndex(host = 'https://docs.nebula-graph.io') {
  const data = await axios.get(host);
  const version = data.data.match(/(([1-9]\d|[1-9])(\.([1-9]\d|\d)){2})/)?.[0];
  if (!version) {
    return console.warn("no version found", data.data);
  }
  host = `${host}/${version}`
  const homePageData = await axios.get(host);
  const html = homePageData.data;

  const $ = cheerio.load(html);
  const links = $('.md-nav--primary > .md-nav__list a');
  const linksMap = new Set();
  links.each((i, link) => {
    const href = $(link).attr('href');
    if (href.includes('.pdf') > 0 || href.startsWith('#') || href.indexOf("1.nGQL-overview") > -1) return;
    linksMap.add(href);
  });

  const length = linksMap.size;
  const res = {};
  let now = 0;
  // update or insert doc
  for (let link of linksMap) {
    const href = `${host}/${link}`;
    let name = 'doc';
    try {
      if (link.indexOf('ngql-guide') >= 0) {
        name = 'ngql';
        if (!res[name]) {
          res[name] = []
        }
        console.log(link)

      } else {
        continue;
      }
      const data = await axios.get(href);
      const html = data.data;
      const $ = cheerio.load(html);
      const main = $('article.md-content__inner');
      main.find('.headerlink').remove();
      main.find('.md-source-file').remove();
      main.find('.admonition').remove();
      const titleDom = main.find('> h1').first();
      titleDom.remove();
      const content = main.text();
      const title = titleDom.text();
      const finalContent = await makeDocTextForGPT(content);
      console.log(finalContent);
      const object = {
        title: title,
        content: finalContent,
        url: href.replaceAll(host + '/3.ngql-guide/', ''),
        type: 'doc'
      }
      console.log(`update:[${++now}/${length}]`, object.title);
      res[name].push(object)
    } catch (e) {
      console.warn(e);
      console.log(`update doc failed:[${++now}/${length}]`, href);
    }
  }
  // save nowDocMap
  console.log('saved')
  for (let key in res) {
    fs.writeFileSync(path.join(__dirname, `./${key}.json`), JSON.stringify(res[key]));
  }
}

async function makeDocTextForGPT(content) {
  let contentArr = content.split('\n').filter(item => item.trim().length > 1);
  contentArr = contentArr.filter(item => !/(^\+-+.*-+\+$)|(^\|.*\|$)/.test(item.replaceAll("\n", '')));
  const contentFinal = contentArr.join('\n');
  return contentFinal;
  // let prompt = `请精简以下图数据库语句的文档，保障文档长度小于800个gpt token，并且保留语句的示例用法,保持为英文。文档:\n${contentFinal}`;
  // return axios.post('https://vesoft.openai.azure.com/openai/deployments/ding_chatbot/completions?api-version=2023-03-15-preview', {
  //   prompt,
  //   max_tokens: 500,
  //   temperature: 0.7,
  // }, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'api-key': '4d93ecc9305a4b0487cee880258aea19',
  //   }
  // }).then(res => {
  //   return res.data.choices[0].text;
  // })
}

export default getDocIndex; 