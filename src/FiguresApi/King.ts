import SquareInterface from "../Interfaces/SquareInterface";

export default class KingApi {
    //возможные ходы для ладьи
    static calcPossibleTurns(table: SquareInterface[], figure: number, position: number, castlingShort?: boolean, castlingLong?: boolean): number[] {
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

        if (castlingShort) possibleTurnes.push(position + 2);
        if (castlingLong) possibleTurnes.push(position - 3);

        return possibleTurnes;
    }
}