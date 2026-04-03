import type {
	AnnouncementConfig,
	CommentConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	FullscreenWallpaperConfig,
	LicenseConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PermalinkConfig,
	ProfileConfig,
	RandomPostsConfig,
	RelatedPostsConfig,
	SakuraConfig,
	ShareConfig,
	SidebarLayoutConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// Remove i18n import to avoid circular dependencies

// Define site language
const SITE_LANG = "en"; // Language code, e.g.: 'en', 'zh_CN', 'ja', etc.
const SITE_TIMEZONE = 8; // Set your website timezone from -12 to 12, default is UTC+8
export const siteConfig: SiteConfig = {
	title: "The Owl’s Nest",
	subtitle: "Cybersecurity Blog",
	siteURL: "https://the-owl-s-nest-blog.vercel.app", // Please replace with your site URL, ending with a slash
	siteStartDate: "2026-04-04", // Site start date, used for site statistics component to calculate running days

	timeZone: SITE_TIMEZONE,

	lang: SITE_LANG,

	themeColor: {
		hue: 240, // Default theme color hue, range from 0 to 360. e.g.: red: 0, cyan: 200, teal: 250, pink: 345
		fixed: false, // Hide theme color picker from visitors
	},

	// Featured page toggle configuration (closing unused pages helps improve SEO, remember to remove corresponding links in navbarConfig after closing)
	featurePages: {
		anime: false, // Anime page toggle
		diary: false, // Diary page toggle
		friends: false, // Friends page toggle
		projects: true, // Projects page toggle
		skills: true, // Skills page toggle
		timeline: false, // Timeline page toggle
		albums: false, // Albums page toggle
		devices: false, // Devices page toggle
	},

	// Navbar title configuration
	navbarTitle: {
		// Display mode: "text-icon" shows icon+text, "logo" shows only logo
		mode: "text-icon",
		// Navbar title text
		text: "AbuElOyun",
		// Navbar title icon path, default uses public/assets/home/home.webp
		icon: "assets/home/3.webp",
		// Website logo image path
		logo: "assets/home/3.webp",
	},

	// Page auto-scaling configuration
	pageScaling: {
		enable: true, // Enable auto-scaling
		targetWidth: 2000, // Target width, scaling starts when below this width
	},

	bangumi: {
		userId: "your-bangumi-id", // Set your Bangumi user ID here, can be set to "sai" for testing
		fetchOnDev: false, // Whether to fetch Bangumi data in development environment (default false), execute pnpm build first to generate json files before fetching
	},

	bilibili: {
		vmid: "your-bilibili-vmid", // Set your Bilibili user ID (uid) here, e.g. "1129280784"
		fetchOnDev: false, // Whether to fetch Bilibili data in development environment (default false)
		coverMirror: "", // Cover image mirror source (optional, if you need to use a mirror source, e.g. "https://images.weserv.nl/?url=")
		useWebp: true, // Whether to use WebP format (default true)

		// Bilibili watch progress configuration instructions (optional, read carefully if you need to configure):
		// 1. Local development: Please fill in BILI_SESSDATA=your_SESSDATA in the .env file
		// 2. Remote build: Please add BILI_SESSDATA in GitHub repository Settings -> Secrets
		// Note: SESSDATA is an account credential, to prevent leakage, never use hard coding.
		// Security tip: If SESSDATA has been leaked, please open Bilibili mobile app — My — Settings — Security & Privacy — Login Device Management — Log out all devices to destroy the leaked account credential
	},

	anime: {
		mode: "local", // Anime page mode: "bangumi" uses Bangumi API, "local" uses local configuration, "bilibili" uses Bilibili API
	},

	// Article list layout configuration
	postListLayout: {
		// Default layout mode: "list" list mode (single column layout), "grid" grid mode (double column layout)
		// Note: If sidebar configuration enables "both" double sidebars, then article list "grid" grid (double column) layout cannot be used
		defaultMode: "list",
		// Whether to allow users to switch layout
		allowSwitch: true,
		// Article list page category navigation bar configuration
		categoryBar: {
			enable: true, // Whether to display category navigation bar on article list page
		},
	},

	// Tag style configuration
	tagStyle: {
		// Whether to use new style (hover highlight style) or old style (border always on style)
		useNewStyle: false,
	},

	// Wallpaper mode configuration
	wallpaperMode: {
		// Default wallpaper mode: banner=top banner, fullscreen=fullscreen wallpaper, none=no wallpaper
		defaultMode: "banner",
		// Overall layout scheme toggle button display setting (default: "desktop")
		// "off" = do not display
		// "mobile" = display only on mobile
		// "desktop" = display only on desktop
		// "both" = display on all devices
		showModeSwitchOnMobile: "desktop",
	},

	banner: {
		// Supports single image or image array, carousel automatically enabled when array length > 1
		src: {
			desktop: [
				"/assets/desktop-banner/1.webp",
				"/assets/desktop-banner/4.webp",
				"/assets/desktop-banner/3.webp",
				"/assets/desktop-banner/2.webp",
			], // Desktop banner images
			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			], // Mobile banner images
		}, // Use local banner images

		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. Default is 'center'

		carousel: {
			enable: true, // When true: enable carousel for multiple images. When false: randomly display one image from the array
			interval: 3, // Carousel interval time (seconds)
		},

		waves: {
			enable: true, // Whether to enable water wave effect (note: this feature has high performance cost)
			performanceMode: false, // Performance mode: reduce animation complexity (40% performance improvement)
			mobileDisable: false, // Disable on mobile
		},

		// PicFlow API support (intelligent image API)
		imageApi: {
			enable: false, // Enable image API
			url: "http://domain.com/api_v2.php?format=text&count=4", // API address, returns text with one image link per line
		},
		// This requires PicFlow API's Text return type, so we need format=text parameter
		// Project address: https://github.com/matsuzaka-yuki/PicFlow-API
		// Please set up the API yourself

		homeText: {
			enable: true, // Display custom text on homepage
			title: "Cybersecurity Blog", // Homepage banner main title

			subtitle: [
				"Dream big, start small",
				"Silence. Focus. Hack",
				"Do more every day",
				"Progress over perfection",
				"Keep moving forward",
			],
			typewriter: {
				enable: true, // Enable subtitle typewriter effect

				speed: 100, // Typing speed (milliseconds)
				deleteSpeed: 50, // Deletion speed (milliseconds)
				pauseTime: 2000, // Pause time after full display (milliseconds)
			},
		},

		credit: {
			enable: false, // Display banner image source text

			text: "Describe", // Source text to display
			url: "", // (Optional) URL link to original artwork or artist page
		},

		navbar: {
			transparentMode: "semifull", // Navbar transparent mode: "semi" semi-transparent with rounded corners, "full" fully transparent, "semifull" dynamic transparent
		},
	},
	toc: {
		enable: true, // Master switch, enable TOC function
		mobileTop: true, // Mobile top TOC button
		desktopSidebar: true, // Desktop right sidebar TOC
		floating: true, // Floating TOC button
		depth: 2, // TOC depth, 1-6, 1 means only show h1 titles, 2 means show h1 and h2 titles, and so on
		useJapaneseBadge: true, // Use Japanese kana marks (あいうえお...) instead of numbers, when enabled changes 1, 2, 3... to あ、い、う...
	},
	showCoverInContent: true, // Display article cover on article content page
	generateOgImages: false, // Enable OpenGraph image generation feature, note that enabling this takes a long time to render, not recommended for local debugging
	favicon: [
		// Leave blank to use default favicon
		// {
		//   src: '/favicon/icon.png',    // Icon file path
		//   theme: 'light',              // Optional, specify theme 'light' | 'dark'
		//   sizes: '32x32',              // Optional, icon size
		// }
	],

	// Font configuration
	font: {
		// Note: Custom fonts need to be imported in src/styles/main.css
		// Note: Font subset optimization currently only supports TTF format fonts, needs to be in production environment to see effect, displays browser default font in Dev environment!
		asciiFont: {
			// English font - highest priority
			// Specified as English font means regardless of font coverage range, only ASCII character subset will be retained
			fontFamily: "ZenMaruGothic-Medium",
			fontWeight: "400",
			localFonts: ["ZenMaruGothic-Medium.ttf"],
			enableCompress: true, // Enable font subset optimization to reduce font file size
		},
		cjkFont: {
			// CJK font - as fallback font
			fontFamily: "Loli Font 2nd Edition",
			fontWeight: "500",
			localFonts: ["loli.ttf"],
			enableCompress: true, // Enable font subset optimization to reduce font file size
		},
	},
	showLastModified: true, // Control the display of "Last edited" card
	pageProgressBar: {
		enable: true, // Enable page top progress bar
		height: 3, // Progress bar height 3px
		duration: 6000, // Animation duration 6s
	},

	thirdPartyAnalytics: {
		enable: false, // Whether to enable third-party statistics (Microsoft Clarity), default off, enabling may affect Lighthouse score
		clarityId: "", // Clarity project ID
	},
};
export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	src: {
		desktop: [
			"/assets/desktop-banner/1.webp",
			"/assets/desktop-banner/2.webp",
			"/assets/desktop-banner/3.webp",
			"/assets/desktop-banner/4.webp",
		], // Desktop banner images
		mobile: [
			"/assets/mobile-banner/1.webp",
			"/assets/mobile-banner/2.webp",
			"/assets/mobile-banner/3.webp",
			"/assets/mobile-banner/4.webp",
		], // Mobile banner images
	}, // Use local banner images
	position: "center", // Wallpaper position, equivalent to object-position
	carousel: {
		enable: true, // Enable carousel
		interval: 5, // Carousel interval time (seconds)
	},
	zIndex: -1, // Z-index, ensure wallpaper is in background layer
	opacity: 0.8, // Wallpaper opacity
	blur: 1, // Background blur level
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		// Supports custom navbar links, supports multi-level menus
		{
			name: "Links",
			url: "/links/",
			icon: "material-symbols:link",
			children: [
				{
					name: "GitHub",
					url: "https://github.com/AbuElOyun",
					external: true,
					icon: "fa7-brands:github",
				},
				{
					name: "Twitter",
					url: "https://x.com/abo_el3n1in",
					external: true,
					icon: "fa7-brands:twitter",
				},
				{
					name: "LinkedIn",
					url: "https://www.linkedin.com/in/omar-abu-al-enein-317594356/",
					external: true,
					icon: "fa7-brands:linkedin",
				},
				{
					name: "Discord",
					url: "https://discord.gg/Vf8ThNCNZd",
					external: true,
					icon: "fa7-brands:discord",
				},
				{
					name: "Facebook",
					url: "https://www.facebook.com/mrabwalnyn.140334",
					external: true,
					icon: "fa7-brands:facebook",
				},
			],
		},
		{
			name: "About",
			url: "/content/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
			],
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/UdcsESPYQvuNuBBFwtUgRw.png", // Relative to /src directory. If starting with '/', relative to /public directory
	name: "AbuElOyun",
	bio: "Just a Hacker - Little boy with big dreams, a hacker wannabe",
	typewriter: {
		enable: true, // Enable profile bio typewriter effect
		speed: 80, // Typing speed (milliseconds)
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/AbuElOyun",
		},
		{
			name: "Twitter",
			icon: "fa7-brands:twitter",
			url: "https://x.com/abo_el3n1in",
		},
		{
			name: "LinkedIn",
			icon: "fa7-brands:linkedin",
			url: "https://www.linkedin.com/in/omar-abu-al-enein-317594356/",
		},
		{
			name: "Discord",
			icon: "fa7-brands:discord",
			url: "https://discord.gg/Vf8ThNCNZd",
		},
		{
			name: "Facebook",
			icon: "fa7-brands:facebook",
			url: "https://www.facebook.com/mrabwalnyn.140334",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Permalink configuration
export const permalinkConfig: PermalinkConfig = {
	enable: false, // Whether to enable global permalink function, uses default filename as link when off
	/**
	 * Permalink format template
	 * Supported placeholders:
	 * - %year% : 4-digit year (2024)
	 * - %monthnum% : 2-digit month (01-12)
	 * - %day% : 2-digit date (01-31)
	 * - %hour% : 2-digit hour (00-23)
	 * - %minute% : 2-digit minute (00-59)
	 * - %second% : 2-digit second (00-59)
	 * - %post_id% : Article sequence number (sorted by publish time ascending, earliest article is 1)
	 * - %postname% : Article filename (slug, usually all lowercase)
	 * - %raw_postname% : Article original filename (preserve case)
	 * - %category% : Category name ("uncategorized" when no category)
	 *
	 * Examples:
	 * - "%year%-%monthnum%-%postname%" => "/2024-12-my-post/"
	 * - "%post_id%-%postname%" => "/42-my-post/"
	 * - "%category%-%postname%" => "/tech-my-post/"
	 * - "%year%/%monthnum%/%day%/%postname%" => "/2024/12/01/my-post/"
	 *
	 * Note: Supports using slash "/" to build nested paths.
	 */
	format: "%postname%", // Default uses filename
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (like background color) have been overridden, please refer to the astro.config.mjs file.
	// Please choose dark theme, as this blog theme currently only supports dark background
	theme: "github-dark",
	// Whether to hide code blocks during theme transition to avoid lag issues
	hideDuringThemeTransition: true,
};

export const commentConfig: CommentConfig = {
	enable: false, // Enable comment function. When set to false, comment component will not display in article area.
	system: "twikoo", // Comment system selection: "twikoo" | "giscus"
	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: SITE_LANG,
	},
	giscus: {
		repo: "your-github-username/your-repo-name",
		repoId: "your-repo-id",
		category: "Announcements",
		categoryId: "your-category-id",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: SITE_LANG,
		loading: "lazy",
	},
};

