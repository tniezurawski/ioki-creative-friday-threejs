function degrees(n){
	return n * Math.PI/180;
}

function hexToHash(hex){
	var hash = hex.replace( '0x','#' );
	return hash;
}

function hashToHex(hash){
	var hex = hash.replace( '#','0x' );
	return hex;
}