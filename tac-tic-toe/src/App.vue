
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
    <button @click="loadPuzzle(1)">Puzzle 01</button>
    <button @click="loadPuzzle(2)">Puzzle 02</button>
    <button @click="loadPuzzle(3)">Puzzle 03</button>
    <button @click="loadPuzzle(4)">Puzzle 04</button>
    <button @click="loadPuzzle(5)">Puzzle 05</button>
    <button @click="loadPuzzle(6)">Puzzle 06</button>    
    <button @click="loadPuzzle(7)">Puzzle 07</button>
    <button @click="loadPuzzle(8)">Puzzle 08</button>
    <button @click="loadPuzzle(9)">Puzzle 09</button>
    <button @click="loadPuzzle(10)">Puzzle 10</button>
    <br> <br>
    <button @click="loadPuzzle(11)">Puzzle 11</button>
    <button @click="loadPuzzle(12)">Puzzle 12</button>
    <button @click="loadPuzzle(13)">Puzzle 13</button>
    <button @click="loadPuzzle(14)">Puzzle 14</button>
    <button @click="loadPuzzle(15)">Puzzle 15</button>    
    <button @click="loadPuzzle(16)">Puzzle 16</button>
    <button @click="loadPuzzle(17)">Puzzle 17</button>
    <button @click="loadPuzzle(18)">Puzzle 18</button>
    <button @click="loadPuzzle(19)">Puzzle 19</button>
    <button @click="loadPuzzle(20)">Puzzle 20</button>
    <br> <br>
    <button @click="loadPuzzle(21)">Puzzle 21</button>
    <button @click="loadPuzzle(22)">Puzzle 22</button>
    <button @click="loadPuzzle(23)">Puzzle 23</button>
    <button @click="loadPuzzle(24)">Puzzle 24</button>
    <button @click="loadPuzzle(25)">Puzzle 25</button>
    <button @click="loadPuzzle(26)">Puzzle 26</button>
    <button @click="loadPuzzle(27)">Puzzle 27</button>
    <button @click="loadPuzzle(28)">Puzzle 28</button>
    <button @click="loadPuzzle(29)">Puzzle 29</button>
    <button @click="loadPuzzle(30)">Puzzle 30</button>
    <br> <br>
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
    <h1 v-if="host">You are X</h1>
    <h1 v-if="join">You are O</h1>  
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
    <div v-if="!complete && viewBoard" class="tooltip">
      <button @click="writeToFile()"><span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
        Save Game
      </button>
    </div>
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
    <button @click="homePuzzle()" v-if="!viewBoard">HOME</button>
    <button id="winner" v-if="!complete && viewBoard" @click="homePuzzle()">Home</button>
    <div v-if="complete" class="win">
      <ul class="winMenu">
        <li class="winTitle"> Winner</li>
        <li v-if="currentPuzzle !== 30" class="winButton" @click="nextPuzzle()"> Next Puzzle</li>
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
      //variables to initilize menu choices
      local:false, //toggle the game to local mode
      online:false, //toggle the game to online mode
      puzzles:false, //toggle the game to puzzle mode
      puzzleSelected:false,
      puzzleMovesRemaining:0,
      puzzleMoves:0,
      currentPuzzle:0,
      host:false,
      join:false,
      timer:false,
      tutorial:false,    
      userPuzzle: false,

      board: [["","","","","","","","",""],//Variable to initalize an empty board
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""]],

      occupied: [[false,false,false,false,false,false,false,false,false],//displays whether each square contains a piece
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],

      impossible:[[false,false,false,false,false,false,false,false,false],//displays whether a move is possible or not
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],

      lastMove: [[false,false,false,false,false,false,false,false,false],//displays the last move
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],
      allowed:[true,true,true,true,true,true,true,true,true],//displays which boards moves are allowed on
      full:[true,true,true,true,true,true,true,true,true],//
      xturn: true,//stores whether or not it is x's turn
      canGo: true,//stores if the current user can go
      complete: false,//stores the game end state
      winner: null,
      tie: false,

      moves: [],
      currentMove: 0,
      sentUndo:false,
      recievedUndo: false,

      spectator:false,
      

      gameCode: null,
      onlineStart: false,
      countDown: 20,

      viewBoard: false
      }
  },
  methods: {
    home(){//resets the game board and resets variables to display the home screen
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
    homePuzzle(){//resets game board and returns to puzzle screen
      this.home();
      this.setPuzzle();
    },
    play(bigIndex, index){//checks if move is valid then draws it
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
    puzzlePlay(bigIndex, index){//checks if move is vaid then draws it
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
    onlinePlay(bigIndex, index){//checks if move is valid then sends it to the server
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
    draw(bigIndex, index) {//draw inputed move on the board and adjust variables to reflect
      if(this.xturn) {//if is x's turn mark as x
        this.board[bigIndex][index]="X"
      } else {//if is o's turn mark as o
        this.board[bigIndex][index]="O"
      }
      this.occupied[bigIndex][index]=true
      this.xturn = !this.xturn
      let squareWon = this.calculateWin([bigIndex]);//check if this move has won a board
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

    sendOnlineUndoRequest(){ //send the server an undo message     
      this.sentUndo = true;
      socket.emit("undoRequest");
    },
    recieveOnlineUndoRequest(){ //display to the player that an undo request has been recieved
      this.recievedUndo = true;
    },
    acceptUndoRequest(){//send the server an accepted undo message
      socket.emit("acceptUndoRequest");
    },
    puzzleUndo(){//undo moves up to the start of the puzzle
        if(this.puzzleMovesRemaining < this.puzzleMoves)
        {
          this.puzzleMovesRemaining++;
          this.undo();
        }
    },
    undo(){//reverse the board and associated variables to the state they were in one move ago
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
    countDownTimer() {//reduce the countdown variable display by one every second
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

    setWin(winner){//set the winner as the inputed piece
        this.complete = true;
        this.winner = winner;
    },

  calculateWin(bigIndex) {//check if inputed square contains a win condition
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
      if(this.board[bigIndex][first]==this.board[bigIndex][second] && this.board[bigIndex][first] == this.board[bigIndex][third] && this.board[bigIndex][first] != "")//if a win condition has been met
      {
        //console.log(bigIndex);
        if (bigIndex == 9)//if there is a win on the big board
        {
          this.complete = true;
          this.winner = this.board[bigIndex][first];     
          this.canGo= false;   
        }
        else{
          this.board[9][bigIndex] = this.board[bigIndex][first];//check if winning this board has won the game
          this.calculateWin("9");
          return true;          
        }
      }
    }
    //console.log(WIN_CONDITIONS);
    return false;
  },
  calculatePossible()//check if there are any deadlock states on the board and black them out
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
  resetBoard() {//reset the board
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
  calculateTie() {//if the board is full and there is no winner it is a tie
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
  
  nextPuzzle()
  {//move to the next puzzle
    console.log(this.currentPuzzle);
    this.homePuzzle();
    this.loadPuzzle(this.currentPuzzle+1);
  },

  loadPuzzle(puzzleNum){//load input puzzle into the display
    
    this.puzzleSelected=true;
    var movelog = [];
    if (puzzleNum == 1){this.puzzleMoves = 1;this.puzzleMovesRemaining = 1;movelog = [[4,4],[4,0],[0,8],[8,1],[1,5],[5,7],[7,3],[3,6],[6,3],[3,4],[4,1],[1,2],[2,4],[4,7],[7,5],[5,4],[4,2],[2,1],[1,3],[3,2],[2,0],[0,0],[0,2],[2,8],[8,6],[6,2],[2,2],[2,6],[6,6],[6,8],[8,3],[3,3],[3,8],[8,4],[4,3],[3,0],[0,3],[3,5],[5,2],[2,5],[5,8],[8,0],[0,5],[5,1],[1,4],[4,6],[6,0],[0,7],[7,7],[7,0],[0,6],[6,5],[5,3],[3,7],[7,2],[2,3],[3,1],[1,8],[8,5],[5,5],[5,6],[6,1],[1,7],[7,1],[1,6],[6,7],[7,6],[6,4],[4,5],[5,0],[0,1],[1,0],[0,4],[4,8],[8,2],[2,7]];}
    else if (puzzleNum == 2){this.puzzleMoves = 5; this.puzzleMovesRemaining = 5; movelog = [[5,3],[3,1],[1,8],[8,4],[4,0],[0,4],[4,4],[4,6],[6,0],[0,7],[7,1],[1,4],[4,8],[8,8],[8,0],[0,1],[1,1],[1,5],[5,4],[4,5],[5,5],[5,1],[1,3],[3,4],[4,3],[3,7],[7,4],[4,1],[1,7],[7,7],[7,8],[8,6],[6,3],[3,3],[3,5],[5,6],[6,6],[6,8],[8,2],[2,4],[4,2],[2,2],[2,6],[6,5],[5,8],[8,7],[7,0],[0,2],[2,0],[0,5],[5,2],[2,3],[3,8],[8,3],[3,2],[2,7],[7,6],[6,2],[2,1],[1,2],[2,5],[5,7]];}
    else if (puzzleNum == 3){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[3,5],[5,3],[3,4],[4,7],[7,7],[7,1],[1,4],[4,1],[1,8],[8,1],[1,0],[0,3],[3,3],[3,8],[8,3],[3,7],[7,0],[0,4],[4,4],[4,2],[2,8],[8,4],[4,0],[0,5],[5,5],[5,0],[0,6],[6,4],[4,8],[8,7],[7,3],[3,6],[6,8],[8,8],[8,0],[0,8],[8,6],[6,6],[6,2],[2,1],[1,5],[5,6],[6,5]];}
    else if (puzzleNum == 4){this.puzzleMoves = 4; this.puzzleMovesRemaining = 6; movelog = [[3,7],[7,4],[4,4],[4,2],[2,3],[3,2],[2,6],[6,5],[5,1],[1,6],[6,1],[1,4],[4,5],[5,6],[6,2],[2,0],[0,8],[8,1],[1,5],[5,3],[3,4],[4,1],[1,7],[7,5],[5,7],[7,1],[1,8],[8,7],[7,2],[2,4],[4,7],[7,0],[0,5],[5,0],[0,7],[7,7],[7,3],[3,5],[5,2],[2,2],[2,8],[8,0],[0,4],[4,8],[8,3],[3,8],[8,4],[4,3],[3,6],[6,4],[4,6],[6,3],[3,1],[1,2],[2,5],[5,8],[8,2],[2,7]];}
    else if (puzzleNum == 5){this.puzzleMoves = 3; this.puzzleMovesRemaining = 3; movelog = [[2,2],[2,4],[4,7],[7,3],[3,6],[6,3],[3,3],[3,0],[0,5],[5,8],[8,4],[4,4],[4,5],[5,4],[4,6],[6,4],[4,8],[8,5],[5,0],[0,7],[7,7],[7,4],[4,3],[3,1],[1,7],[7,5],[5,3],[3,2],[2,0],[0,6],[6,5],[5,6],[6,8],[8,8],[8,2],[2,1],[1,1],[1,4],[4,2],[2,7],[7,8],[8,6],[6,2],[2,3],[3,8],[8,7],[7,6],[6,6],[6,1]];}
    else if (puzzleNum == 6){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[4,0],[0,0],[0,7],[7,2],[2,4],[4,4],[4,3],[3,3],[3,6],[6,6],[6,4],[4,7],[7,4],[4,1],[1,4],[4,5],[5,5],[5,4],[4,8],[8,4],[4,6],[6,7],[7,7],[7,8],[8,8],[8,7],[7,1],[1,1],[1,7],[7,5],[5,8],[8,1],[1,6],[6,8],[8,5],[5,7],[7,0],[0,4],[4,2],[2,6],[6,2],[2,1],[1,2],[2,2]];}
    else if (puzzleNum == 7){this.puzzleMoves = 4; this.puzzleMovesRemaining = 4; movelog = [[3,4],[4,0],[0,8],[8,6],[6,3],[3,0],[0,4],[4,4],[4,8],[8,0],[0,0],[0,6],[6,5],[5,7],[7,6],[6,4],[4,2],[2,6],[6,0],[0,5],[5,3],[3,6],[6,6],[6,8],[8,3],[3,3],[3,8],[8,5],[5,0],[0,7],[7,7],[7,8],[8,2],[2,5],[5,6],[6,2],[2,7],[7,4],[4,5],[5,8],[8,8],[8,4],[4,7],[7,0],[0,2],[2,3],[3,1],[1,4],[4,1],[1,8],[8,1],[1,0],[0,1],[1,7],[7,5]];}
    else if (puzzleNum == 8){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[1,6],[6,5],[5,6],[6,6],[6,4],[4,5],[5,0],[0,7],[7,8],[8,1],[1,7],[7,7],[7,5],[5,3],[3,7],[7,2],[2,5],[5,4],[4,3],[3,4],[4,0],[0,4],[4,6],[6,3],[3,8],[8,4],[4,8],[8,7],[7,4],[4,7],[7,3]];}
    else if (puzzleNum == 9){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[3,3],[3,8],[8,5],[5,8],[8,8],[8,2],[2,6],[6,3],[3,0],[0,5],[5,5],[5,4],[4,7],[7,7],[7,8],[8,0],[0,3],[3,6],[6,1],[1,3],[3,7],[7,4],[4,4],[4,1],[1,8],[8,4],[4,2],[2,8],[8,1],[1,7],[7,1],[1,1],[1,4],[4,6],[6,2],[2,5],[5,0],[0,8],[8,6],[6,0],[0,2],[2,2],[2,7],[7,3],[3,1],[1,6],[6,6],[6,4],[4,8],[8,7],[7,2],[2,0],[0,0],[0,6],[6,5],[5,7],[7,5],[5,1],[1,0],[0,7],[7,6],[6,8]];}
    else if (puzzleNum == 10){this.puzzleMoves = 3; this.puzzleMovesRemaining = 3; movelog = [[3,4],[4,8],[8,3],[3,6],[6,7],[7,0],[0,3],[3,7],[7,6],[6,5],[5,1],[1,8],[8,0],[0,2],[2,3],[3,8],[8,6],[6,4],[4,6],[6,6],[6,0],[0,5],[5,0],[0,8],[8,7],[7,1],[1,4],[4,5],[5,2],[2,1],[1,2],[2,4],[4,3],[3,2]];}
    else if (puzzleNum == 11){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[4,7],[7,8],[8,5],[5,6],[6,3],[3,7],[7,7],[7,5],[5,8],[8,8],[8,4],[4,4],[4,8],[8,3],[3,3],[3,4],[4,6],[6,7],[7,4],[4,5],[5,5],[5,3],[3,0],[0,5]];}
    else if (puzzleNum == 12){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[4,3],[3,7],[7,3],[3,1],[1,8],[8,3],[3,4],[4,8],[8,1],[1,6],[6,0],[0,3],[3,3],[3,5],[5,2],[2,6],[6,3],[3,2],[2,7],[7,8],[8,4],[4,7],[7,6],[6,6],[6,4],[4,6],[6,5],[5,5],[5,1],[1,3],[3,8],[8,7],[7,0],[0,6],[6,8],[8,2],[2,4],[4,0],[0,0],[0,7],[7,2],[2,1],[1,4],[4,5],[5,0],[0,8],[8,0],[0,5],[5,8],[8,8],[8,6],[6,2]];}
    else if (puzzleNum == 13){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[7,1],[1,8],[8,6],[6,3],[3,1],[1,4],[4,8],[8,3],[3,4],[4,5],[5,4],[4,4],[4,3],[3,7],[7,7],[7,4],[4,7],[7,3],[3,8],[8,0],[0,5],[5,2],[2,6],[6,1],[1,0],[0,8],[8,4],[4,6],[6,4],[4,2],[2,3],[3,0],[0,7],[7,5],[5,8],[8,2],[2,0],[0,4],[4,1],[1,1],[1,7],[7,8],[8,8],[8,7],[7,6],[6,0],[0,0],[0,6],[6,6],[6,2],[2,1],[1,5],[5,0],[0,2]];}
    else if (puzzleNum == 14){this.puzzleMoves = 3; this.puzzleMovesRemaining = 3; movelog = [[3,3],[3,2],[2,3],[3,4],[4,5],[5,8],[8,3],[3,6],[6,3],[3,8],[8,2],[2,8],[8,4],[4,0],[0,5],[5,0],[0,8],[8,5],[5,3],[3,5],[5,4],[4,8],[8,1],[1,7],[7,5],[5,5],[5,2],[2,5],[5,6],[6,8],[8,0],[0,2],[2,2],[2,6],[6,5],[5,7],[7,0],[0,0],[0,1],[1,8],[8,6],[6,4],[4,4],[4,3],[3,1],[1,6],[6,0],[0,3],[3,7],[7,4],[4,6],[6,6],[6,2],[2,7],[7,2],[2,1],[1,5],[5,1],[1,4],[4,2],[2,4],[4,1],[1,3],[3,0],[0,7],[7,7],[7,1]];}
    else if (puzzleNum == 15){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[3,2],[2,7],[7,6],[6,1],[1,3],[3,6],[6,5],[5,4],[4,5],[5,2],[2,8],[8,2],[2,5],[5,6],[6,8],[8,4],[4,4],[4,3],[3,5],[5,1],[1,4],[4,6],[6,2],[2,2],[2,4],[4,0],[0,8],[8,6],[6,0],[0,4],[4,2],[2,0]];}
    else if (puzzleNum == 16){this.puzzleMoves = 3; this.puzzleMovesRemaining = 3; movelog = [[4,0],[0,4],[4,5],[5,5],[5,3],[3,3],[3,6],[6,4],[4,4],[4,8],[8,4],[4,3],[3,4],[4,1],[1,4],[4,6],[6,6],[6,2],[2,4],[4,7],[7,4],[4,2],[2,6],[6,7],[7,7],[7,1],[1,2],[2,2],[2,7],[7,5],[5,6],[6,5],[5,0],[0,7],[7,6],[6,1],[1,6],[6,3],[3,2],[2,1],[1,0],[0,1],[1,7],[7,2],[2,8],[8,7],[7,8],[8,5],[5,2],[2,3],[3,8],[8,8],[8,2]];}
    else if (puzzleNum == 17){this.puzzleMoves = 4; this.puzzleMovesRemaining = 4; movelog = [[3,6],[6,2],[2,4],[4,4],[4,2],[2,7],[7,4],[4,5],[5,6],[6,4],[4,3],[3,7],[7,7],[7,1],[1,4],[4,7],[7,0],[0,4],[4,1],[1,6],[6,6],[6,8],[8,4],[4,0],[0,8],[8,8],[8,7],[7,8],[8,1],[1,2],[2,8],[8,0],[0,2],[2,6],[6,3],[3,4],[4,8],[8,6],[6,0],[0,5],[5,4],[4,6],[6,5],[5,2],[2,0],[0,3],[3,1],[1,7],[7,3],[3,0],[0,7],[7,6],[6,1],[1,8],[8,2],[2,3],[3,8]];}
    else if (puzzleNum == 18){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[4,4],[4,7],[7,4],[4,8],[8,4],[4,6],[6,4],[4,2],[2,4],[4,5],[5,4],[4,0],[0,3],[3,4],[4,1],[1,4],[4,3],[3,6],[6,0],[0,8],[8,8],[8,0],[0,0],[0,6],[6,8],[8,2],[2,2],[2,6],[6,1],[1,6],[6,6],[6,2],[2,5],[5,7],[7,6],[6,3],[3,2],[2,8],[8,7],[7,2],[2,3],[3,0],[0,5],[5,8],[8,1],[1,2],[2,0],[0,7],[7,7],[7,8],[8,3],[3,8]];}
    else if (puzzleNum == 19){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[7,6],[6,7],[7,4],[4,4],[4,8],[8,8],[8,0],[0,4],[4,7],[7,2],[2,4],[4,3],[3,4],[4,5],[5,2],[2,8],[8,7],[7,5],[5,8],[8,2],[2,1],[1,4],[4,6],[6,6],[6,8],[8,5],[5,5],[5,0],[0,8],[8,6],[6,4],[4,1],[1,6],[6,5],[5,6],[6,0],[0,2],[2,7],[7,8],[8,3],[3,3],[3,5],[5,1],[1,1],[1,7],[7,7],[7,0],[0,5],[5,3],[3,8],[8,1],[1,8],[8,4],[4,0],[0,3],[3,2],[2,2],[2,6],[6,1],[1,0]];}
    else if (puzzleNum == 20){this.puzzleMoves = 4; this.puzzleMovesRemaining = 4; movelog = [[3,7],[7,4],[4,4],[4,2],[2,3],[3,2],[2,6],[6,5],[5,1],[1,6],[6,1],[1,4],[4,5],[5,6],[6,2],[2,0],[0,8],[8,1],[1,5],[5,3],[3,4],[4,1],[1,7],[7,5],[5,7],[7,1],[1,8],[8,7],[7,2],[2,4],[4,7],[7,0],[0,5],[5,0],[0,7],[7,7],[7,3],[3,5],[5,2],[2,2],[2,8],[8,0],[0,4],[4,8],[8,3],[3,8],[8,4],[4,3],[3,6],[6,4],[4,6],[6,3],[3,1],[1,2],[2,5],[5,8],[8,2],[2,7]];}
    else if (puzzleNum == 21){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[3,4],[4,4],[4,2],[2,2],[2,7],[7,7],[7,0],[0,3],[3,2],[2,4],[4,1],[1,0],[0,2],[2,6],[6,3],[3,6],[6,4],[4,0],[0,8],[8,8],[8,0],[0,5],[5,6],[6,5],[5,5],[5,0],[0,6],[6,8],[8,2],[2,3],[3,8],[8,1],[1,6],[6,2],[2,8],[8,4],[4,7],[7,8],[8,7],[7,6],[6,0],[0,4],[4,8],[8,3],[3,0],[0,1],[1,4],[4,6],[6,6],[6,1],[1,7],[7,1]];}
    else if (puzzleNum == 22){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[7,7],[7,0],[0,8],[8,8],[8,0],[0,0],[0,2],[2,3],[3,3],[3,8],[8,3],[3,6],[6,6],[6,2],[2,5],[5,5],[5,0],[0,5],[5,8],[8,6],[6,5],[5,4],[4,3],[3,7],[7,6],[6,7],[7,2],[2,6],[6,4],[4,4],[4,0],[0,7],[7,8],[8,7],[7,5],[5,3]];}
    else if (puzzleNum == 23){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[2,2],[2,6],[6,3],[3,2],[2,1],[1,4],[4,6],[6,4],[4,8],[8,0],[0,6],[6,7],[7,1],[1,0],[0,4],[4,7],[7,4],[4,4],[4,2],[2,0],[0,2],[2,3],[3,4],[4,1],[1,8],[8,6],[6,1],[1,7],[7,7],[7,3],[3,6],[6,2],[2,8],[8,3],[3,1],[1,1],[1,6],[6,8],[8,5],[5,6]];}
    else if (puzzleNum == 24){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[1,6],[6,6],[6,2],[2,6],[6,5],[5,7],[7,7],[7,0],[0,0],[0,4],[4,3],[3,5],[5,0],[0,7],[7,4],[4,4],[4,6],[6,8],[8,3],[3,3],[3,4],[4,0],[0,1],[1,4],[4,8],[8,0],[0,2],[2,4],[4,7],[7,3],[3,7],[7,6],[6,0],[0,8],[8,4],[4,1],[1,0],[0,6],[6,1],[1,7],[7,1],[1,1],[1,8],[8,1],[1,3],[3,1],[1,2],[2,2],[2,7]];}
    else if (puzzleNum == 25){this.puzzleMoves = 3; this.puzzleMovesRemaining = 3; movelog = [[3,7],[7,1],[1,1],[1,8],[8,7],[7,7],[7,4],[4,0],[0,0],[0,4],[4,6],[6,3],[3,3],[3,4],[4,4],[4,8],[8,2],[2,0],[0,7],[7,5],[5,6],[6,4],[4,2],[2,4],[4,3],[3,6],[6,5],[5,2],[2,8],[8,8],[8,0],[0,3],[3,2],[2,2],[2,7],[7,6],[6,8],[8,6],[6,0],[0,5],[5,7],[7,8],[8,1],[1,4],[4,1],[1,0],[0,6],[6,1],[1,3]];}
    else if (puzzleNum == 26){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[1,6],[6,3],[3,5],[5,0],[0,1],[1,2],[2,6],[6,5],[5,8],[8,3],[3,3],[3,4],[4,4],[4,6],[6,4],[4,7],[7,7],[7,0],[0,4],[4,8],[8,8],[8,2],[2,4],[4,0],[0,7],[7,4],[4,2],[2,2],[2,7],[7,8],[8,6],[6,0],[0,8],[8,7],[7,6],[6,6],[6,1],[1,5],[5,5],[5,2]];}
    else if (puzzleNum == 27){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[4,6],[6,6],[6,2],[2,3],[3,7],[7,4],[4,4],[4,2],[2,8],[8,0],[0,0],[0,7],[7,7],[7,2],[2,4],[4,7],[7,6],[6,5],[5,0],[0,6],[6,3],[3,4],[4,8],[8,3],[3,8],[8,6],[6,0],[0,8],[8,5],[5,6],[6,1],[1,7],[7,8],[8,2],[2,6],[6,7],[7,1],[1,4],[4,0]];}
    else if (puzzleNum == 28){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[7,1],[1,0],[0,8],[8,6],[6,6],[6,7],[7,4],[4,3],[3,3],[3,4],[4,4],[4,8],[8,4],[4,6],[6,4],[4,0],[0,6],[6,2],[2,6],[6,3],[3,6],[6,5],[5,2],[2,4],[4,2],[2,7],[7,7],[7,2],[2,1],[1,4],[4,5],[5,3],[3,0],[0,7],[7,0],[0,4],[4,1],[1,8],[8,8],[8,0],[0,0],[0,1],[1,2],[2,5],[5,4],[4,7],[7,5],[5,6]];}
    else if (puzzleNum == 29){this.puzzleMoves = 2; this.puzzleMovesRemaining = 2; movelog = [[3,3],[3,7],[7,4],[4,0],[0,6],[6,4],[4,4],[4,6],[6,1],[1,4],[4,3],[3,4],[4,5],[5,8],[8,8],[8,0],[0,4],[4,2],[2,2],[2,6],[6,2],[2,3],[3,1],[1,7],[7,7],[7,1],[1,1],[1,8],[8,4],[4,1],[1,0],[0,2],[2,0],[0,1],[1,2],[2,1],[1,6],[6,0],[0,8],[8,1],[1,5],[5,4],[4,8],[8,2],[2,4],[4,7],[7,2],[2,8],[8,6],[6,8],[8,3],[3,8],[8,5],[5,0],[0,7],[7,3],[3,0],[0,3],[3,6],[6,7],[7,8]];}
    else if (puzzleNum == 30){this.puzzleMoves = 17; this.puzzleMovesRemaining = 17; movelog = [[4,4]];}




    this.currentPuzzle = puzzleNum;

     this.displayPuzzle(movelog);
  },

  displayPuzzle(moveLog){//input array of moves into the draw function
    console.log(moveLog.length);
    console.log(moveLog[1][1]);
    for (let i = 0; i <= moveLog.length-1; i++){
        console.log("adding move");
        this.draw(moveLog[i][0],moveLog[i][1]);
      }
  },

  activateCustomPuzzle(){
    this.userPuzzle = true;
  },
  customPuzzle(){//process input puzzle into an array and pass it to display
    let data = document.getElementById("puzzleCode").value;//check this works at all
    let puzzleMoves = parseInt(document.getElementById("puzzleMoves").value);//check this is an int

    const myArray = data.split(",").map(Number);

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

  writeToFile(){ //output current moves to a string in the users clipboard
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
  emitTimer(){// tell server whether or not to include timer in game
    socket.emit("timer", document.getElementById("Timer").checked);
    console.log("timer value emitted: "+document.getElementById("Timer").checked)
  },
  setOnlineNew(){// tell server user is hosting game
    this.setHost();
    socket.emit("newGame"); 
    console.log("Newgame");
    this.canGo = true; 
    //this.onlineStart = true;
  },
  setOnlineJoin(){ // send request to join game to server
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
    socket.on("play",(data) => {//when a play is recieved draw it
      //console.log("Play ", data.bigIndex);
      //console.log("Play ", data.index);
      //console.log("Play");
      this.draw(data.bigIndex, data.index);
    });      

    socket.on("gameCode", (data) => {// when given a gamecode is recieved display it
      this.gameCode = data;
      this.setGameCode(this.gameCode);
      console.log("Gamecode returned: ", this.gameCode);
    });

    socket.on("start",(data) => {// when recieved start the game
      this.onlineStart = data.start; 
      console.log("data.timer = "+data.timer)
      if(data.timer){    
        this.countDownTimer();
      }
      console.log("start game");
    });

    socket.on("undoRequest",() => { // when recieved display to user they have recieved an undo request
      this.recieveOnlineUndoRequest();
    });

    socket.on("undo",() => { // when recieved call undo
      this.undo();
    });

    socket.on("win",(data) => { //when recieved set winner
      this.setWin(data);
    });

    socket.on("spectator",(data) => { //when recieved set user to spectator mode
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
  border: 3px solid #00000069;
}

.miniSquare:hover {
  cursor: pointer;
  background: #0ff30f;
}

.occupied:hover {
  background: #ff3a3a;
}

.canMove  {
  background: #a2cfa4;
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
