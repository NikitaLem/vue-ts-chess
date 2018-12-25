<template>
    <div style="height: 100%; width: 100%;">
        <div class="table-chess-wrapper">
            <table-chess></table-chess>
            <button class="turn-around" type="button" @click="turnTableAround">Turn table around</button>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Table from "./components/Table.vue";

export default Vue.extend({

    components: {
        'table-chess': Table,
    },

    data() {
        return {
            isWhiteSideOnFront: true as boolean,
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
        height: 100%;
        width: 100%;
    }

    body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .table-chess-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .turn-around {
        margin-top: 15px;
    }
</style>
