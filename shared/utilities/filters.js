const safe = require("safe-regex");

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

// Check if variable exists and is not null or undefined
export function variableExists(value) {
	if (value === null || value === "" || value === undefined || typeof value === "undefined" || value === "undefined") {
		return false;
	}
	return true;
}

// Check if an input object exists, returns undefined if the object cannot be found
export function parameterIsSafe(fn) {
	try {
		fn();
		return true;
	} catch (e) {
		return false;
	}
}

// Check if an object does not contain any properties
export function isObjectEmpty(object) {
	if (Object.keys(object).length === 0) {
		return true;
	}
	return false;
}

// Check if an S3 bucket object is of the correct naming convention for saving
export function keyNameCorrect(key) {
	const regex = /[0-9]*_[0-9]*_[0-9]*.[a-z]+$/;
	if (safe(key.match(regex))) {
		return true;
	} else {
		return false;
	}
}

// Remove any properties from object 1 (genericObject) that are the same in object 2 (immutableObject)
export function removeSimilarProperties(genericObject = {}, immutableObject = {}) {
	const newObject = { ...genericObject };

	// Iterate over all properties in genericObject
	for (var key in genericObject) {
		if (genericObject.hasOwnProperty(key)) {
			// Delete any properties that are the same in object2
			if ((!variableExists(genericObject[key]) && !variableExists(immutableObject.get(key))) || genericObject[key] == immutableObject.get(key)) {
				// null and "" and undefined should all be considered the same
				delete newObject[key];
			}
		}
	}
	return newObject;
}

// Remove any properties in an object where the key does not exist in an array
export function removeUniqueProperties(genericObject = {}, propertiesArray = []) {
	const newObject = { ...genericObject };

	// Iterate over all properties in genericObject
	for (var key in genericObject) {
		if (genericObject.hasOwnProperty(key)) {
			// Delete any properties in the object that do not exist in the propertiesArray
			if (!propertiesArray.includes(key)) {
				delete newObject[key];
			}
		}
	}
	return newObject;
}
