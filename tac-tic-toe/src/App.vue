
<template>
<div class="container">
  <div   v-bind:class="{hidden:local||online||puzzles}"> 
    <h2 > Welcome to TacticToe </h2>
    <button @click="setLocal()" >Local</button>
    <button @click="setOnline()" >Online</button>    
    
    <button @click="setPuzzle()" >Puzzles</button>
    <button @click="resetBoard()" >tutorial(coming soon)</button>
  </div>
  <div v-bind:class="{hidden:!online || onlineStart}">  
    <h1 v-bind:class="{hidden:!host || join}"> Code: {{gameCode}}</h1>
    <input v-bind:class="{hidden:!host || join}" type="checkbox" id="Timer" name="Timer" @click="emitTimer()"><label v-bind:class="{hidden:!host || join}" for="Timer">Timer</label>
    <button v-bind:class="{hidden:host || join}" @click="setOnlineNew()" >new game</button>    
    <button v-bind:class="{hidden:host || join}" @click="setJoin()" >join game</button>
    <input v-bind:class="{hidden:host || !join}" type="text" id="code">
    <button v-bind:class="{hidden:host || !join}" @click="setOnlineJoin()" >join game</button>    
    <button v-bind:class="{hidden:host || join}" @click="revokeOnline()" >Back</button>
    <button v-bind:class="{hidden:!host || join}" @click="revokeHost()" >Back</button>
    <button v-bind:class="{hidden:host || !join}" @click="revokeJoin()" >Back</button>
  </div>

  <div v-bind:class="{hidden:!puzzles || puzzleSelected || userPuzzle}">  
    <h1> Choose a puzzle</h1>
    <button @click="loadPuzzle('1')">Puzzle 1</button>
    <button @click="activateCustomPuzzle()">Custom Puzzle</button> 
    <button @click="revokePuzzle()" >Back</button>   
  </div>

  <div v-bind:class="{hidden:!userPuzzle}">  
    <h1>Enter puzzle code</h1>
    <input type="text" id="puzzleCode">
    <h1>Enter number of moves allowed</h1>
    <input type="text" id="puzzleMoves">
    <button @click="customPuzzle()" >Start</button> 
  </div>

  <div v-bind:class="{hidden:!local}">
    <h1 v-if="!complete">TacTic Toe</h1>
    <h2 id="winner" v-if="complete">Winner is {{winner}} </h2>
    <div class="game">
      <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1],canMove:allowed[bigIndex-1]}">    
        <div class="miniBoard">    
          <div @click="play(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1], lastMove:lastMove[bigIndex-1][index-1], impossible:impossible[bigIndex-1][index-1]}"  >{{board[bigIndex-1][index-1]}}</div>
        </div>  
        <div class="bigBoard squareOverlay">{{board[9][bigIndex-1]}}</div>
      </div>
    </div>
    <h1 v-if="xturn">X's Turn</h1>
    <h1 v-if="!xturn">O's Turn</h1>
    <button @click="undo()" >UNDO</button>

    <div class="tooltip">
      <button @click="writeToFile()"><span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
        Save Game
      </button>
    </div>
    <h2 v-if="tie"> Tie Game </h2>
    <button @click="resetBoard()" v-if="complete || tie">RESET</button>
    <button id="winner" v-if="!complete && viewBoard" @click="home()">Home</button>
    <div v-if="complete" class="win">
      <ul class="winMenu">
        <li class="winTitle">Winner is {{winner}}</li>
        <li class="winButton" @click="home()"> Home</li>
        <li class="winButton" @click="setViewBoardTrue()"> View Board</li>
      </ul>
    </div>

  </div>

  <div v-bind:class="{hidden:!online || !onlineStart}">
    <h1>TacTic Toe</h1>    
    <h1 v-if="spectator">you are a spectator</h1>
    <p  v-bind:class="{hidden:!timer}">Turn Time: {{ countDown }} seconds remaining!</p>    
    <div class="game">
      <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1],canMove:allowed[bigIndex-1]&&canGo}">    
        <div class="miniBoard">    
          <div @click="onlinePlay(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1], lastMove:lastMove[bigIndex-1][index-1], impossible:impossible[bigIndex-1][index-1]}"  >{{board[bigIndex-1][index-1]}}</div>
        </div>  
        <div class="bigBoard squareOverlay">{{board[9][bigIndex-1]}}</div>
      </div>    
    </div>
    <h1 v-if="xturn">X's Turn</h1>
    <h1 v-if="!xturn">O's Turn</h1>    
    <button @click="sendOnlineUndoRequest()" v-if="!sentUndo && !recievedUndo" >UNDO</button><button @click="acceptUndoRequest()" v-if="!sentUndo && recievedUndo" >Accept UNDO</button>
    <button id="winner" v-if="!complete && viewBoard" @click="home()">Home</button>
    <div v-if="complete" class="win">
      <ul class="winMenu">
        <li class="winTitle">Winner is {{winner}}</li>
        <li class="winButton" @click="home()"> Home</li>
        <li class="winButton" @click="setViewBoardTrue()"> View Board</li>
      </ul>
    </div>
    <h2 v-if="tie"> Tie Game </h2>
  </div>

