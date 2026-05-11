import type { CollectionEntry } from "astro:content";

import { permalinkConfig } from "../config";
import { removeFileExtension } from "./url-utils";

// Post ID mapping cache (used to store article sequence numbers sorted by time)
let postIdMap: Map<string, number> | null = null;

/**
 * Initialize post ID mapping
 * Sorted by publish time in ascending order (earliest post id = 1), draft posts not included
 * @param posts All non-draft posts
 */
export function initPostIdMap(
	posts: CollectionEntry<"posts">[],
): Map<string, number> {
	if (postIdMap) {
		return postIdMap;
	}

	// Sort by publish time in ascending order (earliest first)
	const sortedPosts = [...posts].sort(
		(a, b) => a.data.published.getTime() - b.data.published.getTime(),
	);

	postIdMap = new Map();
	sortedPosts.forEach((post, index) => {
		// id starts from 1
		postIdMap!.set(post.id, index + 1);
	});

	return postIdMap;
}

/**
 * Get the post sequence ID
 * @param postId The content collection id of the post
 * @returns Post sequence number, returns 0 if not initialized
 */
export function getPostNumericId(postId: string): number {
	if (!postIdMap) {
		// Return 0 on client or when not initialized, use default slug
		console.warn("Post ID map not initialized. Returning 0 for post_id.");
		return 0;
	}
	return postIdMap.get(postId) ?? 0;
}

/**
 * Clear post ID mapping cache (used for testing or re-initialization)
 */
export function clearPostIdMap(): void {
	postIdMap = null;
}

/**
 * Generate permalink slug
 * Generate URL slug based on configured format template and post data
 * @param post Post data
 * @returns Generated slug (without /posts/ prefix)
 */
export function generatePermalinkSlug(post: CollectionEntry<"posts">): string {
	// If post has custom permalink, use it first (not under /posts/)
	if (post.data.permalink) {
		// Remove leading and trailing slashes
		return post.data.permalink.replace(/^\/+/, "").replace(/\/+$/, "");
	}

	// If global permalink feature is not enabled, use default slug
	if (!permalinkConfig.enable) {
		// If has alias, use alias
		if (post.data.alias) {
			return post.data.alias.replace(/^\/+/, "").replace(/\/+$/, "");
		}
		// Otherwise use filename
		return removeFileExtension(post.id);
	}

	// Use global permalink format template
	const format = permalinkConfig.format;

	const published = post.data.published;
	const postname = removeFileExtension(post.id);

	let rawPostname = postname;
	// Use original file name preserving case from filePath if available
	if (post.filePath) {
		const parts = post.filePath.split("/");
		const filename = parts[parts.length - 1];
		if (filename) {
			rawPostname = removeFileExtension(filename);
		}
	}
	const category = post.data.category || "uncategorized";

	// Replace placeholders
	const slug = format
		.replace(/%year%/g, published.getFullYear().toString())
		.replace(
			/%monthnum%/g,
			(published.getMonth() + 1).toString().padStart(2, "0"),
		)
		.replace(/%day%/g, published.getDate().toString().padStart(2, "0"))
		.replace(/%hour%/g, published.getHours().toString().padStart(2, "0"))
		.replace(
			/%minute%/g,
			published.getMinutes().toString().padStart(2, "0"),
		)
		.replace(
			/%second%/g,
			published.getSeconds().toString().padStart(2, "0"),
		)
		.replace(/%post_id%/g, getPostNumericId(post.id).toString())
		.replace(/%postname%/g, postname)
		.replace(/%raw_postname%/g, rawPostname)
		.replace(/%category%/g, category);

	return slug;
}

/**
 * Check if post uses custom permalink (under root, not under /posts/)
 * @param post Post data
 */
export function hasCustomPermalink(
	post: CollectionEntry<"posts"> | { data: { permalink?: string } },
): boolean {
	return !!post.data.permalink;
}

/**
 * Get the full URL path of a post
 * @param post Post data
 * @returns URL path (e.g., /my-post/ or /custom-path/)
 */
export function getPermalinkPath(post: CollectionEntry<"posts">): string {
	const slug = generatePermalinkSlug(post);

	// All permalink generated links are under root directory
	return `/${slug}/`;
}
