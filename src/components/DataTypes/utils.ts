export const getJsonDescription = (
	name: string,
	operator: string,
	value: string,
) => {
	return JSON.stringify({
		name,
		operator,
		value,
	});
};
