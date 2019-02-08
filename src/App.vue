<template>
    <div>
        <header class="table-control">
            <select class="side-select" v-model="playerSide">
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="watcher">Watcher</option>
            </select>
            <button type="button" class="restart-game" @click="restartGame">Restart</button>
            <button class="turn-around" type="button" @click="turnTableAround">Turn table around</button>
            <label class="disco-mode-label">Disco mode:
                <input v-model="discoMode" type="checkbox" class="disco-mode" style="vertical-align: middle"/>
            </label>
        </header>
        <div class="table-chat-wrapper">
            <div class="table-chess-wrapper">
                <table-chess
                    :player-side="playerSide"
                ></table-chess>
            </div>
            <little-chat class="app-chat"
            ></little-chat>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Table from "./components/Table.vue";
import LittleChat from './components/LittleChat.vue';
import { setInterval, setTimeout } from 'timers';
import * as io from 'socket.io-client';

const socket = io();

export default Vue.extend({

    components: {
        'table-chess': Table,
        'little-chat': LittleChat,
    },

    data() {
        return {
            isWhiteSideOnFront: true as boolean,
            playerSide: 'watcher' as string,
            discoMode: false as boolean,
            discoTimer: 0 as number,
        };
    },
    
    watch: {
        discoMode(status: boolean): void {
            if (status) {
                this.discoTimer = window.setInterval(() => {
                    this.startDisco()
                }, 50);
            } else {
                window.clearInterval(this.discoTimer);
                this.setDefaultColors();
            }
        }
    },

    methods: {
        turnTableAround(): void {
            const chessTable: HTMLElement = <HTMLElement>document.querySelector('.chess-table');
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square')) as Array<HTMLElement>;
            const letters: Array<HTMLElement> = Array.from(document.querySelectorAll('.letter')) as Array<HTMLElement>;

            if (this.isWhiteSideOnFront) {
                if (chessTable) chessTable.style.transform = 'rotate(180deg)';
                if (allSquares.length !== 0) allSquares.forEach(element => {
                    element.style.transform = 'rotate(180deg)';
                });
                if (letters) letters.forEach(letter => {
                    letter.style.transform = 'rotate(180deg)';
                });
                this.isWhiteSideOnFront = !this.isWhiteSideOnFront;
            } else {
                if (chessTable) chessTable.style.transform = 'rotate(0deg)';
                if (allSquares.length !== 0) allSquares.forEach(element => {
                    element.style.transform = 'rotate(0deg)';
                });
                if (letters) letters.forEach(letter => {
                    letter.style.transform = 'rotate(0deg)';
                });
                this.isWhiteSideOnFront = !this.isWhiteSideOnFront;
            }
            
        },

        startDisco(): void {
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square'));
            const getRandom: (min: number, max: number) => number = function(min: number, max: number) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            let deg: number;

            allSquares.forEach(item => {
                deg = getRandom(0, 360);
                item.style.filter = `hue-rotate(${deg}deg)`;
            });
        },

        setDefaultColors(): void {
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square'));

            allSquares.forEach(item => {
                item.style.filter = 'hue-rotate(0deg)';
            });
        },

        restartGame() {
            socket.emit('restartGame');
        },
    }
});

const setChatHeight = function(): void {
    const littleChat = <HTMLElement>document.querySelector('.little-chat');
    const chatOut: HTMLElement = <HTMLElement>document.querySelector('.chat-out');
    
    if (window.innerWidth > 1000) {
        littleChat.style.height = '';
        chatOut.style.maxHeight = '';
        return;
    }

    const chessTable: HTMLElement = <HTMLElement>document.querySelector('.table-chess-wrapper');
    const chatIn: HTMLElement = <HTMLElement>document.querySelector('.chat-in');
    let chatHeight: number = document.body.offsetHeight - chessTable.getBoundingClientRect().bottom;
    littleChat.style.height = chatHeight + 'px';
    let maxHeight: number = chatIn.getBoundingClientRect().top - chessTable.getBoundingClientRect().bottom;
    chatOut.style.maxHeight = maxHeight + 'px';
};

window.addEventListener('load', () => {
    setTimeout(() => { setChatHeight() }, 20)}, false);

window.addEventListener('resize', () => {
    setTimeout(() => { setChatHeight() }, 20)}, false);
</script>
<style>
    html {
        font-size: 62.5%;
        height: 100vh;
        width: 100vw;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
    }

    .table-chat-wrapper {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }

    @media screen and (max-width: 1000px) {
        .table-chat-wrapper {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
        }
    }

    .table-control {
        padding: 10px 0;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .table-chess-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 75%;
        flex-grow: 1;
    }

    .disco-mode-label {
        font-size: 1.6rem;
        margin-top: 10px;
    }

    .app-chat {
        min-height: calc(100% - 40px);
        max-height: 580px;
        padding-right: 20px;

    }

    @media screen and (max-width: 1000px) {
        .app-chat {
            padding-right: 0;
        }
    }
</style>
