<template>
    <div>
        <div style="display: flex; justify-content: space-around; padding-top: 20px">
            <aside class="game-info">
                <select class="side-select" v-model="playerSide">
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="watcher">Watcher</option>
                </select>
                <button type="button" class="restart-game" @click="restartGame">Restart</button>
            </aside>
            <div class="table-chess-wrapper">
                <table-chess
                    :player-side="playerSide"
                ></table-chess>
            </div>
            <aside class="table-control">
                <button class="turn-around" type="button" @click="turnTableAround">Turn table around</button>
                <label class="disco-mode-label" >Disco mode:
                    <input v-model="discoMode" type="checkbox" class="disco-mode"/>
                </label>
            </aside>
        </div>
        <little-chat class="app-chat"
        
        ></little-chat>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Table from "./components/Table.vue";
import LittleChat from './components/LittleChat.vue';
import { setInterval } from 'timers';
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

    computed: {
        firstColor(): string | null {
            return getComputedStyle(document.querySelectorAll('.chess__square')[0]).backgroundColor;
        },

        secondColor(): string | null {
            return getComputedStyle(document.querySelectorAll('.chess__square')[1]).backgroundColor;
        },
    },
    
    watch: {
        discoMode(status: boolean): void {
            if (status) {
                this.discoTimer = window.setInterval(() => {
                    this.startDisco()
                }, 50);
            } else {
                window.clearInterval(this.discoTimer);
                this.setDefaultColors(<string>this.firstColor, <string>this.secondColor);
            }
        }
    },

    methods: {
        turnTableAround(): void {
            const chessTable: HTMLElement = <HTMLElement>document.querySelector('.chess-table');
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square')) as Array<HTMLElement>;

            if (this.isWhiteSideOnFront) {
                if (chessTable) chessTable.style.transform = 'rotate(180deg)';
                if (allSquares.length !== 0) Array.from(allSquares).forEach(element => {
                    element.style.transform = 'rotate(180deg)';
                });
                this.isWhiteSideOnFront = !this.isWhiteSideOnFront;
            } else {
                if (chessTable) chessTable.style.transform = 'rotate(0deg)';
                if (allSquares.length !== 0) allSquares.forEach(element => {
                    element.style.transform = 'rotate(0deg)';
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

        setDefaultColors(firstColor: string, secondColor: string): void {
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square'));

            allSquares.forEach(item => {
                item.style.filter = 'hue-rotate(0deg)';
            });
        },

        restartGame() {
            socket.emit('restartGame');
        },
    }
})
</script>
<style>
    html {
        font-size: 62.5%;
    }

    body {
        margin: 0;
        padding: 0;
    }

    .table-chess-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .turn-around {
        margin-top: 15px;
    }

    .app-chat {
        margin: 20px auto 0;
        max-width: 80%;
    }

    .game-info {
        display: flex;
        flex-direction: column;
    }

    .table-control {
        display: flex;
        flex-direction: column;
    }

    .disco-mode-label {
        font-size: 1.6rem;
        margin-top: 10px;
    }

    .restart-game {
        margin-top: 15px;
    }
</style>
