/**
 * Theme Switching Comprehensive Performance Optimizer
 *
 * Integrated Features:
 * 1. Code block theme switching optimization (Intersection Observer + batch update)
 * 2. Heavy element optimization (temporarily disable animations, hide off-screen elements, GPU acceleration)
 *
 * Core Optimization Strategies:
 * - Only update visible code blocks, delay off-screen code blocks
 * - Temporarily disable heavy element animations and transitions during theme switching
 * - Force GPU composition layers, reduce repaints and reflows
 * - Use content-visibility to hide off-screen elements
 */

class ThemeOptimizer {
	constructor() {
		// Code block optimization related
		this.visibleBlocks = new Set();
		this.pendingThemeUpdate = null;
		this.codeBlockObserver = null;

		// Get whether to hide code blocks during theme transition from config
		this.hideCodeBlocksDuringTransition = true; // Default value is true
		this.initFromConfig();

		// Performance optimization related
		this.isOptimizing = false;
		this.heavySelectors = [
			".float-panel",
			"#navbar",
			".music-player",
			"#mobile-toc-panel",
			"#nav-menu-panel",
			"#search-panel",
			".dropdown-content",
			".widget",
			".post-card",
			".custom-md",
		];

		this.init();
	}

	init() {
		// Initialize from config
		this.initFromConfig();

		// Initialize code block optimization
		this.initCodeBlockOptimization();

		// Initialize theme switching interception
		this.interceptThemeSwitch();

		// Apply code block transition behavior settings
		this.applyCodeBlockTransitionBehavior();

		// Setup Swup hooks to ensure reinitialization during page transitions
		this.setupSwupHooks();

		// Notify other components that theme optimizer is ready
		document.dispatchEvent(new CustomEvent("themeOptimizerReady"));
	}

	// ==================== Swup Hooks Setup ====================

	setupSwupHooks() {
		// Function to setup Swup hooks
		const setupHooks = () => {
			if (window.swup) {
				// Listen to page:view event
				window.swup.hooks.on("page:view", () => {
					// Reinitialize code block optimization after page transition
					setTimeout(() => {
						this.observeCodeBlocks();
						this.applyCodeBlockTransitionBehavior();
						// Ensure theme transition styles are correctly applied
						this.forceApplyThemeTransitionStyles();
					}, 100);
				});

				// Listen to content:replace event (fires earlier)
				window.swup.hooks.on("content:replace", () => {
					// Reapply code block transition behavior during content replacement
					setTimeout(() => {
						this.applyCodeBlockTransitionBehavior();
						// Ensure theme transition styles are correctly applied
						this.forceApplyThemeTransitionStyles();
					}, 50);
				});

				return true;
			}
			return false;
		};

		// Try to set Swup hooks immediately
		if (!setupHooks()) {
			// If Swup is not yet initialized, wait for it to load
			document.addEventListener("swup:enable", () => {
				setupHooks();
			});

			// Additional delayed retry mechanism to ensure Swup is captured
			const retryInterval = setInterval(() => {
				if (setupHooks()) {
					clearInterval(retryInterval);
				}
			}, 100);

			// Retry at most 20 times (2 seconds)
			setTimeout(() => {
				clearInterval(retryInterval);
			}, 2000);
		}
	}

	forceApplyThemeTransitionStyles() {
		// Force apply theme transition styles to ensure they work correctly after page transitions
		const codeBlocks = document.querySelectorAll(".expressive-code");

		codeBlocks.forEach((block) => {
			// Ensure code blocks have correct classes
			if (this.hideCodeBlocksDuringTransition) {
				block.classList.add("hide-during-transition");
			} else {
				block.classList.remove("hide-during-transition");
			}

			// Force recalculate styles
			void block.offsetWidth;
		});

		// Check if currently in theme transition state
		const isTransitioning = document.documentElement.classList.contains(
			"is-theme-transitioning",
		);

		if (isTransitioning) {
			// If switching themes, ensure styles are immediately applied
			codeBlocks.forEach((block) => {
				if (block.classList.contains("hide-during-transition")) {
					block.style.setProperty(
						"content-visibility",
						"hidden",
						"important",
					);
					block.style.setProperty("opacity", "0.99", "important");
				}
			});
		} else {
			// If not in transition state, ensure styles return to normal
			codeBlocks.forEach((block) => {
				block.style.removeProperty("content-visibility");
				block.style.removeProperty("opacity");
			});
		}
	}

	// ==================== Configuration Initialization ====================

