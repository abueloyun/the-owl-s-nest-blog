import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
} from "../constants/constants";

export interface SiteConfig {
	title: string;
	subtitle: string;
	siteURL: string; // Site URL, ending with a slash, e.g.: https://mizuki.mysqil.com/
	keywords?: string[]; // Site keywords, used for generating <meta name="keywords">
	siteStartDate?: string; // Site start date, format: YYYY-MM-DD, used for calculating running days

	timeZone:
		| -12
		| -11
		| -10
		| -9
		| -8
		| -7
		| -6
		| -5
		| -4
		| -3
		| -2
		| -1
		| 0
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 9
		| 10
		| 11
		| 12;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// Featured page toggle configuration
	featurePages: {
		anime: boolean; // Anime page toggle
		diary: boolean; // Diary page toggle
		friends: boolean; // Friends page toggle
		projects: boolean; // Projects page toggle
		skills: boolean; // Skills page toggle
		timeline: boolean; // Timeline page toggle
		albums: boolean; // Albums page toggle
		devices: boolean; // Devices page toggle
	};

	// Article list layout configuration
	postListLayout: {
		defaultMode: "list" | "grid"; // Default layout mode: list=list mode, grid=grid mode
		allowSwitch: boolean; // Whether to allow users to switch layout
		categoryBar?: {
			enable: boolean; // Whether to display category navigation bar on article list page
		};
	};

	// Navbar title configuration
	navbarTitle?: {
		mode?: "text-icon" | "logo"; // Display mode: "text-icon" shows icon+text, "logo" shows only logo
		text: string; // Navbar title text
		icon?: string; // Navbar title icon path
		logo?: string; // Website logo image path
	};

	// Page auto-scaling configuration
	pageScaling?: {
		enable: boolean; // Enable auto-scaling
		targetWidth?: number; // Target width, scaling starts when below this width
	};

	// Add font configuration
	font: {
		asciiFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
		cjkFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
	};

	// Add bangumi configuration
	bangumi?: {
		userId?: string; // Bangumi user ID
		fetchOnDev?: boolean;
	};

	// Add bilibili configuration
	bilibili?: {
		vmid?: string; // Bilibili user ID (vmid)
		fetchOnDev?: boolean; // Whether to fetch Bilibili data in development environment
		coverMirror?: string; // Cover image mirror source (optional, default is empty string)
		useWebp?: boolean; // Whether to use WebP format (default true)
	};

	// Add anime page configuration
	anime?: {
		mode?: "bangumi" | "local" | "bilibili"; // Anime page mode
	};

	// Tag style configuration
	tagStyle?: {
		useNewStyle?: boolean; // Whether to use new style (hover highlight) or old style (border always on)
	};

	// Wallpaper mode configuration
	wallpaperMode: {
		defaultMode: "banner" | "fullscreen" | "none"; // Default wallpaper mode: banner=top banner, fullscreen=fullscreen wallpaper, none=no wallpaper
		showModeSwitchOnMobile?: "off" | "mobile" | "desktop" | "both"; // Overall layout switch button display setting: off=hide, mobile=only mobile, desktop=only desktop, both=show all
	};

