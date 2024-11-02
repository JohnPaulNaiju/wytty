import { actions } from "react-native-pell-rich-editor";

export const Heading = [
    actions.fontName, 
    actions.heading1, 
    actions.heading2, 
    actions.heading3, 
    actions.heading4, 
    actions.heading5, 
    actions.heading6, 
    actions.setSubscript, 
    actions.setSuperscript, 
];

export const Align = [
    actions.alignRight, 
    actions.alignCenter, 
    actions.alignLeft, 
    actions.alignFull, 
    actions.indent, 
    actions.outdent, 
];

export const Format = [
    actions.fontSize, 
    actions.setBold, 
    actions.setItalic, 
    actions.setUnderline, 
    actions.setStrikethrough, 
    actions.foreColor, 
    actions.hiliteColor, 
];

export const Media = [
    actions.insertLink, 
    actions.insertImage, 
    actions.insertVideo, 
];

export const Lists = [
    actions.insertBulletsList, 
    actions.insertOrderedList, 
    actions.checkboxList, 
    actions.table, 
    actions.insertLine, 
];

export const Other = [
    actions.blockquote, 
    actions.code, 
    actions.keyboard, 
];

// export const actionsMap = [
//     actions.content, 
//     actions.init, 
//     actions.insertHTML, 
//     actions.insertText, 
//     actions.prepareInsert, 
//     actions.removeFormat, 
//     actions.restoreSelection, 
//     actions.setBackgroundColor, 
//     actions.setContentFocusHandler, 
//     actions.setContentPlaceholder, 
//     actions.setCustomCSS, 
//     actions.setEditorHeight, 
//     actions.setFooterHeight, 
//     actions.setHR, 
//     actions.setParagraph, 
//     actions.setPlatform, 
//     actions.setTextColor, 
//     actions.setTitleFocusHandler, 
//     actions.setTitlePlaceholder, 
//     actions.updateHeight, 
// ];