<template>
<div class="container"> 
  <h1>TacTic Toe</h1>
  <div class="game">
    <div id="square_0" class="square" @click="play(0)">{{board[0]}}</div>
    <div id="square_1" class="square" @click="play(1)">{{board[1]}}</div>
    <div id="square_2" class="square" @click="play(2)">{{board[2]}}</div>
    <div id="square_3" class="square" @click="play(3)">{{board[3]}}</div>
    <div id="square_4" class="square" @click="play(4)">{{board[4]}}</div>
    <div id="square_5" class="square" @click="play(5)">{{board[5]}}</div>
    <div id="square_6" class="square" @click="play(6)">{{board[6]}}</div>
    <div id="square_7" class="square" @click="play(7)">{{board[7]}}</div>
    <div id="square_8" class="square" @click="play(8)">{{board[8]}}</div>
  </div>
  <h2 id="winner" v-if="complete"> Winner is {{winner}} </h2>
  <h2 v-if="tie"> Tie Game </h2>
  <button @click="resetBoard()" v-if="complete || tie">RESET</button>
</div>
</template>

<script>
import io from 'socket.io-client'
const socket = io("http://localhost:3000")
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      board: ["","","","","","","","",""],
      xturn: true,
      complete: false,
      winner: null,
      tie: false
    }
  },
  methods: {
    play(index){
      socket.emit("play", index);
      this.draw(index);
    },
    draw(index) {
      if(this.xturn) {//if is x's turn mark as x
        this.board[index]="X"
      } else {//if is o's turn mark as o
        this.board[index]="O"
      }
      
      this.xturn = !this.xturn
      this.calculateWin();
      this.calculateTie();
    },
  
  calculateWin() {
    const WIN_CONDITIONS = [
      [0,1,2], [3,4,5], [6,7,8], //rows
      [0,3,6], [1,4,7], [2,5,8],//columns
      [0,4,8], [2,4,6] //diagonals
    ];
    for (let i = 0; i < WIN_CONDITIONS.length; i++){
      let first = WIN_CONDITIONS[i][0];      
      let second = WIN_CONDITIONS[i][1];
      let third = WIN_CONDITIONS[i][2];
      if(this.board[first]==this.board[second] && this.board[first] == this.board[third] && this.board[first] != "")
      {
        this.complete = true;
        this.winner = this.board[first];
      }
    }
    //console.log(WIN_CONDITIONS);
  },
  resetBoard() {
    for (let i = 0; i <= 8; i++){
      this.board[i] = "";      
    }
    this.complete = false;
    this.winner = "";
    this.tie = false;
    //console.log("Board Reset")
  },
  calculateTie() {// go back and move this into calc win to improve effcienecy
    for (let i = 0; i <= 8; i++){
      if (this.board[i] == ""){
        return
      }
    }    
      this.tie = true;
  }  
},
created() {
    socket.on("play", (msg) =>{
      //console.log("Play ", msg)
      this.draw(msg)
    })
  }

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
  margin-bottom: 0.5em;
}

h2 {
  margin-top: 1em;
  font-size: 2rem;
  margin-bottom: 0.5em;
}

.game {
  display: grid;
  width: 300px;
  height: 300px;
  grid-template-columns: auto auto auto;
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
  transition: background 0.2s ease-in-out;
}

.square:hover {
  cursor: pointer;
  background: #0ff30f;
}

.occupied:hover {
  background: #ff3a3a;
}

.win {
  background: #0ff30f;
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
