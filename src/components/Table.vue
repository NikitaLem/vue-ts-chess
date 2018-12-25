<template>
    <div class="chess-table">
        <div class="super-pawn-menu_white" v-if="whitePawnPromotion">
            <square :state="3" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="4" :background-color="`#cf7249`"
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="5" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="6" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
        </div>
        <div class="super-pawn-menu_black" v-if="blackPawnPromotion">
            <square :state="-3" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="-4" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="-5" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
            <square :state="-6" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="chessFieldModel[pawnForPromotionPosition].figure = $event"
            ></square>
        </div>
        <div class="play-stoper" v-if="whitePawnPromotion || blackPawnPromotion"></div>
        <square v-for="(item, index) in chessFieldModel" :key="index"
            :number-of-field="index"
            :background-color="item.squareColor"
            :state="item.figure"
            :possible-turn="item.possibleTurn"
            :is-active="item.isActive"
            :is-white-turn="isWhiteTurn"
            @figure-touched="prepareToTurn($event)"
            @figure-turned="endOfTurn($event)"
        ></square>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Square from "./Square.vue";
import SquareInterface from '../interfaces/SquareInterface';
import PawnApi from '../FiguresApi/Pawn';
import KnightApi from '../FiguresApi/Knight';
import BishopApi from '../FiguresApi/Bishop';
import RockApi from '../FiguresApi/Rock';
import QueenApi from '../FiguresApi/Queen';
import KingApi from '../FiguresApi/King';
import { startingTable } from './startingTable';