	banner: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  }; // Support single image, image array, or separate desktop and mobile images
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean; // Whether to enable carousel
			interval: number; // Carousel interval time (seconds)
		};
		waves?: {
			enable: boolean; // Whether to enable water wave effect
			performanceMode?: boolean; // Performance mode: reduce animation complexity
			mobileDisable?: boolean; // Disable on mobile
		};
		imageApi?: {
			enable: boolean; // Whether to enable image API
			url: string; // API address, returns text with one image link per line
		};
		homeText?: {
			enable: boolean; // Whether to display custom text on homepage
			title?: string; // Main title
			subtitle?: string | string[]; // Subtitle, supports single string or string array
			typewriter?: {
				enable: boolean; // Whether to enable typewriter effect
				speed: number; // Typing speed (milliseconds)
				deleteSpeed: number; // Deletion speed (milliseconds)
				pauseTime: number; // Pause time after full display (milliseconds)
			};
		};
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // Navbar transparent mode
		};
	};
	toc: {
		enable: boolean; // Master switch, false means all TOC hidden
		mobileTop: boolean; // Mobile top TOC button
		desktopSidebar: boolean; // Desktop right sidebar TOC
		floating: boolean; // Floating TOC button
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // Use Japanese kana marks (あいうえお...) instead of numbers
	};
	showCoverInContent: boolean; // Control article cover display on article content page
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // Control "Last edited" card display
	pageProgressBar?: PageProgressBarConfig; // Page top progress bar configuration
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // Third-party analytics configuration
}

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Anime = 4,
	Diary = 5,
	Albums = 6,
	Projects = 7,
	Skills = 8,
	Timeline = 9,
}

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // Menu item icon
	children?: (NavBarLink | LinkPreset)[]; // Support sub-menu, can be NavBarLink or LinkPreset
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
}

export interface ProfileConfig {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	typewriter?: {
		enable: boolean; // Whether to enable typewriter effect
		speed?: number; // Typing speed (milliseconds)
	};
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink configuration
export interface PermalinkConfig {
	enable: boolean; // Whether to enable global permalink function
	/**
	 * Permalink format template
	 * Supported placeholders:
	 * - %year% : 4-digit year (2024)
	 * - %monthnum% : 2-digit month (01-12)
	 * - %day% : 2-digit date (01-31)
	 * - %hour% : 2-digit hour (00-23)
	 * - %minute% : 2-digit minute (00-59)
	 * - %second% : 2-digit second (00-59)
	 * - %post_id% : Article sequence number (sorted by publish time ascending)
	 * - %postname% : Article filename (slug)
	 * - %category% : Category name ("uncategorized" when no category)
	 *
	 * Examples:
	 * - "%year%-%monthnum%-%postname%" => "2024-12-my-post"
	 * - "%post_id%-%postname%" => "42-my-post"
	 * - "%category%-%postname%" => "tech-my-post"
	 *
	 * Note: Does not support slash "/", all generated links are in root directory
	 */
	format: string;
}

// Comment configuration

export interface CommentConfig {
	enable: boolean; // Whether to enable comment function
	system?: "twikoo" | "giscus"; // Comment system selection
	twikoo?: TwikooConfig;
	giscus?: GiscusConfig;
}

export interface GiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

interface TwikooConfig {
	envId: string;
	region?: string;
	lang?: string;
}

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_NONE;

export interface BlogPostData {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export interface ExpressiveCodeConfig {
	theme: string;
	hideDuringThemeTransition?: boolean; // Whether to hide code blocks during theme transition
}

export interface AnnouncementConfig {
	// enable property removed, now controlled by sidebarLayoutConfig
	title?: string; // Announcement title
	content: string; // Announcement content
	icon?: string; // Announcement icon
	type?: "info" | "warning" | "success" | "error"; // Announcement type
	closable?: boolean; // Whether closable
	link?: {
		enable: boolean; // Whether to enable link
		text: string; // Link text
		url: string; // Link URL
		external?: boolean; // Whether external link
	};
}

export interface MusicPlayerConfig {
	enable: boolean; // Whether to enable music player function
	showFloatingPlayer: boolean; // Whether to display floating player UI
	floatingEntryMode?: "default" | "fab"; // Floating entry mode: standalone player or integrated into FAB group
	mode: "meting" | "local"; // Music player mode
	meting_api: string; // Meting API address
	id: string; // Playlist ID
	server: string; // Music source server
	type: string; // Music type
}

export interface FooterConfig {
	enable: boolean; // Whether to enable Footer HTML injection function
	customHtml?: string; // Custom HTML content, used for adding ICP record number etc.
}

// Widget configuration type definitions
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // Card-style TOC component
	| "music-player"
	| "music-sidebar"
	| "pio" // Add pio component type
	| "site-stats" // Site statistics component
	| "calendar" // Calendar component
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // Component type
	position: "top" | "sticky"; // Component position: top fixed area or sticky area
	class?: string; // Custom CSS class name
	style?: string; // Custom inline style
	animationDelay?: number; // Animation delay time (milliseconds)
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // Hide on specified devices
		collapseThreshold?: number; // Collapse threshold
	};
	customProps?: Record<string, any>; // Custom properties, used for extending component functionality
}

