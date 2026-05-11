import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * Component mapping table - maps component types to actual component paths
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/widgets/profile/Profile.astro",
	announcement: "../components/widgets/announcement/Announcement.astro",
	categories: "../components/widgets/categories/Categories.astro",
	tags: "../components/widgets/tags/Tags.astro",
	toc: "../components/widgets/toc/TOC.astro",
	"card-toc": "../components/widgets/card-toc/CardTOC.astro",
	"music-player": "../components/widgets/music-player/MusicPlayer.svelte",
	pio: "../components/widget/Pio.astro",
	"site-stats": "../components/widgets/site-stats/SiteStats.astro",
	calendar: "../components/widgets/calendar/Calendar.astro",
	custom: null,
} as const;

/**
 * Widget manager class
 * Responsible for managing dynamic loading, sorting, and rendering of sidebar components
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * Get configuration
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * Get component list by position
	 * @param position Component position: 'top' | 'sticky'
	 * @param sidebar Sidebar position (optional): 'left' | 'right' | 'drawer'
	 * @param deviceType Device type (optional): 'mobile' | 'tablet' | 'desktop'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar: "left" | "right" | "drawer" = "left",
		deviceType: "mobile" | "tablet" | "desktop" = "desktop",
	): WidgetComponentConfig[] {
		let activeSidebar = sidebar;

		// Mobile logic: entirely determined by drawer, do not merge left and right sidebars
		if (deviceType === "mobile") {
			activeSidebar = "drawer";
		}
		// Tablet logic: keep left components only when left sidebar has configured components, otherwise move right components to left
		else if (deviceType === "tablet") {
			if (sidebar === "right") {
				return [];
			}
			if (sidebar === "left") {
				activeSidebar =
					this.config.components.left.length > 0 ? "left" : "right";
			}
		}

		const componentTypes = this.config.components[activeSidebar] || [];

		return componentTypes
			.map((type) => {
				const prop = this.config.properties.find(
					(p) => p.type === type,
				);
				if (prop && prop.position === position) {
					return prop;
				}
				// If not found in properties and position matches default top, return a basic configuration
				if (!prop && position === "top") {
					return { type, position: "top" } as WidgetComponentConfig;
				}
				return null;
			})
			.filter(Boolean) as WidgetComponentConfig[];
	}

	/**
	 * Get component animation delay
	 * @param component Component configuration
	 * @param index Component index in the list
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * Get component CSS class names
	 * @param component Component configuration
	 * @param index Component index in the list
	 */
	getComponentClass(
		component: WidgetComponentConfig,
		_index: number,
	): string {
		const classes: string[] = [];

		// Add base class name
		if (component.class) {
			classes.push(component.class);
		}

		// Add responsive hidden class names
		if (component.responsive?.hidden) {
			component.responsive.hidden.forEach((device) => {
				switch (device) {
					case "mobile":
						classes.push("hidden", "md:block");
						break;
					case "tablet":
						classes.push("md:hidden", "lg:block");
						break;
					case "desktop":
						classes.push("lg:hidden");
						break;
				}
			});
		}

		return classes.join(" ");
	}

	/**
	 * Get component inline styles
	 * @param component Component configuration
	 * @param index Component index in the list
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// Add custom styles
		if (component.style) {
			styles.push(component.style);
		}

		// Add animation delay styles
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * Check if component should be collapsed
	 * @param component Component configuration
	 * @param itemCount Number of component content items
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * Get component path
	 * @param componentType Component type
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * Check if sidebar should be shown on current device
	 * @param deviceType Device type
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (deviceType === "mobile") {
			return this.config.components.drawer.length > 0;
		}
		if (deviceType === "tablet") {
			return (
				this.config.components.left.length > 0 ||
				this.config.components.right.length > 0
			);
		}
		// desktop
		return (
			this.config.components.left.length > 0 ||
			this.config.components.right.length > 0
		);
	}

	/**
	 * Get device breakpoint configuration
	 */
	getBreakpoints() {
		return this.config.responsive.breakpoints;
	}

	/**
	 * Update component configuration
	 * @param newConfig New configuration
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * Add new component to layout
	 * @param type Component type
	 * @param sidebar Sidebar position
	 */
	addComponentToLayout(
		type: WidgetComponentType,
		sidebar: "left" | "right" | "drawer" = "left",
	): void {
		if (!this.config.components[sidebar].includes(type)) {
			this.config.components[sidebar].push(type);
		}
	}

	/**
	 * Remove component from layout
	 * @param type Component type
	 */
	removeComponentFromLayout(type: WidgetComponentType): void {
		this.config.components.left = this.config.components.left.filter(
			(t) => t !== type,
		);
		this.config.components.right = this.config.components.right.filter(
			(t) => t !== type,
		);
		this.config.components.drawer = this.config.components.drawer.filter(
			(t) => t !== type,
		);
	}

	/**
	 * Check if component should be rendered in sidebar
	 * @param componentType Component type
	 */
	isSidebarComponent(componentType: WidgetComponentType): boolean {
		// Pio component is a global component, not rendered in sidebar
		return componentType !== "pio";
	}
}

/**
 * Default widget manager instance
 */
export const widgetManager = new WidgetManager();

/**
 * Utility function: Get component configuration by type
 * @param componentType Component type
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
	return widgetManager
		.getConfig()
		.properties.find((p) => p.type === componentType);
}

/**
 * Utility function: Check if component is enabled
 * @param componentType Component type
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = widgetManager.getConfig().components;
	return (
		config.left.includes(componentType) ||
		config.right.includes(componentType) ||
		config.drawer.includes(componentType)
	);
}

/**
 * Utility function: Get all enabled component types (left sidebar as main)
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	return widgetManager.getConfig().components.left;
}