	initFromConfig() {
		try {
			// Try to get settings from config
			// Check if settings already passed from config exist
			const configCarrier = document.getElementById("config-carrier");
			if (
				configCarrier &&
				configCarrier.dataset.hideCodeBlocksDuringTransition !==
					undefined
			) {
				this.hideCodeBlocksDuringTransition =
					configCarrier.dataset.hideCodeBlocksDuringTransition ===
					"true";
			}
		} catch (error) {
			this.hideCodeBlocksDuringTransition = true; // Default to enabled
		}
	}

	applyCodeBlockTransitionBehavior() {
		// Apply code block behavior settings during theme switching
		const codeBlocks = document.querySelectorAll(".expressive-code");

		codeBlocks.forEach((block) => {
			if (this.hideCodeBlocksDuringTransition) {
				// Default behavior: add class to hide during theme switching
				block.classList.add("hide-during-transition");
			} else {
				// If configured not to hide, remove class
				block.classList.remove("hide-during-transition");
			}
		});

		// Ensure rules in temporary stylesheet are consistent with current settings
		this.updateTempStyleSheet();
	}

	updateTempStyleSheet() {
		// If temporary stylesheet exists, update its content to reflect current settings
		if (this.tempStyleSheet) {
			// Get current content
			let content = this.tempStyleSheet.textContent;

			// Update code block hiding rules
			const hideRule = `.is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* Avoid flickering */
        opacity: 0.99;
      }`;

			const showRule = `.is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* Keep code blocks visible but disable transition effects */
        content-visibility: visible !important;
        opacity: 1 !important;
      }`;

			// Check if these rules already exist, if not add them
			if (!content.includes(".is-theme-transitioning .expressive-code")) {
				content += "\n" + hideRule + "\n" + showRule;
				this.tempStyleSheet.textContent = content;
			}
		}
	}

	// ==================== Code Block Optimization ====================

