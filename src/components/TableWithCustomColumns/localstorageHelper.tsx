export const getFromLocalStorage = <T extends any>(
	key: string,
): T | undefined => {
	try {
		const angularKey = `ngStorage-${key}`;
		const angularVal = localStorage.getItem(angularKey);
		const migratedVal = localStorage.getItem(key);

		if (migratedVal == null && angularVal != null) {
			localStorage.setItem(key, angularVal);
		}

		// TODO: Enable once we are confident the above migration works correctly.
		// if (angularVal) {
		// 		localStorage.removeItem(angularKey);
		// }

		const val = migratedVal || angularVal;
		if (val != null) {
			return JSON.parse(val);
		}

		return undefined;
	} catch (err) {
		// reportNonNetworkingException(err);
		return undefined;
	}
};

export const setToLocalStorage = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		// reportNonNetworkingException(err);
	}
};

export const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(`ngStorage-${key}`);
		localStorage.removeItem(key);
	} catch (err) {
		// reportNonNetworkingException(err);
	}
};
