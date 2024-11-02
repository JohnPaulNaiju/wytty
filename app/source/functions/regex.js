/*
 * name validation
 * accepted: letters & spaces, minimum 3 chars, maximum 15 chars
 */
export const name = /^[a-zA-Z ]{3,30}$/;
/*
 * email validation
 */
export const email = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;
/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * [0-9a-zA-Z]{6,}: at least 6 from the mentioned characters
 */
export const password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
/*
 * user name validation
 * no spaces, no uppercases, 
 */
export const UserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,29}$/;
/*link validation*/
export const link = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
//string contains only emojis
export const emojiRegex = /^[\u{1F000}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]*$/u;
//dd/mm/yyyy
export const dob = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(19|20)\d{2}$/;
//notebook id regex
export const nbk = /\/nbk&id=([^/]+)\//;
//phone number with country code
export const phregex = /^\+\d{1,3}\s?\d{8,15}$/;
//link regex
export const linkRegex = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig;
//youtube regex
export const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
//linkedin profile url
export const linkedinregex = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/gm;

export const regex = {
    name: name,
    email: email,
    password: password,
    UserName: UserName,
    link: link,
    emojiRegex: emojiRegex,
    dob: dob,
    nbk: nbk,
    phregex: phregex,
    linkRegex: linkRegex,
    rx: rx,
    linkedinregex: linkedinregex,
};