export default Vue.extend({
    name: 'Table',
    components: {
        'square': Square,
    },

    data() {
        return {
            chessFieldModel: startingTable as SquareInterface[],
            isFigureActive: false as boolean,
            activeFigure: null as number | null | undefined,
            activeSquare: null as number | null,
            possibleTurnes: [] as number[],
            isWhiteTurn: true as boolean,
            allFieldsUnderWhiteAttack: [] as number[],
            allFieldsUnderBlackAttack: [] as number[],
            pawnForPromotionPosition: null as number | null,
        };
    },

    computed: {
        whiteUnderCheck(): boolean {
            const whiteKingPosition = this.chessFieldModel.findIndex(item => item.figure === 2);
            
            if (this.allFieldsUnderBlackAttack.indexOf(whiteKingPosition) !== -1) return true;
            return false;
        },

        blackUnderCheck(): boolean {
            const blackKingPosition = this.chessFieldModel.findIndex(item => item.figure === -2);
            
            if (this.allFieldsUnderWhiteAttack.indexOf(blackKingPosition) !== -1) return true;
            return false;
        },

        whitePawnPromotion(): boolean {
            for (let i = 0; i < 8; i += 1) {
                if (this.chessFieldModel[i].figure === 1) {
                    this.pawnForPromotionPosition = i;
                    return true;
                }
            }

            this.pawnForPromotionPosition = null;
            return false;
        },

        blackPawnPromotion(): boolean {
            for (let i = 56; i < 64; i += 1) {
                if (this.chessFieldModel[i].figure === -1) {
                    this.pawnForPromotionPosition = i;
                    return true;
                }
            }

            this.pawnForPromotionPosition = null;
            return false;
        },
    },

    methods: {
        //смотрим что за фигура, готовим возможные клетки для хода фигуры с её текущей позиции
        prepareToTurn(event: number): void {
            if (this.activeSquare === event) {
                this.clearTableAfterTurn();
                return;
            }

            if (!this.isFigureActive) {
                this.activeSquare = event;
                this.activeFigure = this.chessFieldModel[this.activeSquare].figure;
                this.chessFieldModel[this.activeSquare].isActive = true;

                this.possibleTurnes.splice(0, this.possibleTurnes.length);

                switch (this.activeFigure) {
                    case -1: case 1: 
                        this.possibleTurnes = PawnApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case -2: case 2: 
                        this.possibleTurnes = KingApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case -3: case 3:
                        this.possibleTurnes = QueenApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case -4: case 4:
                        this.possibleTurnes = BishopApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case - 5: case 5:
                        this.possibleTurnes = KnightApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case - 6: case 6:
                        this.possibleTurnes = RockApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    default: break;
                }

                this.possibleTurnes.length !== 0 ? this.isFigureActive = true : this.clearTableAfterTurn();

                this.chessFieldModel.forEach((item, index) => {
                    if (this.possibleTurnes.indexOf(index) !== -1) item.possibleTurn = true;
                });
            }
        },

        endOfTurn(event: number): void {
            const figureAtPoint: number | null | undefined = this.chessFieldModel[event].figure;

            this.chessFieldModel[this.activeSquare as number].figure = 0;
            this.chessFieldModel[event].figure = this.activeFigure;

            this.allFieldsUnderWhiteAttack.splice(0, this.allFieldsUnderWhiteAttack.length);
            this.allFieldsUnderWhiteAttack = this.getFieldsUnderAttack(1);
            this.allFieldsUnderBlackAttack.splice(0, this.allFieldsUnderBlackAttack.length);
            this.allFieldsUnderBlackAttack = this.getFieldsUnderAttack(-1);

            if (this.isWhiteTurn && this.whiteUnderCheck) {
                this.chessFieldModel[this.activeSquare as number].figure = this.activeFigure;
                this.chessFieldModel[event].figure = figureAtPoint;
                return;
            }
            if (!this.isWhiteTurn && this.blackUnderCheck) {
                this.chessFieldModel[this.activeSquare as number].figure = this.activeFigure;
                this.chessFieldModel[event].figure = figureAtPoint;
                return;
            } 

            this.activeSquare = null;
            this.activeFigure = null;
            this.chessFieldModel.forEach(item => {
                item.possibleTurn = false;
                item.isActive = false;
            });

            this.isFigureActive = false;
            this.isWhiteTurn = !this.isWhiteTurn;
        },

        clearTableAfterTurn(): void {
            this.activeSquare = null;
            this.activeFigure = null;
            this.possibleTurnes.splice(0, this.possibleTurnes.length);
            this.chessFieldModel.forEach(item => {
                item.possibleTurn = false;
                item.isActive = false;
            });

            this.isFigureActive = false;
        },

        getFieldsUnderAttack(side: number): number[] {
            let fieldsUnderAttack: number[] = [];

            let pawnsPositions: number[] = [];
            let kingPosition: number = 0;
            let queenPosition: number = 0;
            let bishopsPositions: number[] = [];
            let knightsPositions: number[] = [];
            let rocksPositions: number[] = [];

            this.chessFieldModel.forEach((item, index) => {
                if (item.figure === side * 1) pawnsPositions.push(index);
                if (item.figure === side * 2) kingPosition = index;
                if (item.figure === side * 3) queenPosition = index;
                if (item.figure === side * 4) bishopsPositions.push(index);
                if (item.figure === side * 5) knightsPositions.push(index);
                if (item.figure === side * 6) rocksPositions.push(index);
            });

            pawnsPositions.forEach(item => fieldsUnderAttack.push(...PawnApi.calcAttackedFields(this.chessFieldModel, side * 1, item)));
            fieldsUnderAttack.push(...KingApi.calcPossibleTurns(this.chessFieldModel, side * 2, kingPosition));
            fieldsUnderAttack.push(...QueenApi.calcPossibleTurns(this.chessFieldModel, side * 3, queenPosition));
            bishopsPositions.forEach(item => fieldsUnderAttack.push(...BishopApi.calcPossibleTurns(this.chessFieldModel, side * 4, item)));
            knightsPositions.forEach(item => fieldsUnderAttack.push(...KnightApi.calcPossibleTurns(this.chessFieldModel, side * 5, item)));
            rocksPositions.forEach(item => fieldsUnderAttack.push(...RockApi.calcPossibleTurns(this.chessFieldModel, side * 6, item)));

            return fieldsUnderAttack;
        },
    },
})
</script>
<style>
.chess-table {
    position: relative;
    width: calc(8 * 70px);
    height: calc(8 * 70px);
    display: flex;
    flex-wrap: wrap;
    border: 10px solid #49290c
}

.super-pawn-menu_white {
    position: absolute;
    top: -10px;
    right: calc(100% + 10px);
    width: 140px;
    height: 140px;
    border: 10px solid #49290c;
    border-width: 10px 0 10px 10px;
    display: flex;
    flex-wrap: wrap;
}

.super-pawn-menu_black {
    position: absolute;
    bottom: -10px;
    left: calc(100% + 10px);
    width: 140px;
    height: 140px;
    border: 10px solid #49290c;
    border-width: 10px 10px 10px 0;
    display: flex;
    flex-wrap: wrap;
}

.play-stoper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: #3333338c;
}
</style>
