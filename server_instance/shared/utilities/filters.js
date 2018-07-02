function convertProperty(element) {
	if (element && !Array.isArray(element)) {
		element = [element];
	}
	return element;
}

// Check if arr1 contains all elements in arr2
export function arrayContains(arr1, arr2) {
	arr1 = convertProperty(arr1);
	arr2 = convertProperty(arr2);
	return arr1.every(arr1Element => {
		return arr2.some(arr2Element => {
			arr2Element === arr1Element;
		});
	});
}

// Check if any properties in arr1 exists in arr2
export function arrayHasAny(arr1, arr2) {
	arr1 = convertProperty(arr1);
	arr2 = convertProperty(arr2);
	return arr1.some(arr1Element => {
		return arr2.some(arr2Element => {
			arr2Element === arr1Element;
		});
	});
}
