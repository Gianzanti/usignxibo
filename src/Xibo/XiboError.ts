export class XiboError implements Error {
    public name = 'XiboError';

    public message: string;

    public constructor(message: string) {
        this.message = message
    }

    public toString(): string {
        return `${this.name} : ${this.message}`
    }
}
