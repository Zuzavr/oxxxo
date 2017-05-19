"use strict";

var game = { 
  oxo : document.getElementById('oxo'),
  board : document.getElementById('gameBoard'),
  menu : document.getElementById('gameMenu'),
  score : document.getElementById('gameScore'),
  scoreMessage : document.getElementById('gameScoreMessage'),
  
  turn : null,
  message : null,
  
  backMenu : document.getElementById('gameMenu').innerHTML,
  backBoard : document.getElementById('gameBoard').innerHTML,
  backScore : document.getElementById('gameScore').innerHTML,
  
  size : null,
  mode : null,
  fTurn : null,
  mark : null,
  level : null,
  flag : false,
  
  p1score : 0,
  p2score : 0,
  
  hArr : [],
  vArr : [],
  dtpArr : [],
  dtnArr : [],
  dlArr : [],
  drArr : [],
  
  hArrImg : [],
  vArrImg : [],
  dtpArrImg : [],
  dtnArrImg : [],
  dlArrImg : [],
  drArrImg : [],
    
  cArr : [],
  
  click1 : new Audio(),
  click2 : new Audio(),
  youW : new Audio(),
  comW : new Audio(),
  nobW : new Audio(),
  
  myOpt : {
    src : 'img/enter.png',
    width : '100',
    height : '100',
  },  
  
  insert(options) {
    this.board.innerHTML = '';
    this.myOpt.width = this.myOpt.height = (this.board.clientWidth / this.size
    - 5);
    
    for (let i = 0; i < this.size; i++) {
      this.board.append( document.createElement('tr') );
      
      for (let j = 0; j < this.size; j++) {
        this.board.rows[i].append( document.createElement('td') );
        let insImg = new Image();
        
        for (let key in options) {
          insImg[key] = options[key];
        };
        
        insImg.dataset.flag = 'z';
        this.board.rows[i].cells[j].append(insImg);
        this.board.rows[i].cells[j].align = 'center';
      };
    };
  },
  
  action(e) {
    if (e.target.name == 'start') {
      game.size = + document.getElementsByName('fieldSize')[0].value;
      game.mode = + document.getElementsByName('gameMode')[0].value;
      game.fTurn = + document.getElementsByName('firstTurn')[0].value;
      game.mark = + document.getElementsByName('xo')[0].value;
      game.level = + document.getElementsByName('level')[0].value;
      
      let but1 = document.getElementsByName('start')[0];
      let but2 = document.createElement('button');
      but2.name = 'continue';
      but2.textContent = 'CONTINUE/RESET';
      let but3 = document.createElement('button');
      but3.name = 'exit';
      but3.textContent = 'EXIT';
      
      let span = document.createElement('span');
      span.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'; 
      
      but1.after(but2, span, but3);
      but1.remove(); 
      
      game.menu.innerHTML = '<tbody><tr><td id="gameMessage" align="center">\
      THE GAME STARTED</td></tr></tbody>';
      game.message = document.getElementById('gameMessage');
      if (game.mode) {
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbspComputer'; 
      } else {
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbsp2Player';          
      }  
      
      game.turn = game.mark;
      game.insert(game.myOpt);
      if (game.fTurn) {
        game.turn++;
        if (game.mode) {
          game.autoTurn();    
        };    
      };     
    };
    
    if (e.target.name == 'exit') {
      game.turn = null;
      game.message = null;
      
      game.board.innerHTML = game.backBoard;
      game.menu.innerHTML = game.backMenu;
      game.score.innerHTML = game.backScore;
      
      game.scoreMessage = document.getElementById('gameScoreMessage'); 
      
      game.size = null;
      game.mode = null;
      game.fTurn = null;
      game.mark = null;
      game.level = null;
      game.flag = false;
      
      game.p1score = 0;
      game.p2score = 0;
      
      game.hArr = [];
      game.vArr = [];
      game.dtpArr = [];
      game.dtnArr = [];
      game.dlArr = [];
      game.drArr = [];
      
      game.hArrImg = [];
      game.vArrImg = [];
      game.dtpArrImg = [];
      game.dtnArrImg = [];
      game.dlArrImg = [];
      game.drArrImg = [];
      
      game.cArr = [];
    }; 
    
    if (e.target.name == 'continue') {
      game.message.textContent = 'THE GAME STARTED';
      game.flag = false;

      for (let i = 0; i < game.size; i++) {
        for (let j = 0; j < game.size; j++) {
          game.board.rows[i].cells[j].children[0].src = 'img/enter.png';
          game.board.rows[i].cells[j].children[0].dataset.flag = 'z';
          game.board.rows[i].cells[j].style.backgroundColor = '#80FABF';
        };
      };
      game.turn = game.mark;
      if (game.fTurn) {
        game.turn++;
        if (game.mode) {
          game.autoTurn();    
        };    
      }; 
    }; 
  
    if (e.target.dataset.flag == 'z') {
      if (game.flag) return;
      if (game.turn % 2) { 
        game.click1.play();
        e.target.src = 'img/krist.png';
        e.target.dataset.flag = 'x';
        e.target.parentNode.style.backgroundColor = '#00BFFF';
      } else {
        game.click2.play();
        e.target.src = 'img/null.png'; 
        e.target.dataset.flag = 'o';
        e.target.parentNode.style.backgroundColor = '#F5F512';
      }
      game.calculate();
      game.turn++;
      if (game.mode) game.autoTurn();
    };
  },
  
  calculate() {
    function calcFun(item, i, arr) {
      let posWin = 0;
      let prev = null;
      if (item.indexOf('xxxxx') + 1) {
        win = '1';
        for (let j = 0; j < 5; j++){
          arr.linkImg[i][ item.indexOf('xxxxx') + j 
          ].parentElement.style.backgroundColor = '#ED6F1B';
        };
      };
      if (item.indexOf('ooooo') + 1) {
        win = '2';
        for (let j = 0; j < 5; j++){
          arr.linkImg[i][ item.indexOf('ooooo') + j 
          ].parentElement.style.backgroundColor = '#ED6F1B';
        };
      };
      
      for (let j = 0; j < item.length; j++) {
        
        if (item[j] == 'z') {
          posWin++;
        } else if (prev) {
            
          if ( prev == item[j] ) {
            posWin++;  
          } else {
            posWin = 1;
            prev = item[j];
          }; 
          
        } else {
          posWin++;
          prev = item[j]; 
        };
        
        if (posWin >= 5) notWin += 1; 
        
      }; 
    }
    
    let temp = null;
    let win = null;
    let notWin = 0; 
    
    this.hArr.linkImg = this.hArrImg;
    this.vArr.linkImg = this.vArrImg;
    this.dtpArr.linkImg = this.dtpArrImg;
    this.dtnArr.linkImg = this.dtnArrImg;
    this.dlArr.linkImg = this.dlArrImg;
    this.drArr.linkImg = this.drArrImg;    
    
    for (let i = 0; i < this.size; i++) {
      this.hArr[i] = '';
      this.hArrImg[i] = [];
      
      this.vArr[i] = '';
      this.vArrImg[i] = [];
            
      if ( (this.size - i) >= 5) {
        this.dtpArr[i] = '';
        this.dtnArr[i] = '';
        this.dlArr[i] = '';
        this.drArr[i] = '';
        
        this.dtpArrImg[i] = [];
        this.dtnArrImg[i] = [];
        this.dlArrImg[i] = [];
        this.drArrImg[i] = [];
      };
      
      for (let j = 0; j < this.size; j++) {
        this.hArr[i] += this.board.rows[i].cells[j].children[0].dataset.flag;
        this.vArr[i] += this.board.rows[j].cells[i].children[0].dataset.flag;
        
        this.hArrImg[i].push( this.board.rows[i].cells[j].children[0] );
        this.vArrImg[i].push( this.board.rows[j].cells[i].children[0] );
        
        if ( (this.size - i) >= 5) {
          temp = this.board.rows[j].cells[j + i];
          if (temp) { 
            this.dtpArr[i] += temp.children[0].dataset.flag;
            this.dtpArrImg[i].push( temp.children[0] );          
          };
          
          temp = this.board.rows[j].cells[this.size - j - i - 1];
          if (temp) {
            this.dtnArr[i] += temp.children[0].dataset.flag;
            this.dtnArrImg[i].push( temp.children[0] );          
          }; 
        
          temp = this.board.rows[j + i];
          if (temp) {
            this.dlArr[i] += temp.cells[j].children[0].dataset.flag;
            this.dlArrImg[i].push( temp.cells[j].children[0] );           
          };
          
          temp = this.board.rows[j + i];
          if (temp) {
            this.drArr[i] += temp.cells[this.size - j 
            - 1].children[0].dataset.flag; 
            this.drArrImg[i].push( temp.cells[this.size - j - 1].children[0] );
          };
        };
      };
    };
    this.dlArr[0] = '';
    this.drArr[0] = '';
              
    this.hArr.forEach(calcFun); 
    this.vArr.forEach(calcFun);
    this.dtpArr.forEach(calcFun);
    this.dtnArr.forEach(calcFun);
    this.dlArr.forEach(calcFun);
    this.drArr.forEach(calcFun);
    
    if (notWin && ( ! win) ) return;
    
    this.flag = true;
    if ( ( ! notWin) && ( ! win) ) {
      game.nobW.play();
      game.message.textContent = 'NOBODY WON !!!';
      
      for (let i = 0; i < game.size; i++) {
        for (let j = 0; j < game.size; j++) {
          if (game.board.rows[i].cells[j].children[0].dataset.flag == 'z') {
            game.board.rows[i].cells[j].style.backgroundColor = '#ED6F1B';
          };
        };
      };
      
    };
    if (win == game.mark) {
      game.youW.play();
      game.message.textContent = '1 PLAYER WON !!!';
      game.p1score += 1;
      
      if (game.mode) {
        
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbspComputer'; 
         
      } else {
        
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbsp2Player';
        
      };
      
    };
    if (win && (win != game.mark) ) {
      game.p2score += 1;
      if (game.mode) {
        game.comW.play();
        game.message.textContent = 'COMPUTER WON !!!';
        
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbspComputer'; 
         
      } else {
        game.youW.play();
        game.message.textContent = '2 PLAYER WON !!!';
        
        game.scoreMessage.innerHTML = '1Player&nbsp&nbsp&nbsp' 
        + game.p1score + ' : ' + game.p2score + '&nbsp&nbsp&nbsp2Player';
        
      };
    }; 
  },
  
  autoTurn() {
    if (game.flag) return;
    game.cArr = [];
    
    let tempR = null; 
    let tempC = null;
    let numT = null;
    
    if (this.turn % 2) {
        
      if ( this.isTurn('zxxxx', 'xxxxz', 'xxzxx', 'xzxxx', 'xxxzx', 'n', 'n', 
                       4, 'x') ) {
      } else if ( this.isTurn('zoooo', 'ooooz', 'oozoo', 'ozooo', 'ooozo', 'n', 
                              'n', 4, 'o') ) { 
      } else if ( this.isTurn('zxxx', 'xxxz', 'n', 'n', 'n', 'n', 'xzxzxzx', 
                              3, 'x') ) {
      } else if ( this.isTurn('zooo', 'oooz', 'n', 'n', 'n', 'n', 'ozozozo', 
                              3, 'o') ) {            
      } else if ( this.isTurn('zxx', 'xxz', 'n', 'n', 'n', 'xzx', 'n', 2, 
                              'x') ) {
      } else if ( (game.level != 1) && 
      this.isTurn('zoo', 'ooz', 'n', 'n', 'n', 'ozo', 'n', 2, 'o') ) {      
      } else if ( this.isTurn('zx', 'xz', 'n', 'n', 'n', 'n', 'n', 1, 'x') ) {
      } else {
          
        tempR = Math.floor( Math.random() * this.size );
        tempC = Math.floor( Math.random() * this.size );
        while (this.board.rows[tempR].cells[tempC].children[0
        ].dataset.flag != 'z') {
          tempR = Math.floor( Math.random() * this.size );
          tempC = Math.floor( Math.random() * this.size ); 
        };
        game.cArr.push( this.board.rows[tempR].cells[tempC].children[0] ); 
      };
      
    } else {
        
      if ( this.isTurn('zoooo', 'ooooz', 'oozoo', 'ozooo', 'ooozo', 'n', 'n', 
                       4, 'o') ) {
      } else if ( this.isTurn('zxxxx', 'xxxxz', 'xxzxx', 'xzxxx', 'xxxzx', 'n', 
                              'n', 4, 'x') ) { 
      } else if ( this.isTurn('zooo', 'oooz', 'n', 'n', 'n', 'n', 'ozozozo', 
                              3, 'o') ) {
      } else if ( this.isTurn('zxxx', 'xxxz', 'n', 'n', 'n', 'n', 'xzxzxzx', 
                              3, 'x') ) {            
      } else if ( this.isTurn('zoo', 'ooz', 'n', 'n', 'n', 'ozo', 'n', 2, 
                              'o') ) {
      } else if ( (game.level != 1) && 
      this.isTurn('zxx', 'xxz', 'n', 'n', 'n', 'xzx', 'n', 2, 'x') ) {      
      } else if ( this.isTurn('zo', 'oz', 'n', 'n', 'n', 'n', 'n', 1, 'o') ) {
      } else {
          
        tempR = Math.floor( Math.random() * this.size );
        tempC = Math.floor( Math.random() * this.size );
        while (this.board.rows[tempR].cells[tempC].children[0
        ].dataset.flag != 'z') {
          tempR = Math.floor( Math.random() * this.size );
          tempC = Math.floor( Math.random() * this.size ); 
        };
        game.cArr.push( this.board.rows[tempR].cells[tempC].children[0] );
      };        
    };
    
    numT = Math.floor( Math.random() * game.cArr.length);
    if (game.level != 3) numT = 0; 
    
    if (this.turn % 2) {
      game.flag = true;
      setTimeout( function() {
        game.click1.play();
        game.cArr[numT].src = 'img/krist.png';
        game.cArr[numT].dataset.flag = 'x';
        game.cArr[numT].parentNode.style.backgroundColor = '#00BFFF';
        game.flag = false;
        game.calculate();
      }, 500);
      
    } else {
      game.flag = true;
      setTimeout( function() {
        game.click2.play();
        game.cArr[numT].src = 'img/null.png';
        game.cArr[numT].dataset.flag = 'o';
        game.cArr[numT].parentNode.style.backgroundColor = '#F5F512';
        game.flag = false;
        game.calculate();
      }, 500);   
    };
    
    game.turn++;  
  },
  
  isTurn(str1, str2, str3, str4, str5, str6, str7, num, token) {
    let flag = false; 
    
    function calcFun(item, i, arr) {
      function posFin (str, item, token, pos) {
        if (game.level != 3) return true;
        let rise = 0;
        
        for (let i = pos - 1; i >= 0; i--) {
          if ( (item[i] != 'z') && (item[i] != token) ) break;
          rise++;
        };  
        
        for (let i = pos + str.length; i < item.length; i++) {
          if ( (item[i] != 'z') && (item[i] != token) ) break;
          rise++;
        };
        if (rise + str.length >= 5) return true; 
      }
      
      let startN = 0;
      while (item.indexOf(str1, startN) + 1) {
        if ( posFin(str1, item, token, item.indexOf(str1, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str1, startN) ] );
          flag = true;
        };
        startN = item.indexOf(str1, startN) + 1;
      };
      
      startN = 0;
      
      while (item.indexOf(str2, startN) + 1) {
        if ( posFin(str2, item, token, item.indexOf(str2, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str2, startN) + num ] );
          flag = true;
        };
        startN = item.indexOf(str2, startN) + 1;
      }; 
      
      if (game.level == 1) return;
      
      startN = 0;
      
      while (item.indexOf(str3, startN) + 1) {
        if ( posFin(str3, item, token, item.indexOf(str3, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str3, startN) + 2 ] );
          flag = true;
        };
        startN = item.indexOf(str3, startN) + 1;
      };
      
      startN = 0;
      
      while (item.indexOf(str4, startN) + 1) {
        if ( posFin(str4, item, token, item.indexOf(str4, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str4, startN) + 1 ] );
          flag = true;
        };
        startN = item.indexOf(str4, startN) + 1; 
      };
      
      startN = 0;
      
      while (item.indexOf(str5, startN) + 1) {
        if ( posFin(str5, item, token, item.indexOf(str5, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str5, startN) + 3 ] );
          flag = true;
        };
        startN = item.indexOf(str5, startN) + 1; 
      };
      
      if (game.level != 3) return;
      
      startN = 0;
      
      while (item.indexOf(str6, startN) + 1) {
        if ( posFin(str6, item, token, item.indexOf(str6, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str6, startN) + 1 ] );
          flag = true;
        };
        startN = item.indexOf(str6, startN) + 1;
      };
      
      startN = 0;
      
      while (item.indexOf(str7, startN) + 1) {
        if ( posFin(str7, item, token, item.indexOf(str7, startN) ) ) {
          game.cArr.push( arr.linkImg[i][ item.indexOf(str7, startN) + 3 ] );
          flag = true;
        };
        startN = item.indexOf(str7, startN) + 1;
      };
    }
    
    this.hArr.forEach(calcFun); 
    
    this.vArr.forEach(calcFun);
    
    this.dtpArr.forEach(calcFun);
    
    this.dtnArr.forEach(calcFun);
    
    this.dlArr.forEach(calcFun);
    
    this.drArr.forEach(calcFun);
    if (flag) return true;
  }
};

game.oxo.addEventListener('click', game.action);
game.click1.src = 'audio/click1.wav';
game.click2.src = 'audio/click2.wav';
game.youW.src = 'audio/youW.mp3';
game.comW.src = 'audio/comW.wav';
game.nobW.src = 'audio/nobW.wav';
