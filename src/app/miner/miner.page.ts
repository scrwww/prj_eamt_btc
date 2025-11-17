import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { 
  IonCheckbox,
  IonSelectOption,
  IonSelect,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
} from '@ionic/angular/standalone';
import { NumericValueAccessor } from '@ionic/angular';

@Component({
  selector: 'app-miner',
  templateUrl: './miner.page.html',
  styleUrls: ['./miner.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonCheckbox,
    IonSelectOption,
    IonSelect,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonInput,
  ]
})
export class MinerPage implements OnInit {

  dificuldade: number = 1;
  ativarExemplo: boolean = false;
  ativarExemploDiff: boolean = false; 

  isMining: boolean = false;
  diffAlta: boolean = false;
  diffBaixa: boolean = true;


  hash: any = 0;
  nonce: number = 0;  
  outputFin: string = "";
  outputBet: string = "";
  
  dados: string = "TransacaoTeste";

  tempoTotal: number = 0;
  nonceTotal: number = 0;
  start: any = 0;
  end: any = 0;


  constructor() { }

  ngOnInit() {
  }

  async selectDiff(event: any){
    this.dificuldade = event.target.value;
    console.log(this.dificuldade)
    if (this.dificuldade >= 4){
      this.ativarExemplo = false;
      this.diffAlta = true;
      this.diffBaixa = false;
      this.outputFin = "Não será possivel colocar a visualização em tempo real, dificuldade alta<br>"
    }
  }

  async resetNonce(){
    this.nonceTotal = 0;
    this.tempoTotal = 0;
  }

  async calcularSHA256(entrada: any) {
    const encoder = new TextEncoder();
    const data = encoder.encode(entrada);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Converte o ArrayBuffer para uma string hexadecimal
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
  }



  async minerar(){
    this.isMining = true;
    this.isMining = true;
    this.nonce = 0;
    this.outputFin = "";
    this.outputBet = ""; 

    // coloca a quantia de zeros no inicio para significar a dificuldade
    let prefixoAlvo = '0'.repeat(this.dificuldade);
    console.log(prefixoAlvo + " Quantia correta?")
    this.start = performance.now();

    this.outputFin += "Iniciando mineração...<br>"

    if (this.dificuldade >= 4){
      if (!this.ativarExemploDiff){
        this.ativarExemplo = false
        this.outputFin += "Não será possivel colocar a visualização em tempo real, dificuldade alta<br>"
      }
      else
        this.ativarExemplo = true;
    }

    if (this.ativarExemplo) {
      while (true) {
      this.nonce++;
      let entrada = this.dados + this.nonce;
      this.hash = await this.calcularSHA256(entrada);

      // Verifica se o hash começa com o prefixo alvo
      if (this.hash.startsWith(prefixoAlvo)) {break;}
      this.outputBet += `Hash atual: ${this.hash} <br>`;
      this.outputBet += `Valor do Hash Atual: ${this.nonce} <br>`;
      }
    }
    else{
      while (true) {
        this.nonce++;
        let entrada = this.dados + this.nonce;
        this.hash = await this.calcularSHA256(entrada);
  
        // Verifica se o hash começa com o prefixo alvo
        if (this.hash.startsWith(prefixoAlvo)) {break;}        
      }
    }

    this.end = performance.now(); // Tempo de término
    let tempo = (this.end - this.start).toFixed(2); // Tempo em milissegundos
    this.tempoTotal = Number((Number((this.end - this.start)) + this.tempoTotal).toFixed(2));
    this.nonceTotal = this.nonce + this.nonceTotal;

    this.isMining = false;

    this.outputFin += `Hash encontrado: ${this.hash} <br>`;
    this.outputFin += `Tentativa: ${this.nonce} - - - - Tempo: ${tempo} ms <br>`;
    this.outputFin += `Quantia de Tentativa Total: ${this.nonceTotal} - - - - Tempo Total: ${this.tempoTotal} ms <br>`;
    
    const lblDiff: HTMLElement | null = document.getElementById('lblDiff');
    lblDiff?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  
  }
}