<div v-bind:class="{hidden:!puzzles||!puzzleSelected}">
    <h3>Moves remaining: {{puzzleMovesRemaining}}</h3>
    <div class="game">
      <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1],canMove:allowed[bigIndex-1]}">    
        <div class="miniBoard">    
          <div @click="puzzlePlay(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1], lastMove:lastMove[bigIndex-1][index-1]}"  >{{board[bigIndex-1][index-1]}}</div>
        </div>  
        <div class="bigBoard squareOverlay">{{board[9][bigIndex-1]}}</div>
      </div>    
    </div>
    <h1 v-if="xturn">X's Turn</h1>
    <h1 v-if="!xturn">O's Turn</h1>
    <button @click="puzzleUndo()" v-if="!viewBoard">UNDO</button>
    <button id="winner" v-if="!complete && viewBoard" @click="homePuzzle()">Home</button>
    <div v-if="complete" class="win">
      <ul class="winMenu">
        <li class="winTitle"> Winner</li>
        <li class="winButton" @click="homePuzzle()"> Home</li>
        <li class="winButton" @click="setViewBoardTrue()"> View Board</li>
      </ul>
    </div>

  </div>

</div>
</template>
<script>
import io from 'socket.io-client'
const socket = io("https://serene-citadel-00320.herokuapp.com/")
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      local:false,online:false,

      board: [["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""]],

      occupied: [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],

      impossible:[[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],

      lastMove: [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],
      allowed:[true,true,true,true,true,true,true,true,true],
      full:[true,true,true,true,true,true,true,true,true],
      xturn: true,
      canGo: true,
      complete: false,
      winner: null,
      tie: false,

      moves: [],
      currentMove: 0,
      sentUndo:false,
      recievedUndo: false,

      spectator:false,
      puzzles:false,
      puzzleSelected:false,
      puzzleMovesRemaining:0,
      puzzleMoves:0,

      host:false,
      join:false,

      timer:false,

      tutorial:false,

      gameCode: null,
      onlineStart: false,
      countDown: 20,

      viewBoard: false,

      userPuzzle: false
      }
  },
  methods: {
    home(){
      this.local=false;this.online=false;   
      this.setViewBoardFalse();this.revokeOnline();this.revokeHost();this.revokeJoin();
      this.board= [["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""]];

      this.occupied= [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];

      this.impossible=[[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];

      this.lastMove= [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];
      this.allowed=[true,true,true,true,true,true,true,true,true];
      this.full=[true,true,true,true,true,true,true,true,true];
      this.xturn= true;
      this.canGo= true;
      this.complete= false;
      this.winner= null;
      this.tie= false;

      this.moves= [];
      this.currentMove= 0;
      this.sentUndo=false;
      this.recievedUndo= false;

      this.spectator=false;
      this.puzzles=false;
      this.puzzleSelected=false;
      this.puzzleMovesRemaining=0;
      this.puzzleMoves=0;

      this.timer=false;
      this.gameCode= null;
      this.onlineStart= false;
      this.countDown= 20;
    },
    homePuzzle(){
      this.home();
      this.setPuzzle();
    },
    play(bigIndex, index){
      if (this.occupied[bigIndex][index] || !this.allowed[bigIndex])
      {
        return//add null noise
      }
      //if (this.online){
        
        //socket.emit("play", { bigIndex:bigIndex, index:index});
      //}
      //console.log("BigIndex: "+bigIndex);
      //console.log("Index: "+index);      
      //console.log("current move: " + this.currentMove);
      this.draw(bigIndex, index);
    },
    puzzlePlay(bigIndex, index){
      if (this.occupied[bigIndex][index] || !this.allowed[bigIndex] || this.puzzleMovesRemaining < 1)
      {
        return//add null noise
      }
      //if (this.online){
        
        //socket.emit("play", { bigIndex:bigIndex, index:index});
      //}
      //console.log("BigIndex: "+bigIndex);
      //console.log("Index: "+index);      
      //console.log("current move: " + this.currentMove);
      this.puzzleMovesRemaining--;
      this.draw(bigIndex, index);
      this.processPuzzle();
    },
    onlinePlay(bigIndex, index){
      if (this.occupied[bigIndex][index] || !this.allowed[bigIndex] || !this.canGo)
      {
        return//add null noise
      }
      if (this.online && !this.spectator){
        //console.log(index);
        //console.log(bigIndex);
        socket.emit("play", { bigIndex:bigIndex, index:index});
      }
    },
    draw(bigIndex, index) {
      if(this.xturn) {//if is x's turn mark as x
        this.board[bigIndex][index]="X"
      } else {//if is o's turn mark as o
        this.board[bigIndex][index]="O"
      }
      this.occupied[bigIndex][index]=true
      this.xturn = !this.xturn
      let squareWon = this.calculateWin([bigIndex]);
      this.calculateTie();
      this.calculatePossible();
      //must move to selected miniboard
      for (let j = 0; j <= 8; j++){
        this.allowed[j]=false;
      }
      this.allowed[index]=true;
      this.lastMove =[[false,false,false,false,false,false,false,false,false],//reset where the last move was
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];
      this.lastMove[bigIndex][index] = true;
      if (!this.spectator)
      {
      this.canGo = !this.canGo;
      }
      this.moves[++this.currentMove] = {bigIndex:bigIndex, index:index, squareWon:squareWon};
      this.countDown = 20;
    },

    sendOnlineUndoRequest(){      
      this.sentUndo = true;
      socket.emit("undoRequest");
    },
    recieveOnlineUndoRequest(){
      this.recievedUndo = true;
    },
    acceptUndoRequest(){
      socket.emit("acceptUndoRequest");
    },
    puzzleUndo(){
        if(this.puzzleMovesRemaining < this.puzzleMoves)
        {
          this.puzzleMovesRemaining++;
          this.undo();
        }
    },
    undo(){
      this.recievedUndo = false;           
      this.sentUndo = false;
      if (this.currentMove > 0)
      {
        this.board[this.moves[this.currentMove].bigIndex][this.moves[this.currentMove].index]="";//reset space in miniboard
        this.occupied[this.moves[this.currentMove].bigIndex][this.moves[this.currentMove].index]=false;
        this.xturn = !this.xturn;
        if (this.moves[this.currentMove].squareWon)
        {
          this.board[9][this.moves[this.currentMove].bigIndex] = "";
        }
        this.moves[this.currentMove] = {};//reset space in moves
        this.lastMove =[[false,false,false,false,false,false,false,false,false],//reset where the last move was
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false],
                  [false,false,false,false,false,false,false,false,false]];
        if (this.currentMove > 1){
            for (let j = 0; j <= 8; j++){
              this.allowed[j]=false;
            }
          this.allowed[this.moves[this.currentMove-1].index]=true; 
        }
        else {
          for (let j = 0; j <= 8; j++){
              this.allowed[j]=true;
            }
        }    
        if (--this.currentMove > 0){
          this.lastMove[this.moves[this.currentMove].bigIndex][this.moves[this.currentMove].index] = true; 
        }      
        this.canGo = !this.canGo;

        for (let j = 0; j <= 8; j++){
          for (let i = 0; i <= 8; i++){
            if (this.impossible[j][i])
            {
              this.occupied[j][i]=false;
            }
          }
        }

        this.impossible = [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];
        this.calculatePossible();
        //this.currentMove--;
      }
    },
      //setTimeout(myTimeout1, 2000) 
      //if not complete
      //if reaches 20 set winner
      //send out winner emit
    countDownTimer() {
      //console.log("timer")
      this.timer = true;
      if(this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
        }, 1000)
      }
      else if (this.countDown < 1){
        console.log("time ran out");
        if (this.xturn){
        socket.emit("win", "X")
        }
        else{
        socket.emit("win", "O")
        }
      }
    },

    setWin(winner){
        this.complete = true;
        this.winner = winner;
    },

  calculateWin(bigIndex) {
    //console.log(bigIndex);
    if (bigIndex < 9)
    {
      if (this.board[9][bigIndex] != "")//if this board has already been won escape
      {
        return false;
      }
    }
    //console.log("allowed");
    const WIN_CONDITIONS = [
      [0,1,2], [3,4,5], [6,7,8], //rows
      [0,3,6], [1,4,7], [2,5,8],//columns
      [0,4,8], [2,4,6] //diagonals
    ];
    for (let i = 0; i < WIN_CONDITIONS.length; i++){
      let first = WIN_CONDITIONS[i][0];      
      let second = WIN_CONDITIONS[i][1];
      let third = WIN_CONDITIONS[i][2];
      if(this.board[bigIndex][first]==this.board[bigIndex][second] && this.board[bigIndex][first] == this.board[bigIndex][third] && this.board[bigIndex][first] != "")
      {
        //console.log(bigIndex);
        if (bigIndex == 9)
        {
          this.complete = true;
          this.winner = this.board[bigIndex][first];     
          this.canGo= false;   
        }
        else{
          this.board[9][bigIndex] = this.board[bigIndex][first];
          this.calculateWin("9");
          return true;          
        }
      }
    }
    //console.log(WIN_CONDITIONS);
    return false;
  },
  calculatePossible()
  {
    if (this.puzzles == true)
    {
      return
    }
    var possible;
    var same =  false;
    for (let j = 0; j <= 8; j++){
      possible = false;
      same =  false;
      for (let i = 0; i <= 8; i++){
          if (this.occupied[j][i] == false)
          {
            if (i!=j)
            {
              possible = true;
            }
            else
            {
              same = true;
            }
          }
      }
      if (!possible && same == true)
      {
        this.occupied[j][j] = true;
        this.impossible[j][j] = true;
      }
      if (!possible)
      {
        for (let i = 0; i <= 8; i++){
          if (this.occupied[i][j] == false)
          {
            this.occupied[i][j] = true;
            this.impossible[i][j] = true;
          }
      }
      }
    }
  },
  resetBoard() {
    for (let i = 0; i <= 8; i++){
      for (let j = 0; j <= 8; j++){
        this.board[i][j] = "";
        this.occupied[i][j] = false;
      }
    }    
    this.complete = false;
    this.winner = "";
    this.tie = false;
    //console.log("Board Reset")
  },
  calculateTie() {// go back and move this into calc win to improve effcienecy
    for (let i = 0; i <= 8; i++){
      for (let j = 0; j <= 8; j++){
      if (this.board[i][j] == ""){///////////////////change to
        return
      }
      }
    }    
      this.tie = true;
  },
  setLocal(){
    this.local=true;
  },
  setPuzzle(){
    this.puzzles=true;
  },
  revokePuzzle(){
    this.puzzles=false;
  },
  
  loadPuzzle(puzzleNum){
    
    this.puzzleSelected=true;
    if (puzzleNum == '1')
    {      
    this.puzzleMoves = 1;
    this.puzzleMovesRemaining = 1;
    var movelog = [[4,4],[4,0],[0,8],[8,1],[1,5],[5,7],[7,3],[3,6],[6,3],[3,4],[4,1],[1,2],[2,4],[4,7],[7,5],[5,4],[4,2],[2,1],[1,3],[3,2],[2,0],[0,0],[0,2],[2,8],[8,6],[6,2],[2,2],[2,6],[6,6],[6,8],[8,3],[3,3],[3,8],[8,4],[4,3],[3,0],[0,3],[3,5],[5,2],[2,5],[5,8],[8,0],[0,5],[5,1],[1,4],[4,6],[6,0],[0,7],[7,7],[7,0],[0,6],[6,5],[5,3],[3,7],[7,2],[2,3],[3,1],[1,8],[8,5],[5,5],[5,6],[6,1],[1,7],[7,1],[1,6],[6,7],[7,6],[6,4],[4,5],[5,0],[0,1],[1,0],[0,4],[4,8],[8,2],[2,7]];
    }
     this.displayPuzzle(movelog);
  },

  displayPuzzle(moveLog){
    console.log(moveLog.length);
    console.log(moveLog[1][1]);
    for (let i = 0; i <= moveLog.length-1; i++){
        console.log("adding move");
        this.draw(moveLog[i][0],moveLog[i][1]);
      }
  },

  processPuzzle(){

    //if the person does not win in the set amount of moves, reset them
  },
  activateCustomPuzzle(){
    this.userPuzzle = true;
  },
  customPuzzle(){
    let data = document.getElementById("puzzleCode").value;//check this works at all
    let puzzleMoves = parseInt(document.getElementById("puzzleMoves").value);//check this is an int

    const myArray = data.split(",").map(Number); 
    console.log('0');
    console.log(data);
    console.log(myArray);

    if (myArray.every(function(element) {return typeof element === 'number';})){
      if(Number.isInteger(puzzleMoves) && (myArray.length % 2 == 0)){
        console.log('0');
        this.puzzleMoves = puzzleMoves;
        this.puzzleMovesRemaining = puzzleMoves;
        let moveLog = [];
        for (let i = 0; i <= (myArray.length/2) -1; i++){
          moveLog[i] = [myArray[i*2],myArray[i*2 + 1]];
        }       
        this.puzzleSelected=true;
        this.userPuzzle = false;
        console.log(moveLog);
        this.displayPuzzle(moveLog);
      }
    }
        
  },

  writeToFile(){
    var output = [];
    var index; var bigIndex; 
    for (let i = 0; i < this.moves.length-1; i++)
    {      
      bigIndex = this.moves[i+1].bigIndex;      
      index = this.moves[i+1].index;
      output[i] = [[bigIndex],[index]];
      console.log(index);
      console.log(bigIndex);
    }
    navigator.clipboard.writeText(output);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied"
  },
  setOnline(){   
    console.log("online") 
    this.online=true;
  },
  setHost(){
    this.host =true;
  },
  revokeHost(){
    this.host =false;
  },
  setJoin(){
    this.join =true;
  },
  revokeJoin(){
    this.join =false;
  },
  revokeOnline(){    
    this.online=false;
  },
  emitTimer(){
    socket.emit("timer", document.getElementById("Timer").checked);
    console.log("timer value emitted: "+document.getElementById("Timer").checked)
  },
  setOnlineNew(){
    this.setHost();
    socket.emit("newGame"); 
    console.log("Newgame");
    this.canGo = true; 
    //this.onlineStart = true;
  },
  setOnlineJoin(){
    var code = document.getElementById("code").value;
    if (code != "")
    {
      this.canGo = false;
      socket.emit("joinGame", code);   
      console.log("sent join request: " + code); 
      //this.onlineStart = true;
    }
  },
  setGameCode(gc){
    this.gameCode = gc;
  },

  setViewBoardTrue(){
    this.complete = false;
    this.viewBoard = true;
  },
  setViewBoardFalse(){
    this.viewBoard = false;
  },
  
},
  created() {
    //if (this.online == true){
    socket.on("play",(data) => {
      //console.log("Play ", data.bigIndex);
      //console.log("Play ", data.index);
      //console.log("Play");
      this.draw(data.bigIndex, data.index);
    });      

    socket.on("gameCode", (data) => {
      this.gameCode = data;
      this.setGameCode(this.gameCode);
      console.log("Gamecode returned: ", this.gameCode);
    });

    socket.on("start",(data) => {
      this.onlineStart = data.start; 
      console.log("data.timer = "+data.timer)
      if(data.timer){    
        this.countDownTimer();
      }
      console.log("start game");
    });

    socket.on("undoRequest",() => {
      this.recieveOnlineUndoRequest();
    });

    socket.on("undo",() => {
      this.undo();
    });

    socket.on("win",(data) => {
      this.setWin(data);
    });

    socket.on("spectator",(data) => {
      this.onlineStart= true;
      this.spectator = true;
      console.log(data[0]);
      for (let i = 1; i <= data[0]-1; i++){
          console.log("spectating move: "+data[i][0]+data[i][1]);
          this.draw(data[i][0],data[i][1]);
      }
    });

    socket.on("Print", function(data){
      console.log(data);
    })
  }
  //}

  }
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eee;
}

