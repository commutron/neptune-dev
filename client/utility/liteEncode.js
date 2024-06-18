const lookupTable = [
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", '.', '!', '@',
	'#', '$', '%', '^', '&', '*', '(', ')', '_', '-', ',', '?', '`',
	'<', '>', '[', ']', '{', '}', '~', '=', '/', "\\", "+"
];

function liteEncode(userstring) {
	
	const userArray = [...userstring];
	const intArray = userArray.map( (char)=> lookupTable.indexOf(char) );
	
	const intString = intArray.toString();
	
	return intString;
}

export default liteEncode;

export function liteDecode(intString) {
	
	const intArray = intString.split(",");

	const charArray = intArray.map( (int)=> lookupTable[int] );
	
	const userString = charArray.join('');
	
	return userString;
}