export const shareConfig: ShareConfig = {
	enable: true, // Enable share function
};

export const announcementConfig: AnnouncementConfig = {
	title: "", // Announcement title, leave empty to use i18n string Key.announcement
	content: "Welcome to the blog!", // Announcement content
	closable: true, // Allow users to close the announcement
	link: {
		enable: true, // Enable link
		text: "Learn More", // Link text
		url: "/about/", // Link URL
		external: false, // Internal link
	},
};

export const musicPlayerConfig: MusicPlayerConfig = {
	enable: true, // Enable music player function
	showFloatingPlayer: true, // Display floating player UI
	floatingEntryMode: "fab", // Floating entry mode: "default" for standalone floating player, "fab" for integration into universal FAB group
	mode: "local", // Music player mode, optional "local" or "meting"
	meting_api:
		"https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r", // Meting API address
	id: "14164869977", // Playlist ID
	server: "netease", // Music source server. Some meting API sources support more platforms, generally: netease=NetEase Cloud Music, tencent=QQ Music, kugou=Kugou Music, xiami=Xiami Music, baidu=Baidu Music
	type: "playlist", // Playlist type
};

export const footerConfig: FooterConfig = {
	enable: false, // Whether to enable Footer HTML injection function
	customHtml: "", // HTML format custom footer information, e.g. ICP record number, default empty
	// Can also directly edit the FooterConfig.html file to add ICP record number and other custom content
	// Note: If customHtml is not empty, use content from customHtml; if customHtml is empty, use content from FooterConfig.html file
	// FooterConfig.html may be deprecated in some future version
};

