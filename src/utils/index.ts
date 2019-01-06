import * as uuid from 'uuid/v4';

export let getUniqueID = (length: number): string => {

    let uid: string = '';
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength: number = chars.length;

    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInteger(0, charsLength - 1)];
    }

    return uid;
};

export let generateUUID = (): string => uuid();

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}