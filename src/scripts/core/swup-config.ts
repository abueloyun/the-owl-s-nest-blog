/**
 * Swup Configuration Module
 * Provides configuration constants and type definitions for page transition animations
 */

// Banner height constants
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// Selector configuration
export const SWUP_SELECTORS = {
	// Content container
	contentContainer: "#content-wrapper",

	// Animation scope
	animationScope: "#main-grid",

	// Elements to persist
	persistElements: [
		"#navbar-wrapper",
		"#sidebar",
		".music-player",
		"#pio-container",
	],

	// Banner related
	bannerWrapper: "#banner-wrapper",
	banner: "#banner",
	bannerTextOverlay: ".banner-text-overlay",

	// Navigation related
	navbar: "#navbar",
	navbarWrapper: "#navbar-wrapper",

	// TOC related
	tocWrapper: "#toc-wrapper",
	tableOfContents: "table-of-contents",

	// Other
	contentWrapper: "#content-wrapper",
	pageHeightExtend: "#page-height-extend",
	backToTopBtn: "#back-to-top-btn",
} as const;

// Transition animation configuration type
export interface TransitionConfig {
	duration: number;
	easing: string;
	easingOut: string;
	translateDistance: string;
	staggerDelay: number;
}

// Transition animation default config - inspired by Firefly theme's fast and smooth experience
export const TRANSITION_CONFIG: TransitionConfig = {
	duration: 120,
	easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
	easingOut: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
	translateDistance: "1.5rem",
	staggerDelay: 35,
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
	// Page enter animation duration (ms)
	pageEnterDuration: TRANSITION_CONFIG.duration,

	// Page leave animation duration (ms)
	pageLeaveDuration: 150,

	// Page height extension delay (ms)
	heightExtendDelay: 150,

	// TOC ready delay (ms)
	tocReadyDelay: 80,

	// Comment system initialization delay (ms)
	commentInitDelay: 250,

	// Mobile banner animation delay (ms)
	mobileBannerDelay: 80,
	mobileContentDelay: 120,
} as const;

// Theme configuration
export const THEME_CONFIG = {
	// Theme storage keys
	themeStorageKey: "theme",
	hueStorageKey: "hue",

	// Theme values
	lightMode: "light",
	darkMode: "dark",

	// Expressive Code theme mapping
	lightExpressiveTheme: "github-light",
	darkExpressiveTheme: "github-dark",
} as const;

// Scroll configuration
export const SCROLL_CONFIG = {
	// Throttle interval (ms)
	throttleInterval: 16, // approximately 60fps

	// Back to top display threshold offset (pixels)
	backToTopOffset: 100,

	// Navbar hide threshold offset (pixels)
	navbarHideOffset: 88,
} as const;

// Performance mode configuration
export type PerformanceMode = "high" | "medium" | "low" | "auto";

export interface PerformanceConfig {
	// Whether to enable wave animation
	waveAnimation: {
		enabled: boolean;
		layers: number; // Desktop wave layers
		layersMobile: number; // Mobile wave layers
	};
	// Sakura effect configuration
	sakuraEffect: {
		enabled: boolean;
		maxParticles: number; // Desktop max particles
		maxParticlesMobile: number; // Mobile max particles
	};
	// Live2D/Pio configuration
	live2D: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
	// Typewriter effect
	typewriter: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
	waveAnimation: {
		enabled: true,
		layers: 4,
		layersMobile: 2,
	},
	sakuraEffect: {
		enabled: true,
		maxParticles: 60,
		maxParticlesMobile: 25,
	},
	live2D: {
		enabled: true,
		hideOnMobile: true,
	},
	typewriter: {
		enabled: true,
		hideOnMobile: true,
	},
};

// Carousel configuration type
export interface CarouselConfig {
	enable: boolean;
	interval: number;
}

// Fancybox configuration type
export interface FancyboxConfig {
	Thumbs: {
		autoStart: boolean;
		showOnStart: string;
	};
	Toolbar: {
		display: {
			left: string[];
			middle: string[];
			right: string[];
		};
	};
	animated: boolean;
	dragToClose: boolean;
	keyboard: Record<string, string>;
	fitToView: boolean;
	preload: number;
	infinite: boolean;
	Panzoom: {
		maxScale: number;
		minScale: number;
	};
	caption: boolean;
}

// Default Fancybox configuration
export const getDefaultFancyboxConfig = (): FancyboxConfig => ({
	Thumbs: { autoStart: true, showOnStart: "yes" },
	Toolbar: {
		display: {
			left: ["infobar"],
			middle: [
				"zoomIn",
				"zoomOut",
				"toggle1to1",
				"rotateCCW",
				"rotateCW",
				"flipX",
				"flipY",
			],
			right: ["slideshow", "thumbs", "close"],
		},
	},
	animated: true,
	dragToClose: true,
	keyboard: {
		Escape: "close",
		Delete: "close",
		Backspace: "close",
		PageUp: "next",
		PageDown: "prev",
		ArrowUp: "next",
		ArrowDown: "prev",
		ArrowRight: "next",
		ArrowLeft: "prev",
	},
	fitToView: true,
	preload: 3,
	infinite: true,
	Panzoom: { maxScale: 3, minScale: 1 },
	caption: false,
});

// Fancybox selectors
export const FANCYBOX_SELECTORS = {
	// Album/article images
	albumImages: ".custom-md img, #post-cover img, .moment-images img",

	// Album links
	albumLinks: ".moment-images a[data-fancybox]",

	// Single fancybox images
	singleFancybox: "[data-fancybox]:not(.moment-images a)",
} as const;
