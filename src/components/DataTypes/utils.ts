export const getJsonDescription = (
	name: string,
	operator: string,
	value: string,
	refScheme?: string | null,
) => {
	return JSON.stringify({
		name,
		operator,
		value,
		refScheme: [refScheme],
	});
};