h1 {
  font-size: 5rem;
}

h2 {
  font-size: 2rem;
}

.game {
  display: grid;
  width: 300px;
  height: 300px;
  grid-template-columns: auto auto auto;
}
.miniBoard {
  display: grid;
  width: 100px;
  height: 100px;
  grid-template-columns: auto auto auto;  
  z-index:2;
}

.bigBoard {
  font-size: 75px;
  position: absolute;
  z-index:3;
  opacity: 0.5;
}

.square {
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  border: 3px solid black;
}

.squareOverlay{
  pointer-events: none;
}

.miniSquare {
  display: flex;  
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  border: 3px solid black;
}

.miniSquare:hover {
  cursor: pointer;
  background: #0ff30f;
}

.occupied:hover {
  background: #ff3a3a;
}

.canMove  {
  background: #dbf0dc;
}

.impossible {
  background: #393e3e;
}


.lastMove {
  background: #89CFF0;
  opacity: 0.5;
}

.win {
  background: #0ff30f;
  display:flex;
  align-items: center;
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  padding: 100px;
  z-index: 4;
  transition: 1s;
  opacity: 1;
  transition: background-color 1s linear;
}

.winMenu {
  margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
}

.winButtons{
  display: flex;
  flex-direction: column;
  list-style-type: none;
}

.winButton{
  position: relative;
  display: inline-flex;
  font-weight: bold;
  font-size: 5rem;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;  
}
.winTitle{
  position: relative;
  display: inline-flex;
  font-weight: bold;
  font-size: 8rem;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
}

.winButton:after{
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 5px;
  display: inline-flex;
  background: #fff;
  transition: 0.3s;
}

.winButton:hover:after{
  width: 100%;
}

.win:hover {
  background: #0ff30f;
}

#square_0,
#square_1,
#square_2 {
  border-top: none;
}

#square_0,
#square_3,
#square_6 {
  border-left: none;
}

#square_6,
#square_7,
#square_8 {
  border-bottom: none;
}

#square_2,
#square_5,
#square_8 {
  border-right: none;
}

button {
  outline: none;
  border: 4px solid green;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  background: none;
  transition: all 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background: green;
  color: white;
}

.playerWin {
  color: green;
}

.computerWin {
  color: red;
}

.draw {
  color: orangered;
}
.hidden{
  display:none;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}


@media only screen and (max-width: 600px) {

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5em;
  }

  h2 {
    margin-top: 1em;
    font-size: 1.3rem;
  }
}
</style>
