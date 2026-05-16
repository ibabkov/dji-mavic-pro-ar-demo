export const isDesktop = () => {
	return window.matchMedia('(min-width: 1280px)').matches;
};