/**
 * Sidebar layout configuration
 * Used to control the display, ordering, animation and responsive behavior of sidebar components
 * sidebar: Controls which sidebar the component is in (left or right). Note: Mobile usually does not display right sidebar content. If a component is set to right, ensure layout.position is "both".
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// Sidebar component property configuration list
	properties: [
		{
			// Component type: Profile component
			type: "profile",
			// Component position: "top" means fixed at top
			position: "top",
			// CSS class name, used for applying styles and animations
			class: "onload-animation",
			// Animation delay time (milliseconds), used for staggering animation effects
			animationDelay: 0,
		},
		{
			// Component type: Announcement component
			type: "announcement",
			// Component position: "top" means fixed at top
			position: "top",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 50,
		},
		{
			// Component type: Sidebar music component
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		{
			// Component type: Categories component
			type: "categories",
			// Component position: "sticky" means sticky positioning, can scroll
			position: "sticky",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 150,
			// Responsive configuration
			responsive: {
				// Collapse threshold: automatically collapse when category count exceeds 5
				collapseThreshold: 5,
			},
		},
		{
			// Component type: Tags component
			type: "tags",
			// Component position: "sticky" means sticky positioning
			position: "top",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 250,
			// Responsive configuration
			responsive: {
				// Collapse threshold: automatically collapse when tag count exceeds 20
				collapseThreshold: 20,
			},
		},
		{
			// Component type: Card-style TOC component
			type: "card-toc",
			// Component position
			position: "sticky",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 200,
		},
		{
			// Component type: Site statistics component
			type: "site-stats",
			// Component position
			position: "top",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 200,
		},
		{
			// Component type: Calendar component (not displayed on mobile)
			type: "calendar",
			// Component position
			position: "top",
			// CSS class name
			class: "onload-animation",
			// Animation delay time
			animationDelay: 250,
		},
	],

	// Sidebar component layout configuration
	components: {
		left: ["profile", "announcement", "tags", "card-toc"],
		right: ["site-stats", "calendar", "categories", "music-sidebar"],
		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
	},

	// Default animation configuration
	defaultAnimation: {
		// Whether to enable default animation
		enable: true,
		// Base delay time (milliseconds)
		baseDelay: 0,
		// Increment delay time (milliseconds), delay added sequentially for each component
		increment: 50,
	},

	// Responsive layout configuration
	responsive: {
		// Breakpoint configuration (pixel values)
		breakpoints: {
			// Mobile breakpoint: screen width less than 768px
			mobile: 768,
			// Tablet breakpoint: screen width less than 1280px
			tablet: 1280,
			// Desktop breakpoint: screen width greater than or equal to 1280px
			desktop: 1280,
		},
	},
};

export const sakuraConfig: SakuraConfig = {
	enable: false, // Default off for sakura effect
	sakuraNum: 21, // Sakura quantity
	limitTimes: -1, // Sakura out-of-bounds limit times, -1 for infinite loop
	size: {
		min: 0.5, // Sakura minimum size multiplier
		max: 1.1, // Sakura maximum size multiplier
	},
	opacity: {
		min: 0.3, // Sakura minimum opacity
		max: 0.9, // Sakura maximum opacity
	},
	speed: {
		horizontal: {
			min: -1.7, // Horizontal movement speed minimum
			max: -1.2, // Horizontal movement speed maximum
		},
		vertical: {
			min: 1.5, // Vertical movement speed minimum
			max: 2.2, // Vertical movement speed maximum
		},
		rotation: 0.03, // Rotation speed
		fadeSpeed: 0.03, // Fade speed, should not be greater than minimum opacity
	},
	zIndex: 100, // Z-index, ensure sakura displays at appropriate level
};

// Pio Live2D mascot configuration
export const pioConfig: import("./types/config").PioConfig = {
	enable: false, // Enable mascot
	models: ["/pio/models/pio/model.json"], // Default model path
	position: "left", // Model position
	width: 280, // Default width
	height: 250, // Default height
	mode: "draggable", // Default is draggable mode
	hiddenOnMobile: true, // Default hidden on mobile devices
	dialog: {
		welcome: "Welcome to Mizuki Website!", // Welcome message
		touch: [
			"What are you doing?",
			"Stop touching me!",
			"HENTAI!",
			"Don't bully me like that!",
		], // Touch hints
		home: "Click here to go back to homepage!", // Home hint
		skin: ["Want to see my new outfit?", "The new outfit looks great~"], // Outfit change hints
		close: "QWQ See you next time~", // Close hint
		link: "https://github.com/LyraVoid/Mizuki", // About link
	},
};

// Related posts configuration
export const relatedPostsConfig: RelatedPostsConfig = {
	enable: true,
	maxCount: 5,
};

// Random posts configuration
export const randomPostsConfig: RandomPostsConfig = {
	enable: true,
	maxCount: 5,
};

// Export unified interface for all configurations
export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	music: musicPlayerConfig,
	layout: sidebarLayoutConfig,
	sakura: sakuraConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
	pio: pioConfig,
	share: shareConfig,
	relatedPosts: relatedPostsConfig,
	randomPosts: randomPostsConfig,
} as const;

// umamiConfig related configuration has been moved to astro.config.mjs, please insert the statistics script yourself in the <head> of the Layout.astro file
