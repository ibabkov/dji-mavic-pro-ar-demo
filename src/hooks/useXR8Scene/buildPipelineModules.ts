import { APP_TITLE, LANDING_URL, LANDING_LOGO_SRC } from '@/constants/app';

/** Reads the `XRExtras` and `LandingPage` globals set by their `<script>` tags. Logs and returns `null` if either is missing. */
export const getXRExtrasGlobals = (): { xrExtras: XRExtras; landingPage: LandingPage } | null => {
	const xrExtras = window.XRExtras;
	const landingPage = window.LandingPage;
	if (!xrExtras || !landingPage) {
		console.error('[useXR8Scene] XRExtras or LandingPage not loaded. Check the Script tags in layout.');

		return null;
	}

	return { xrExtras, landingPage };
};

/** Returns the camera pipeline modules in the order the engine runs them. */
export const buildPipelineModules = (
	xr8: XR8,
	xrExtras: XRExtras,
	landingPage: LandingPage,
	sceneModule: XR8PipelineModule,
): XR8PipelineModule[] => {
	landingPage.configure({ url: LANDING_URL, backgroundColor: '#151515', mediaSrc: LANDING_LOGO_SRC, mediaAlt: APP_TITLE });

	return [
		xr8.GlTextureRenderer.pipelineModule(),
		xr8.Threejs.pipelineModule(),
		xr8.XrController.pipelineModule(),
		landingPage.pipelineModule(),
		xrExtras.FullWindowCanvas.pipelineModule(),
		xrExtras.Loading.pipelineModule(),
		xrExtras.RuntimeError.pipelineModule(),
		sceneModule,
	];
};