	initCodeBlockOptimization() {
		// Create Intersection Observer to track visible code blocks
		this.codeBlockObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.visibleBlocks.add(entry.target);
						// If there is a pending theme update, apply immediately
						if (this.pendingThemeUpdate) {
							this.applyThemeToBlock(
								entry.target,
								this.pendingThemeUpdate,
							);
						}
					} else {
						this.visibleBlocks.delete(entry.target);
					}
				});
			},
			{
				rootMargin: "50px 0px",
				threshold: 0.01,
			},
		);

		// Observe all code blocks
		this.observeCodeBlocks();

		// Listen to theme changes
		this.setupThemeListener();

		// Re-observe when page changes
		if (window.swup) {
			window.swup.hooks.on("page:view", () => {
				setTimeout(() => this.observeCodeBlocks(), 100);
			});
		}
	}

	observeCodeBlocks() {
		this.visibleBlocks.clear();

		requestAnimationFrame(() => {
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				this.codeBlockObserver.observe(block);

				// Set code block behavior during theme switching based on config
				if (this.hideCodeBlocksDuringTransition) {
					block.classList.add("hide-during-transition");
				} else {
					block.classList.remove("hide-during-transition");
				}
			});
		});
	}

	setupThemeListener() {
		// Listen to data-theme attribute changes
		const themeObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "data-theme"
				) {
					const newTheme =
						document.documentElement.getAttribute("data-theme");
					this.handleThemeChange(newTheme);
					break;
				}
			}
		});

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
	}

	handleThemeChange(newTheme) {
		this.pendingThemeUpdate = newTheme;

		const visibleBlocksArray = Array.from(this.visibleBlocks);

		if (visibleBlocksArray.length === 0) {
			return;
		}

		// Batch update visible code blocks
		this.batchUpdateBlocks(visibleBlocksArray, newTheme);
	}

	batchUpdateBlocks(blocks, theme) {
		const batchSize = 3;
		let currentIndex = 0;

		const processBatch = () => {
			const batch = blocks.slice(currentIndex, currentIndex + batchSize);

			requestAnimationFrame(() => {
				batch.forEach((block) => {
					this.applyThemeToBlock(block, theme);
				});

				currentIndex += batchSize;

				if (currentIndex < blocks.length) {
					setTimeout(processBatch, 0);
				}
			});
		};

		processBatch();
	}

	applyThemeToBlock(block, theme) {
		// Mark this code block as updated
		block.dataset.themeUpdated = theme;
	}

	// ==================== Heavy Element Optimization ====================

	interceptThemeSwitch() {
		// Listen to class changes to intercept theme switching
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class" &&
					mutation.target === document.documentElement
				) {
					const classList = document.documentElement.classList;
					const isTransitioning = classList.contains(
						"is-theme-transitioning",
					);
					const useViewTransition = classList.contains(
						"use-view-transition",
					);

					if (isTransitioning && !this.isOptimizing) {
						this.optimizeThemeSwitch(useViewTransition);
					} else if (!isTransitioning && this.isOptimizing) {
						this.restoreAfterThemeSwitch(useViewTransition);
					}
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
	}

	optimizeThemeSwitch(useViewTransition = false) {
		this.isOptimizing = true;
		this.useViewTransition = useViewTransition;

		// If using View Transitions, no extra optimization needed, let browser handle it
		if (useViewTransition) {
			return;
		}

		// 1. Temporarily disable heavy element animations
		this.disableHeavyAnimations();

		// 2. Hide heavy elements outside viewport
		this.hideOffscreenHeavyElements();

		// 3. Force GPU compositing layer
		this.forceCompositing();
	}

	disableHeavyAnimations() {
		if (!this.tempStyleSheet) {
			this.tempStyleSheet = document.createElement("style");
			this.tempStyleSheet.id = "theme-optimizer-temp";
			document.head.appendChild(this.tempStyleSheet);
		}

		this.tempStyleSheet.textContent = `
      /* Temporarily disable transitions and animations for heavy elements */
      .is-theme-transitioning .float-panel:not(.float-panel-closed),
      .is-theme-transitioning .music-player,
      .is-theme-transitioning .widget,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning #navbar *,
      .is-theme-transitioning .dropdown-content,
      .is-theme-transitioning .custom-md * {
        transition: none !important;
        animation: none !important;
      }
      
      /* Force isolated rendering context */
      .is-theme-transitioning .float-panel,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning .widget {
        contain: layout style paint !important;
      }
      
      /* Hide decorative elements */
      .is-theme-transitioning .gradient-overlay,
      .is-theme-transitioning .decoration,
      .is-theme-transitioning .animation-element {
        visibility: hidden !important;
      }
      
      /* Temporarily hide code blocks during theme switching to improve performance */
      /* This behavior can be controlled via expressiveCodeConfig.hideDuringThemeTransition in config */
      .is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* Avoid flickering */
        opacity: 0.99;
      }
      
      /* When disabling code block hiding feature (controlled dynamically via JavaScript) */
      .is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* Keep code blocks visible but disable transition effects */
        content-visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Ensure open TOC panel remains clickable during theme switching */
      .is-theme-transitioning .float-panel:not(.float-panel-closed) {
        pointer-events: auto !important;
      }
    `;
	}

	hideOffscreenHeavyElements() {
		const viewportHeight = window.innerHeight;
		const scrollTop = window.scrollY;

		this.hiddenElements = [];

		this.heavySelectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				const rect = element.getBoundingClientRect();
				const elementTop = rect.top + scrollTop;
				const elementBottom = elementTop + rect.height;

				// Completely outside viewport (add 200px margin)
				if (
					elementBottom < scrollTop - 200 ||
					elementTop > scrollTop + viewportHeight + 200
				) {
					const originalVisibility = element.style.contentVisibility;
					element.style.contentVisibility = "hidden";
					this.hiddenElements.push({ element, originalVisibility });
				}
			});
		});
	}

	forceCompositing() {
		const criticalElements = document.querySelectorAll(`
      .expressive-code,
      .post-card,
      .widget,
      #navbar
    `);

		this.compositedElements = [];

		criticalElements.forEach((element) => {
			const original = element.style.transform;
			element.style.transform = "translateZ(0)";
			element.style.willChange = "transform";

			this.compositedElements.push({ element, original });
		});
	}

	restoreAfterThemeSwitch(useViewTransition = false) {
		this.isOptimizing = false;

		// If using View Transitions, just clean up
		if (useViewTransition) {
			this.useViewTransition = false;
			return;
		}

		// Delayed restore to ensure theme switching is fully complete
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				// Remove temporary stylesheet
				if (this.tempStyleSheet && this.tempStyleSheet.parentNode) {
					this.tempStyleSheet.remove();
					this.tempStyleSheet = null;
				}

				// Restore hidden elements
				if (this.hiddenElements) {
					this.hiddenElements.forEach(
						({ element, originalVisibility }) => {
							element.style.contentVisibility =
								originalVisibility || "";
						},
					);
					this.hiddenElements = null;
				}

				// Restore compositing layer settings
				if (this.compositedElements) {
					this.compositedElements.forEach(({ element, original }) => {
						element.style.transform = original || "";
						element.style.willChange = "";
					});
					this.compositedElements = null;
				}
			});
		});
	}

	// Cleanup resources
	destroy() {
		if (this.codeBlockObserver) {
			this.codeBlockObserver.disconnect();
		}
		this.visibleBlocks.clear();
	}
}

// Initialize optimizer
const themeOptimizer = new ThemeOptimizer();

// Export to global (unified API)
window.themeOptimizer = themeOptimizer;
