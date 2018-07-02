function array(element) {
	if (element && !Array.isArray(element)) {
		element = [element];
	}
	return element;
}

// Check if arr1 contains all elements in arr2
export function arrayContains(arr1, arr2) {
	arr2 = array(arr2);
	return array(arr1).every(arr1Element => {
		return arr2.indexOf(arr1Element) !== -1;
	});
}

// Check if any properties in arr1 exists in arr2
export function arrayHasAny(arr1, arr2) {
	arr2 = array(arr2);
	return array(arr1).some(arr1Element => {
		return arr2.indexOf(arr1Element) !== -1;
	});
}
