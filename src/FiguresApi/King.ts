import SquareInterface from "../Interfaces/SquareInterface";

export default class RocktApi {
    //возможные ходы для ладьи
    static calcPossibleTurns(table: SquareInterface[], figure: number, position: number): number[] {
        const figureSide = Math.sign(figure);
        let possibleTurnes: number[] = [];

        for (let i = -1; i <= 1; i += 1) {
            if (table[position + 8 * i + 1] && (table[position + 8 * i + 1].figure === 0 || Math.sign(<number>table[position + 8 * i + 1].figure) !== figureSide)) {
                possibleTurnes.push(position + 8 * i + 1);
            }

            if (table[position + 8 * i] && i !== 0 && (table[position + 8 * i].figure === 0 || Math.sign(<number>table[position + 8 * i].figure) !== figureSide)) {
                possibleTurnes.push(position + 8 * i);
            }

            if (table[position + 8 * i - 1] && (table[position + 8 * i - 1].figure === 0 || Math.sign(<number>table[position + 8 * i - 1].figure) !== figureSide)) {
                possibleTurnes.push(position + 8 * i - 1);
            }
        }

        return possibleTurnes;
    }
}