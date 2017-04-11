
var http = require("http");
var url = require("url");
var fs = require("fs");
var static = require('node-static');
var util = require('util');
var path = require('path');

var teamLvls = {};
//var lvlKeys = ['QT9684jguuth5s','QTdmklfv58dhjjdh', 'QTasdgshtt73gfdf', 'QTnfgnfsa652azu7', 'QTfdklghj3s85fjjf',
//  'QTasdkljdlkrj88jsp', 'QTamirrordec', 'QT43dokTret', 'QT754hgf932j'];

var lvlListObjs = [
  {QT9684jguuth5s : {error: '', img: 'imgs/level2.png', task: "Красава Джек, я был уверен в тебе и твоих силах, " +
  "однако это всего лишь цветочки. У нас ещё куча этажей в банке и кто знает, что на них творится. А для начала" +
  " нам нужно обезвредить охранника. Лиза провела с ним ночь и узнала данные для входа в комьютер. Зайдя в комп" +
  " мы сможем включить пожарную сигнализацию и тем самым отвлечь охранника и пробраться к лифту.\n Действуй Джек, " +
  "времени у нас не много! Вот данные для входа:\n" +
  "username: oxrannik1\n" +
  "password: password1\n" +
  "А вот так ты сможешь подключиться к его компу: '/level2/simplePost'"}},
  {QTdmklfv58dhjjdh : {error: '', img: 'imgs/level3.jpg', task: "'/level3/getWithHeader' - заголовок\n" +
  "- Ну что же Джек, круто мы облапошили этого олуха со входа.\n" +
  "- Малкольм, что у нас сейчас по плану?\n" +
  "- Бегом в лифт. Подключаемся там к системе управления лифтом и останавливаем лифт " +
  "между 3им и 4ым этажами. Так нас не увидят с пульта охраны на камерах наблюдения.\n"+
  "- Джек, давай разберись с этим - для тебя это раз плюнуть.\n" +
  "- Ооо, с этой системой я уже сталкивался, я справлюсь в два счета, тут нужно лишь отправить " +
  "«Get» с хедером - “Floor” => “3.5” "}},
  {QTasdgshtt73gfdf : {error: '', img: 'imgs/level4.jpg', task: "'/level4/postWithHeader' - заголовок \n" +
  "Ну вот мы и добрались в подсобку. Дальше просто так " +
  "мы не пройдем. Повсюду видеокамеры. Нужно бы от них избавиться. И еще устранить охранников.\n Джек - берись за камеры, " +
  "а мы с рсебятами устраним охрану, как только ты их отключишь. Давай, поторопись, у нас очень мало времени.\n Охх... " +
  "Камеры, нужно будет подключится как то к ним. Хм… Ага, слышал к ним подключаются post’ом и что-то в хедерах нужно " +
  "просто передать. Я гляну маркировку камер и что-то соображу.\n" +
  "*Хмм, это кажется какая-то китайская камера, ну хорошо хоть название понятно. Обычно вроде передается 4 символа" +
  " вместе с названием, но тут черт ногу сломит, что они имели в виду, да ещё и последний символ как на зло размазался…*"}},
  {QTnfgnfsa652azu7 : {error: '', img: 'imgs/level5.jpg', task: "'/level5/getHeader'\n" +
  "- Что там Джон, что? \n" +
  "- Дальше у нас сканер отпечатков пальцев, что бы попасть на 6ой этаж.\n" +
  "- Лиза, ты сняла отпечатки пальцев у начальника охраны?\n" +
  "- Да, все в порядке. Я сняла отпечатки пальцев и перевела их на искусственный палец.\n" +
  "- Давайте тогда быстренько проходим сканирование и побежали дальше…\n" +
  "- Что такое? \n" +
  "- Экран показывает что отпечатки успешно считаны, но нужно ещё ввести какой-то код\n" +
  "- Дай Джеку разобраться, возможно он сможет перехватить где-то этот код.\n"}},
  {QTfdklghj3s85fjjf : {error: '', img: 'imgs/level6.png', task: "'/level6/getWithCookies'\n" +
  "- Давайте ребята, бегом на 7ой.\n" +
  "- Стойте, слышите? Похоже еще кто-то из охраны все еще остался. Давайте его устраним!\n" +
  "- Не получится, до него бежать по коридору метров 20 - не меньше, он вызовет подмогу по рации. Нужно что-то придумать!\n" +
  "- Так - он похоже просто делает обход по комнатам.\n" +
  "- Смотрите - он зашел в комнату для допросов - там любой сигнал будет заглушен.\n" +
  "- Так давайте же его закроем там.\n" +
  "- Не получится - там электронный замок. Только если Джек сможет его запереть там через их систему.\n" +
  "- Я попробую, но ничего не обещаю. Тут всё сложно... \n" +
  "*Проанализировав их запросы в системе я кажется понял суть*"}},
  {QTasdkljdlkrj88jsp : {error: '', img: 'imgs/level7.jpg', task: "'/level7/getJSON/XX' " +
  "- Интересно, интересно. Это 7ой этаж и тут порядка 100 комнат. Тут же 100 комнат!!!! Малкольм - ты когда " +
  "договаривался со своим человеком, что бы он забыл снять с сигнализации свой кабинет, случайно не узнал номер комнаты?\n" +
  "- Нет.\n" +
  "- Понятно.\n" +
  "- Нужно как-то узнать, в какой комнате отключена сигнализация.\n" +
  "- Ребята, пусть Джек проверит.\n" +
  "- 01 не подходит.\n" +
  "- Чтож, Джек - не отчаивайся, это для тебя будет как 1 + 2."}},
  {tryuwhsadjru : {error: '', img: 'imgs/level8.jpg', task: "'/level8/getXML'\n" +
  "- Такс, ну вот - по карте у нас ещё пара комнат и сейф. Аж не верится, что мы так быстро добрались\n" +
  "- Ох, я даже и не верил в нашу затею поначалу. Однако мы уже почти у цели.\n " +
  "- Не может быть!!! Дверь заблокирована и у нас нету ключей, они установили новую дверь и её нету на плане.\n" +
  "- Судя по плану прямо над нами вентиляция. Думаю кто-то из нас сможет пролезть и попасть прямиком в следующую комнату," +
  " однако дверь в любом случае придется открывать - т.к. наше оборудование для сейфа не пролезет в вентиляцию.\n" +
  "- Джек, ты похоже самый тощй, полезай ка и открой нам дверь.\n" +
  "- Ладно-ладно, лезу.\n" +
  "    10 минут спустя. \n" +
  "...Парни тут какая-то хренотень. Какой-то древний терминал - вообще не понятно, что с ним можно делать, попробую" +
  " его взломать… \n" +
  "    15 минут спустя. \n" +
  "*По рации*\n" +
  "- Ничего не понятно ребят, пробую перебирать уже PIN`ы к терминалу, но ничего не выходит, слишком много комбинаций. \n" +
  "- Посмотри вокруг, не сдавайся - техники оставляют обычно какие-то зацепки для себя, что бы не забыть ПИН \n" +
  "- Тут ничего нету кроме постера, да и кто-то вышкрябал на терминале слово `pop`.\n" +
  "- Мы верим в тебя, Джек, ты же мозг, сообрази что-нить."}},
  {QT43dokTret : {error: '', img: 'imgs/level9.jpg', task: "'/level9/laserSystem' \n" +
  "- Джек, а ты головастик оказывается. Первое впечатление\n" +
  " о тебе было как о психе, да и второе тоже. Мы тебя честно говоря не воспринимали всерьез. \n" +
  "- Спасибо за комплимент, Лиза. \n" +
  "- Что ж - впереди у нас лазерная растяжка. Лиза - заминируй отход назад, что бы за нами уже никто не пришел. " +
  "Малкольм - свяжись с вертолётчиком - пускай уже вылетает, мы у цели.\n" +
  "- Джек - давай, удали лазерную растяжку и будем штурмовать сейф."}},
  {QTcorrectAnswer : {error: '', img: 'imgs/level10.jpg', task: "'level10/getBXSX64FORMXT'\n" +
  "- Ну вот мы и добрались до него. Сейф. Швейцарская трехуровневая система замыкания основанная на " +
  "синхронной перекапсуляции дельта нейронов сети.\n " +
  "- Будет не просто мягко говоря. Но слава богу мы немного подготовились к этому.\n" +
  "- Джек, теперь всё зависит только от тебя"}},

  {QT754hgf932j : {error: '', img: 'imgs/Bank.jpg', task: "task13 text"}}
];
var sevenSon = "<f>1<a>asd</a><b>gdf<c>gyj<a>iu</a><q>kt<a>kjgg</a></q><l>jughj<a>ou</a></l><h>23f4</h></c><a>sdf54hs<d>23sk8f<a>skldjg</a><a>23d<w>f43f<r>sdf54h7</r></w><e>bdw32</e></a><p>565fdgh<a>98k53s</a><e>bfb2111sa<a>dfbgs43hm<ct>dsfgh4h<fg>23d23d</fg><dfw>gdfgdf4<gh>fdgh34<gf>sfgh34<rt>dftgr5</rt><tc>dfsgh67</tc></gf></gh></dfw></ct></a></e></p><a>234r4df456s</a></d><ts>gfljk85</ts><a>35gfdgfi7</a><sda>23r4asa<aa>fgd4</aa><fg>fng54<the>11234e<ew>nh3<we>dfeg3<gbdt>dfg33g</gbdt><ghg>ghdg<try>dfgh23<lol>dfgh54</lol><pop>sdfg32<st>ertyeg</st><jfg>fghr</jfg><frfe>sdfgsdv<tr>sdfg3<ewq>sdfg3</ewq><fgf>glyashotut</fgf><tt>34rsee</tt><qwe>asd<ssf>nucho</ssf></qwe></tr></frfe><obla>ka</obla><belo>snegn</belo><ie>loshadki</ie><ss>dsfg3gjj<gjf>sdfg</gjf><sdfg>ramamba</sdfg><trte>hara</trte><hutp>bam</hutp><pory>byry</pory><dnishe>oyoy</dnishe><wqe>kto<ewq>eg3w<ert>nicho<ret>gde<tre>xto<ne>xodi<tot>ktoto</tot></ne></tre></ret></ert></ewq></wqe><odin>da</odin></ss><asdkjjjg>hot</asdkjjjg></pop></try></ghg></we></ew></the></fg></sda><h>as23fs454</h></a></b></f>";
var base64 = "UVRjb3JyZWN0QW5zd2Vy";

