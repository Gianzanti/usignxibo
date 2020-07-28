export class XiboError implements Error {
    public name = 'XiboError';

    public message: string;

    public stack?: string | undefined;

    public constructor(message: string, stack?: string) {
        this.message = message
        if (stack) {
            this.stack = stack
        }
    }

    public toString(): string {
        return `${this.name} : ${this.message}`
    }
}
