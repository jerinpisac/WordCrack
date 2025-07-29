import { Component, OnInit } from '@angular/core';
import { fiveLetter } from '../../shared/five.model';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-five',
  imports: [CommonModule, FormsModule],
  templateUrl: './five.component.html',
  styleUrl: './five.component.css'
})
export class FiveComponent implements OnInit{
  word: string = "";
  result: string = "";
  idx: number = 0;
  fiveLetterList: string[] = fiveLetter;

  guesses: string[][] = Array(6).fill(null).map(() => Array(5).fill(""));
  colors: string[][] = Array(6).fill(null).map(() => Array(5).fill(""));

  activeRow: number = 0;

  constructor(public service: AuthService, private router : Router) {}

  ngOnInit(): void {
    const storedIndex = localStorage.getItem("currentIndex5");
    if (storedIndex) {
      this.idx = parseInt(storedIndex);
    } else {
      this.idx = Math.floor(Math.random() * this.fiveLetterList.length);
      localStorage.setItem("currentIndex5", this.idx.toString());
    }
    this.result = this.fiveLetterList[this.idx];
  }

  moveFocus(event: any, rowIndex: number, colIndex: number) {
    const input = event.target as HTMLInputElement;

    input.value = input.value;
    this.guesses[rowIndex][colIndex] = input.value;

    if (input.value && colIndex < 4) {
      const inputs = input.parentElement?.querySelectorAll('input');
      const nextInput = inputs?.[colIndex] as HTMLInputElement;

      if (nextInput) {
        nextInput.value = '';
        this.guesses[rowIndex][colIndex + 1] = '';
        nextInput.focus();
      }
    }
  }

  handleBackspace(event: KeyboardEvent, rowIndex: number, colIndex: number) {
    if (event.key === 'Backspace' && !this.guesses[rowIndex][colIndex] && colIndex > 0) {
      const inputs = (event.target as HTMLInputElement).parentElement?.querySelectorAll('input');
      const prevInput = inputs?.[colIndex - 1] as HTMLInputElement;

      if (prevInput) {
        this.guesses[rowIndex][colIndex - 1] = '';
        prevInput.value = '';
        const prevv = inputs?.[colIndex - 1] as HTMLInputElement;
        setTimeout(() => prevv.focus(), 0);
      }
    }
  }

  isRight() {
    const currentGuess = this.guesses[this.activeRow].join("");
    if (currentGuess.length !== 5) {
      alert("Fill all 5 letters");
      return;
    }

    this.word = currentGuess;
    if (this.word === this.result) {
      alert("🎉 You are the winner!");
      localStorage.clear();
      if(confirm("Do you want to play another one?")) 
      {
        this.router.navigateByUrl("/home");
      }
      else window.close()
    }
    else if (this.fiveLetterList.includes(this.word)) {
      const targetArr = this.result.split("");
      const guessArr = this.word.split("");
      const letterCount: { [key: string]: number } = {};

      for (let ch of targetArr) {
        letterCount[ch] = (letterCount[ch] || 0) + 1;
      }

      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
          this.colors[this.activeRow][i] = "green";
          letterCount[guessArr[i]]--;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (this.colors[this.activeRow][i] !== "green") {
          if (letterCount[guessArr[i]] > 0) {
            this.colors[this.activeRow][i] = "yellow";
            letterCount[guessArr[i]]--;
          } else {
            this.colors[this.activeRow][i] = "black";
          }
        }
      }
      this.activeRow++;
      if(this.activeRow == 6){
        alert("The word is " + this.result);
        localStorage.clear()
        if(confirm("Do you wanna play again?")){
          this.router.navigateByUrl("/home");
        }
        else{
          window.close()
        }
      }
    }
     else {
      alert("❌ Word doesn't exist");
    }
  }
}
