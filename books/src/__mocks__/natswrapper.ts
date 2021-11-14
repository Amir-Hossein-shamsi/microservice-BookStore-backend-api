export const nastsWrapper = {
	client: {
		publish: jest
			.fn()
			.mockImplementation(
				(subject: string, data: string, callback: () => void) => {
					callback();
				}
			),
	},
};
