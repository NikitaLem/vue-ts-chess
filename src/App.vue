<template>
    <div>
        <div style="display: flex; justify-content: space-around; padding-top: 20px">
            <aside class="game-info">
                <select class="side-select" v-model="playerSide">
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="watcher">Watcher</option>
                </select>
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

export default Vue.extend({

    components: {
        'table-chess': Table,
        'little-chat': LittleChat,
    },

    data() {
        return {
            isWhiteSideOnFront: true as boolean,
            playerSide: 'watcher' as String,
            discoMode: false as boolean,
        };
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
            
        }
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

    .table-control {
        display: flex;
        flex-direction: column;
    }

    .disco-mode-label {
        font-size: 1.6rem;
        margin-top: 10px;
    }
</style>