export interface SidebarLayoutConfig {
	properties: WidgetComponentConfig[]; // Component configuration list
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // Whether to enable default animation
		baseDelay: number; // Base delay time (milliseconds)
		increment: number; // Increment delay time for each component (milliseconds)
	};
	responsive: {
		breakpoints: {
			mobile: number; // Mobile breakpoint (px)
			tablet: number; // Tablet breakpoint (px)
			desktop: number; // Desktop breakpoint (px)
		};
	};
}

export interface SakuraConfig {
	enable: boolean; // Whether to enable sakura effect
	sakuraNum: number; // Sakura quantity, default 21
	limitTimes: number; // Sakura out-of-bounds limit times, -1 for infinite loop
	size: {
		min: number; // Sakura minimum size multiplier
		max: number; // Sakura maximum size multiplier
	};
	opacity: {
		min: number; // Sakura minimum opacity
		max: number; // Sakura maximum opacity
	};
	speed: {
		horizontal: {
			min: number; // Horizontal movement speed minimum
			max: number; // Horizontal movement speed maximum
		};
		vertical: {
			min: number; // Vertical movement speed minimum
			max: number; // Vertical movement speed maximum
		};
		rotation: number; // Rotation speed
		fadeSpeed: number; // Fade speed
	};
	zIndex: number; // Z-index, ensure sakura displays at appropriate level
}

export interface FullscreenWallpaperConfig {
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // Support single image, image array, or separate desktop and mobile images
	position?: "top" | "center" | "bottom"; // Wallpaper position, equivalent to object-position
	carousel?: {
		enable: boolean; // Whether to enable carousel
		interval: number; // Carousel interval time (seconds)
	};
	zIndex?: number; // Z-index, ensure wallpaper is in appropriate level
	opacity?: number; // Wallpaper opacity, between 0-1
	blur?: number; // Background blur level, in px
}

/**
 * Pio Live2D mascot configuration
 */
export interface PioConfig {
	enable: boolean; // Whether to enable mascot
	models?: string[]; // Model file path array
	position?: "left" | "right"; // Mascot position
	width?: number; // Mascot width
	height?: number; // Mascot height
	mode?: "static" | "fixed" | "draggable"; // Display mode
	hiddenOnMobile?: boolean; // Whether to hide on mobile devices
	dialog?: {
		welcome?: string | string[]; // Welcome message
		touch?: string | string[]; // Touch hints
		home?: string; // Home hint
		skin?: [string, string]; // Outfit change hints [before, after]
		close?: string; // Close hint
		link?: string; // About link
		custom?: {
			selector: string; // CSS selector
			type: "read" | "link"; // Type
			text?: string; // Custom text
		}[];
	};
}

/**
 * Share component configuration
 */
export interface ShareConfig {
	enable: boolean; // Whether to enable share function
}

/**
 * Related posts component configuration
 */
export interface RelatedPostsConfig {
	enable: boolean; // Whether to enable related posts function
	maxCount: number; // Number of related posts
}

/**
 * Random posts component configuration
 */
export interface RandomPostsConfig {
	enable: boolean; // Whether to enable random posts function
	maxCount: number; // Number of random posts
}

/**
 * Page top progress bar configuration
 */
export interface PageProgressBarConfig {
	enable: boolean; // Whether to enable page top progress bar
	height?: number; // Progress bar height, default 3px
	duration?: number; // Animation duration, default 8000ms
}

/**
 * Third-party analytics configuration (may affect Lighthouse score)
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // Whether to enable third-party analytics (Microsoft Clarity), default off
	clarityId?: string; // Clarity project ID
}