var fileServer = new static.Server(__dirname);

var server = http.createServer(function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,accept,Questaton,QuestatonLevel4');

  if (request.method === 'OPTIONS') {
      response.statusCode=200;
      response.end();
  }

  if (request.method === 'GET' &&  request.url.split('/').pop() === 'home') {
    fs.readFile("test.html" , function(error, info) {
      response.write(info);
      // response.statusCode=200;
      response.end();
    })
  }
  else if( request.url.match(/\S*\.[html,jpg,js,css]/) ) {
    fileServer.serve(request, response);
  }
  else if ( request.method === 'POST' && request.url === '/') {
    request.on('data', function (reqDt) {
      var reqData = JSON.parse(reqDt);
      var respBody;
      lvlListObjs.every( function(obj,i,arr) {
        var exit = true;
        if (typeof obj[reqData.levelKey] != 'undefined') {
          if ( i==teamLvls[reqData.teamName] || i==0 ) {
            respBody = obj[reqData.levelKey];
            teamLvls[reqData.teamName] = i+1;
            fs.appendFile('logs.txt', reqData.teamName +' - '+ i+1 + ' - '+ (new Date()).getHours()+ ':' + (new Date()).getMinutes() + ':' + (new Date()).getMilliseconds() +'\n', 'utf8', function (err) {
              if (err) throw err;
            });
          } else {
            respBody = {error : "Provided Level Key doesn't correspond to your team level", img: '', task :""}
          }
          exit = false;
        } else {
          respBody = {error : "You've submitted a wrong key", img: '', task :""}
        }
        return exit;
      } );
      response.end(JSON.stringify(respBody));
    });
  }

  //BACKEND PART

  //LEVEL1
  else if (request.method === 'GET' &&  request.url.split('/')[1] === 'level1') {
    if (request.url.split('/').pop() === 'simpleGet') {
      response.statusCode = 200;
      response.end("Level 1 passed. Code: QT9684jguuth5s");
    } else {
      response.statusCode = 404;
      response.end("LoL try again1");
    }
  }

  //LEVEL2
  else if (request.method === 'POST' &&  request.url.split('/')[1] === 'level2') {
      request.on('data', function (reqDt) {
      var reqData = reqDt.toString();
      if ( request.url.split('/').pop() === 'simplePost' && reqData === "username=oxrannik1&password=password1" ) {
        response.statusCode = 200;
        response.end("Level 2 passed. Code: QTdmklfv58dhjjdh");
      } else {
        response.statusCode = 404;
        response.end("LoL try again2");
      }
    });
  }

  //LEVEL3
  else if (request.method === 'GET' && request.url.split('/')[1] === 'level3') {
    if (request.url.split('/').pop() === 'getWithHeader' && request.headers.floor === "3.5") {
      response.statusCode = 200;
      response.end("Level 3 passed. Code: QTasdgshtt73gfdf");
    } else {
      response.statusCode = 404;
      response.end("LoL try again3");
    }
  }

  //LEVEL4
  else if (request.method === 'POST' && request.url.split('/')[1] === 'level4') {
    if (request.url.split('/').pop() === 'postWithHeader' && request.headers.camera === "1234") {
      response.statusCode = 200;
      response.end("Level 4 passed. Code: QTnfgnfsa652azu7");
    } else {
      response.statusCode = 404;
      response.end("LoL try again4");
    }
  }

//LEVEL5
  else if (request.method === 'GET' && request.url.split('/')[1] === 'level5') {
    if (request.url.split('/').pop() === 'getHeader') {
      response.statusCode = 200;
      response.setHeader("QuestatonHeader", "QTfdklghj3s85fjjf");
      response.end();
    } else {
      response.statusCode = 404;
      response.end("LoL try again5");
    }
  }

  //LEVEL6
  else if (request.method === 'GET' && request.url.split('/')[1] === 'level6') {
    //var cookies = parseCookies(request);
    if (request.url.split('/').pop() === 'getWithCookies' &&
         ( request.headers.cookie === "QuestatonLevel=6" || request.headers.cookies == "QuestatonLevel=6") ) {
      response.statusCode = 200;
      response.end("Level 6 Passed. Code: QTasdkljdlkrj88jsp");
    } else {
      response.statusCode = 404;
      response.end("LoL try again6");
    }
  }

  //LEVEL7
  else if (request.method === 'GET' &&  request.url.split('/')[1] === 'level7') {
    var splitURL = request.url.split('/');
    var endURL = splitURL[splitURL.length-2] + splitURL[splitURL.length-1];
    if ( endURL === 'getJSON23') {
      response.statusCode = 200;
      response.end("{\"Level\": \"7\", \"Code\": [{\"1\": \"tryuwh\"}, {\"2\": \"sadjru\"}]}");
    } else {
      response.statusCode = 200;
      response.end("LoL. Try Again7");
    }
  }

  //LEVEL8
  else if (request.method === 'GET' &&  request.url.split('/')[1] === 'level8') {
    if ( request.url.split('/').pop() === 'getXML' ) {
      response.statusCode = 200;
      response.end(sevenSon);
    } else {
      response.statusCode = 404;
      response.end("LoL. Try Again8");
    }
  }

  //LEVEL 9
  else if (request.method === 'DELETE' &&  request.url.split('/')[1] === 'level9') {
    if (request.url.split('/').pop() === 'laserSystem') {
      response.statusCode = 200;
      response.end('Deleted successfully. Code: QT43dokTret');
    } else {
      response.statusCode = 200;
      response.end("LoL. Try Again11");
    }
  }

  //LEVEL 10
  else if (request.method === 'GET' &&  request.url.split('/')[1] === 'level10') {
    if ( request.url.split('/').pop() === 'getBXSX64FORMXT') {
      response.statusCode = 200;
      response.end(base64);
    } else {
      response.statusCode = 404;
      response.end("LoL. Try Again9");
    }
  }

  //LEVEL 11
  else if (request.method === 'POST' &&  request.url.split('/')[1] === 'level11') {
    request.on("data", function (chunk) {
      var reqXML = decodeURIComponent(chunk.toString());
      if (request.url.split('/').pop() === 'sendXml' && reqXML.replace(' ','') === "xml=<true>LevelPassed</true>") {
        response.statusCode = 200;
        response.end("QTamirrordec");
      } else {
        response.statusCode = 200;
        response.end("LoL. Try Again10");
      }
    });
  }


  //LEVEL 12
  else if (request.method === 'POST' &&  request.url.split('/')[1] === 'level12') {
    var pureJSON = {"Level": 12, "Status": "Passed"};
    request.on("data", function (chunk) {
      var reqJSON = decodeURIComponent(chunk.toString());
      if (request.url.split('/').pop() === 'sendJson' && JSON.stringify(JSON.parse(reqJSON)) === JSON.stringify(pureJSON)) {
        response.statusCode = 200;
        response.end('QTjunteRgiPtr');
      } else {
        response.statusCode = 200;
        response.end("LoL. Try Again12");
      }
    });
  }

  //LEVEL 13
  else if (request.method === 'GET' &&  request.url.split('/')[1] === 'level13') {
      if ( request.url.split('/').pop() === 're') {
        response.statusCode = 200;
        response.setHeader("Location", "/level13/re267J");
        response.setHeader("Set-Cookie", "quest=94jg772h7");
        response.end("Success");
      } else if (request.url.split('/').pop() === 're267J' && request.headers.cookie === "quest=94jg772h7") {
        response.statusCode = 200;
        response.setHeader("Location", "/level13/re302");
        response.setHeader("Set-Cookie", "quest=ghyttomne");
        response.end("Success2");
      } else if (request.url.split('/').pop() === 're302' && request.headers.cookie === "quest=ghyttomne") {
        response.statusCode = 200;
        response.end("Code: QT754hgf932j");
      } else {
        response.statusCode = 404;
        response.end("LoL. Try Again13");
      }
    }
  else {
      response.statusCode=404;
      response.end("we are doing something wrong");
    }
});

if (module.parent) { module.exports = server } else { 
  server.listen(process.env.PORT, process.env.HOST);
  console.log(`Server listening on http://${process.env.HOST}:${process.env.PORT}`)
  console.log(`App is running on http://${process.env.HOST}:${process.env.PORT}/home`)
}
