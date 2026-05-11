import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fontmin from "fontmin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config file to get language settings and font configuration
async function getConfig() {
	const configPath = path.join(__dirname, "../src/config.ts");
	const configContent = fs.readFileSync(configPath, "utf-8");

	// Extract language settings
	const langMatch = configContent.match(/const SITE_LANG = ["'](.+?)["']/);
	const lang = langMatch ? langMatch[1] : "zh_CN";

	// Extract font configuration
	const fontConfigMatch = configContent.match(/font:\s*\{([\s\S]*?)\n\t\},/);
	if (!fontConfigMatch) {
		console.log("⚠ Font config not found, using default settings");
		return { lang, fonts: [] };
	}

	const fontConfigStr = fontConfigMatch[1];
	const fonts = [];

	// Parse each font type (asciiFont, cjkFont)
	const fontTypes = ["asciiFont", "cjkFont"];

	for (const fontType of fontTypes) {
		const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, "m");
		const match = fontConfigStr.match(regex);

		if (match) {
			const fontConfig = match[1];

			// Extract enableCompress
			const compressMatch = fontConfig.match(
				/enableCompress:\s*(true|false)/,
			);
			const enableCompress = compressMatch
				? compressMatch[1] === "true"
				: false;

			// Extract localFonts array
			const localFontsMatch = fontConfig.match(
				/localFonts:\s*\[(.*?)\]/s,
			);
			let localFonts = [];

			if (localFontsMatch?.[1].trim()) {
				// Extract strings from array
				const fontsStr = localFontsMatch[1];
				localFonts =
					fontsStr
						.match(/["']([^"']+)["']/g)
						?.map((s) => s.replace(/["']/g, "")) || [];
			}

			if (enableCompress && localFonts.length > 0) {
				fonts.push({
					type: fontType,
					files: localFonts,
					enableCompress,
				});
			}
		}
	}

	return { lang, fonts };
}

// Recursively read all files in directory
function readFilesRecursively(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			readFilesRecursively(filePath, fileList);
		} else {
			fileList.push(filePath);
		}
	});

	return fileList;
}

// Extract text content
function extractText(content, ext) {
	let text = content;
	let frontmatterText = "";

	// Extract and process text from frontmatter
	if (ext === ".md" || ext === ".mdx") {
		const frontmatterMatch = content.match(/^---[\s\S]*?---/m);
		if (frontmatterMatch) {
			const frontmatter = frontmatterMatch[0];

			// Extract string values from frontmatter (both quoted and unquoted)
			// Match key: value format (unquoted)
			const unquotedMatches = frontmatter.match(
				/^\s*\w+:\s*([^'"\n]+)$/gm,
			);
			if (unquotedMatches) {
				unquotedMatches.forEach((match) => {
					const value = match.replace(/^\s*\w+:\s*/, "").trim();
					// Exclude boolean, date, number and other non-text content
					if (!value.match(/^(true|false|\d{4}-\d{2}-\d{2}|\d+)$/)) {
						frontmatterText += `${value} `;
					}
				});
			}

			// Extract quoted string values
			const quotedMatches = frontmatter.match(/:\s*['"]([^'"]+)['"]/g);
			if (quotedMatches) {
				quotedMatches.forEach((match) => {
					const value = match.replace(/:\s*['"]([^'"]+)['"]/, "$1");
					frontmatterText += `${value} `;
				});
			}

			// Extract text from list items (e.g., tags list)
			const listMatches = frontmatter.match(/^\s*-\s*([^\n]+)$/gm);
			if (listMatches) {
				listMatches.forEach((match) => {
					const value = match.replace(/^\s*-\s*/, "").trim();
					frontmatterText += `${value} `;
				});
			}
		}

		// Remove frontmatter and continue processing body text
		text = text.replace(/^---[\s\S]*?---\s*/m, "");

		// Remove code block content (usually doesn't need special fonts)
		text = text.replace(/```[\s\S]*?```/g, "");
		text = text.replace(/`[^`]+`/g, "");
	}

	// Remove HTML tags
	text = text.replace(/<[^>]*>/g, " ");

	// Remove Markdown syntax
	text = text.replace(/[#*_~`[\]()]/g, " ");

	// Remove URLs
	text = text.replace(/https?:\/\/[^\s]+/g, "");

	// Remove extra whitespace
	text = text.replace(/\s+/g, " ").trim();

	// Merge frontmatter text and body text
	const finalText = `${frontmatterText} ${text}`.trim();

	return finalText;
}

// Get ASCII charset (for asciiFont)
function getAsciiCharset() {
	const chars = new Set();

	// Basic ASCII characters: space to tilde (32-126)
	for (let i = 32; i <= 126; i++) {
		chars.add(String.fromCharCode(i));
	}

	// Common symbols and punctuation
	const common = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
	for (const char of common) {
		chars.add(char);
	}

	// Numbers
	for (let i = 0; i <= 9; i++) {
		chars.add(String(i));
	}

	// English letters
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) {
		chars.add(char);
	}

	const text = Array.from(chars).sort().join("");

	return text;
}

// Get text from Meting API playlist data
async function fetchMetingPlaylistText() {
	try {
		// Read config file to get music player configuration
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check if music player is enabled
		const enableMatch = configContent.match(
			/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{[\s\S]*?enable:\s*(true|false)/,
		);
		if (!enableMatch || enableMatch[1] === "false") {
			console.log(
				"ℹ Music player disabled, skipping Meting API text collection",
			);
			return new Set();
		}

		// Extract music player configuration (use default values as config may be incomplete)
		// In actual music player component, if mode not specified in config, default to "meting"
		const musicConfigMatch = configContent.match(
			/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{([\s\S]*?)\}/,
		);
		let mode = "meting"; // Default mode
		let meting_api =
			"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
		let meting_id = "14164869977";
		let meting_server = "netease";
		let meting_type = "playlist";

		if (musicConfigMatch) {
			const configStr = musicConfigMatch[1];

			const modeMatch = configStr.match(/mode:\s*["']([^"']+)["']/);
			if (modeMatch) {
				mode = modeMatch[1];
			}

			const apiMatch = configStr.match(/meting_api:\s*["']([^"']+)["']/);
			if (apiMatch) {
				meting_api = apiMatch[1];
			}

			const idMatch = configStr.match(/id:\s*["']([^"']+)["']/);
			if (idMatch) {
				meting_id = idMatch[1];
			}

			const serverMatch = configStr.match(/server:\s*["']([^"']+)["']/);
			if (serverMatch) {
				meting_server = serverMatch[1];
			}

			const typeMatch = configStr.match(/type:\s*["']([^"']+)["']/);
			if (typeMatch) {
				meting_type = typeMatch[1];
			}
		}

		if (mode !== "meting") {
			console.log(
				'ℹ Music player mode is not "meting", skipping API text collection',
			);
			return new Set();
		}

		// Build API URL
		const apiUrl = meting_api
			.replace(":server", meting_server)
			.replace(":type", meting_type)
			.replace(":id", meting_id)
			.replace(":auth", "")
			.replace(":r", Date.now().toString());

		console.log("ℹ Fetching music playlist from Meting API...");
		console.log(`  URL: ${apiUrl}`);

		// Set request timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

		const textSet = new Set();

		try {
			const response = await fetch(apiUrl, {
				signal: controller.signal,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				},
			});
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			const playlist = await response.json();

			if (!Array.isArray(playlist)) {
				throw new Error("API response is not an array");
			}

			console.log(
				`✓ Successfully fetched ${playlist.length} songs from Meting API`,
			);

			// Extract text from song information
			let songCount = 0;
			playlist.forEach((song) => {
				const title = song.name ?? song.title ?? "";
				const artist = song.artist ?? song.author ?? "";

				// Only process valid song information
				if (title.trim() || artist.trim()) {
					songCount++;

					// Add characters from song name
					for (const char of title) {
						textSet.add(char);
					}

					// Add characters from artist name
					for (const char of artist) {
						textSet.add(char);
					}
				}
			});
			if (songCount === 0) {
				console.log("⚠ No valid song data found in API response");
			}
		} catch (fetchError) {
			clearTimeout(timeoutId);

			if (fetchError.name === "AbortError") {
				console.log(
					"⚠ Meting API request timeout (10s), skipping music text collection",
				);
			} else {
				console.log(
					`⚠ Failed to fetch Meting API data: ${fetchError.message}, skipping music text collection`,
				);
			}
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Meting API config: ${error.message}, skipping music text collection`,
		);
		return new Set();
	}
}

// Get text from Bilibili anime data
async function fetchBilibiliAnimeText() {
	try {
		// Read config file to get anime configuration
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check if anime page is enabled
		const featurePagesMatch = configContent.match(
			/featurePages:\s*\{([\s\S]*?)\}/,
		);
		if (featurePagesMatch) {
			const featureConfig = featurePagesMatch[1];
			const animeMatch = featureConfig.match(/anime:\s*(true|false)/);
			if (!animeMatch || animeMatch[1] === "false") {
				console.log(
					"ℹ Anime page disabled, skipping Bilibili text collection",
				);
				return new Set();
			}
		}

		// 提取番剧配置
		const animeModeMatch = configContent.match(
			/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);
		const mode = animeModeMatch ? animeModeMatch[1] : "bangumi";

		if (mode !== "bilibili") {
			console.log(
				`ℹ Anime mode is not "bilibili", skipping Bilibili text collection`,
			);
			return new Set();
		}

		// Read bilibili-data.json file
		const dataFilePath = path.join(
			__dirname,
			"../src/data/bilibili-data.json",
		);
		if (!fs.existsSync(dataFilePath)) {
			console.log(
				"ℹ Bilibili data file not found, skipping Bilibili text collection",
			);
			return new Set();
		}

		console.log("ℹ Reading anime data from Bilibili data file...");

		const textSet = new Set();
		const fileContent = fs.readFileSync(dataFilePath, "utf-8");
		const animeList = JSON.parse(fileContent);

		if (!Array.isArray(animeList)) {
			console.log(
				"⚠ Bilibili data is not an array, skipping text collection",
			);
			return new Set();
		}

		let processedCount = 0;

		// 处理每个动画条目
		for (const item of animeList) {
			// 提取标题
			const title = item.title || "";
			for (const char of title) {
				textSet.add(char);
			}

			// Extract description/evaluation
			const description = item.description || item.evaluate || "";
			for (const char of description) {
				textSet.add(char);
			}

			// Extract studio/region
			const studio = item.studio || "";
			for (const char of studio) {
				textSet.add(char);
			}

			// Extract year
			const year = item.year || "";
			for (const char of year) {
				textSet.add(char);
			}

			// Extract genre/tags/style
			if (item.genre && Array.isArray(item.genre)) {
				item.genre.forEach((genre) => {
					if (typeof genre === "string") {
						for (const char of genre) {
							textSet.add(char);
						}
					}
				});
			}

			// Extract subtitle (if any)
			const subtitle = item.subtitle || "";
			if (subtitle) {
				for (const char of subtitle) {
					textSet.add(char);
				}
			}

			processedCount++;
		}

		if (processedCount > 0) {
			console.log(
				`✓ Successfully processed ${processedCount} anime items from Bilibili data`,
			);
		} else {
			console.log("⚠ No anime data found in Bilibili data file");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bilibili data: ${error.message}, skipping Bilibili text collection`,
		);
		return new Set();
	}
}

// Get text from Bangumi API anime data
async function fetchBangumiAnimeText() {
	try {
		// Read config file to get anime configuration
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check if anime page is enabled
		const featurePagesMatch = configContent.match(
			/featurePages:\s*\{([\s\S]*?)\}/,
		);
		if (featurePagesMatch) {
			const featureConfig = featurePagesMatch[1];
			const animeMatch = featureConfig.match(/anime:\s*(true|false)/);
			if (!animeMatch || animeMatch[1] === "false") {
				console.log(
					"ℹ Anime page disabled, skipping Bangumi API text collection",
				);
				return new Set();
			}
		}

		// 提取番剧配置
		const bangumiUserIdMatch = configContent.match(
			/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
		);
		const animeModeMatch = configContent.match(
			/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);

		const userId = bangumiUserIdMatch ? bangumiUserIdMatch[1] : null;
		const mode = animeModeMatch ? animeModeMatch[1] : "bangumi";

		if (mode !== "bangumi" || !userId) {
			console.log(
				`ℹ Anime mode is not "bangumi" or no userId configured, skipping Bangumi API text collection`,
			);
			return new Set();
		}

		console.log("ℹ Fetching anime data from Bangumi API...");
		console.log(`  User ID: ${userId}`);

		const textSet = new Set();
		const BANGUMI_API_BASE = "https://api.bgm.tv";

		// Bangumi collection types: 1=want to watch, 2=watched, 3=watching, 4=on hold, 5=dropped
		const collectionTypes = [1, 2, 3, 4, 5];

		// Get single collection list
		async function fetchCollection(userId, subjectType, type) {
			try {
				let allData = [];
				let offset = 0;
				const limit = 50;
				let hasMore = true;

				while (hasMore) {
					const controller = new AbortController();
					const timeoutId = setTimeout(
						() => controller.abort(),
						10000,
					); // 10 second timeout

					const response = await fetch(
						`${BANGUMI_API_BASE}/v0/users/${userId}/collections?subject_type=${subjectType}&type=${type}&limit=${limit}&offset=${offset}`,
						{
							signal: controller.signal,
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
							},
						},
					);
					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(
							`HTTP ${response.status}: ${response.statusText}`,
						);
					}

					const data = await response.json();

					if (data.data && data.data.length > 0) {
						allData = [...allData, ...data.data];
					}

					if (!data.data || data.data.length < limit) {
						hasMore = false;
					} else {
						offset += limit;
					}

					// Prevent too frequent requests
					await new Promise((resolve) => setTimeout(resolve, 200));
				}

				return allData;
			} catch (error) {
				console.log(
					`⚠ Failed to fetch collection type ${type}: ${error.message}`,
				);
				return [];
			}
		}

		// Get related personnel information (production companies, etc.)
		async function fetchSubjectPersons(subjectId) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const response = await fetch(
					`${BANGUMI_API_BASE}/v0/subjects/${subjectId}/persons`,
					{
						signal: controller.signal,
						headers: {
							"User-Agent":
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
						},
					},
				);
				clearTimeout(timeoutId);

				if (!response.ok) {
					return [];
				}

				const data = await response.json();
				return Array.isArray(data) ? data : [];
			} catch (_error) {
				return [];
			}
		}

		let totalItems = 0;

		// Iterate through all collection types
		for (const type of collectionTypes) {
			const collections = await fetchCollection(userId, 2, type); // 2=anime

			if (collections.length === 0) {
				continue;
			}

			console.log(
				`✓ Fetched ${collections.length} items from collection type ${type}`,
			);
			totalItems += collections.length;

			// Process each anime entry
			for (const item of collections) {
				const subject = item.subject || {};

				// Extract title
				const titleCn = subject.name_cn || "";
				const title = subject.name || "";

				for (const char of titleCn) {
					textSet.add(char);
				}
				for (const char of title) {
					textSet.add(char);
				}

				// Extract summary
				const summary = subject.short_summary || "";
				for (const char of summary) {
					textSet.add(char);
				}

				// Extract tags
				if (subject.tags && Array.isArray(subject.tags)) {
					subject.tags.forEach((tag) => {
						if (tag.name) {
							for (const char of tag.name) {
								textSet.add(char);
							}
						}
					});
				}

				// Get detailed information (limited to 30% of items to avoid too many requests)
				if (item.subject_id && Math.random() < 0.3) {
					const persons = await fetchSubjectPersons(item.subject_id);

					persons.forEach((person) => {
						if (person.name) {
							for (const char of person.name) {
								textSet.add(char);
							}
						}
						if (person.relation) {
							for (const char of person.relation) {
								textSet.add(char);
							}
						}
					});

					// Request interval
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}
		}

		if (totalItems > 0) {
			console.log(
				`✓ Successfully processed ${totalItems} anime items from Bangumi API`,
			);
		} else {
			console.log("⚠ No anime data found from Bangumi API");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bangumi API config: ${error.message}, skipping anime text collection`,
		);
		return new Set();
	}
}

// Collect all used text (for CJK fonts)
async function collectText() {
	const { lang } = await getConfig();

	const textSet = new Set();

	// 1. Read src/data directory
	const dataDir = path.join(__dirname, "../src/data");
	const dataFiles = readFilesRecursively(dataDir);

	dataFiles.forEach((file) => {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const content = fs.readFileSync(file, "utf-8");

			// Improved string matching
			const patterns = [
				// Double quoted strings
				/"([^"\\]|\\.|\\n|\\t)*"/g,
				// Single quoted strings
				/'([^'\\]|\\.|\\n|\\t)*'/g,
				// Template strings
				/`([^`\\]|\\.|\\n|\\t)*`/g,
			];

			patterns.forEach((pattern) => {
				const matches = content.match(pattern);
				if (matches) {
					matches.forEach((match) => {
						let text = match;

						// Remove quotes and comment markers
						if (
							(text.startsWith('"') && text.endsWith('"')) ||
							(text.startsWith("'") && text.endsWith("'")) ||
							(text.startsWith("`") && text.endsWith("`"))
						) {
							text = text.slice(1, -1);
						}

						// Handle escape characters
						text = text
							.replace(/\\n/g, "\n")
							.replace(/\\t/g, "\t")
							.replace(/\\"/g, '"')
							.replace(/\\'/g, "'");

						for (const char of text) {
							textSet.add(char);
						}
					});
				}
			});

			// Simple regex as supplement
			const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
			if (stringMatches) {
				stringMatches.forEach((match) => {
					const text = match.slice(1, -1);
					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		}
	});

	// 2. Read music player local playlist constants file
	const musicConstantsFile = path.join(
		__dirname,
		"../src/components/widgets/music-player/constants.ts",
	);
	if (fs.existsSync(musicConstantsFile)) {
		const content = fs.readFileSync(musicConstantsFile, "utf-8");

		const patterns = [
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					let text = match;

					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (stringMatches) {
			stringMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 3. Read src/config.ts file
	const configFile = path.join(__dirname, "../src/config.ts");
	if (fs.existsSync(configFile)) {
		const content = fs.readFileSync(configFile, "utf-8");

		// Improved string matching
		const patterns = [
			// Double quoted strings
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			// Single quoted strings
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			// Template strings
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					// Remove quotes and comment markers
					let text = match;

					// Remove string quotes
					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					// Handle escape characters
					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					// Extract all characters (including Chinese)
					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		// As supplement, also scan with original simple regex to ensure nothing is missed
		const simpleMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (simpleMatches) {
			simpleMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 4. Read corresponding language i18n file
	const i18nFile = path.join(__dirname, `../src/i18n/languages/${lang}.ts`);
	if (fs.existsSync(i18nFile)) {
		const content = fs.readFileSync(i18nFile, "utf-8");

		// Improved string matching
		const patterns = [
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					let text = match;

					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					// Handle escape characters
					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		// Simple regex as supplement
		const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (stringMatches) {
			stringMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 5. Read content directory (path determined by environment variable)
	let contentDir;
	if (process.env.ENABLE_CONTENT_SYNC === "true" && process.env.CONTENT_DIR) {
		// Use directory specified by environment variable (relative to project root)
		contentDir = path.join(__dirname, "..", process.env.CONTENT_DIR);
		console.log(
			`ℹ Using external content directory: ${process.env.CONTENT_DIR}`,
		);
	} else {
		// Use default src/content directory
		contentDir = path.join(__dirname, "../src/content");
	}

	// Check if directory exists
	if (!fs.existsSync(contentDir)) {
		console.log(`⚠ Content directory does not exist: ${contentDir}`);
		console.log("  Skipping content text collection");
	} else {
		const contentFiles = readFilesRecursively(contentDir);

		contentFiles.forEach((file) => {
			const ext = path.extname(file);
			if ([".md", ".mdx", ".ts", ".js"].includes(ext)) {
				const content = fs.readFileSync(file, "utf-8");
				const text = extractText(content, ext);
				for (const char of text) {
					// Only keep Chinese, Japanese, Korean CJK characters and common punctuation
					if (
						char.match(
							/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/,
						)
					) {
						textSet.add(char);
					}
				}
			}
		});
	}

	// Add common punctuation and numbers
	const commonChars = "0123456789，。！？；：\"\"''（）【】《》、·—…「」『』";
	for (const char of commonChars) {
		textSet.add(char);
	}

	// Add English letters (if font supports)
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) {
		textSet.add(char);
	}

	// 6. Get text from Meting API playlist data
	const metingTextSet = await fetchMetingPlaylistText();

	// Add Meting API text to main text set
	for (const char of metingTextSet) {
		textSet.add(char);
	}

	if (metingTextSet.size > 0) {
		console.log(
			`✓ Added ${metingTextSet.size} unique characters from music playlist`,
		);
	}

	// 7. Get text from Bangumi API anime data
	const bangumiTextSet = await fetchBangumiAnimeText();

	// Add Bangumi API text to main text set
	for (const char of bangumiTextSet) {
		textSet.add(char);
	}

	if (bangumiTextSet.size > 0) {
		console.log(
			`✓ Added ${bangumiTextSet.size} unique characters from Bangumi anime data`,
		);
	}

	// 8. Get text from Bilibili data file anime data
	const bilibiliTextSet = await fetchBilibiliAnimeText();

	// Add Bilibili data text to main text set
	for (const char of bilibiliTextSet) {
		textSet.add(char);
	}

	if (bilibiliTextSet.size > 0) {
		console.log(
			`✓ Added ${bilibiliTextSet.size} unique characters from Bilibili anime data`,
		);
	}

	// Missing items (e.g., UI text scattered around not included in statistics)
	const otherWords = ["示例", "歌曲", "艺术家"];

	for (const term of otherWords) {
		for (const char of term) {
			textSet.add(char);
		}
	}

	const allText = Array.from(textSet).sort().join("");

	return allText;
}

// Compress fonts and output to dist directory
async function compressFonts() {
	try {
		// Read configuration
		const { fonts } = await getConfig();

		if (fonts.length === 0) {
			console.log(
				"⚠ No fonts to compress (enableCompress=false or localFonts is empty)",
			);
			return;
		}

		console.log(`Found ${fonts.length} font configs to compress`);

		// Check if dist directory exists
		const distDir = path.join(__dirname, "../dist");
		if (!fs.existsSync(distDir)) {
			console.log(
				"⚠ dist directory does not exist, please run astro build first",
			);
			return;
		}

		// Create dist/assets/font directory
		const distFontDir = path.join(distDir, "assets/font");
		if (!fs.existsSync(distFontDir)) {
			fs.mkdirSync(distFontDir, { recursive: true });
		}

		// Collect different character sets based on font type
		const cjkText = await collectText(); // CJK 字体使用完整字符集
		const asciiText = getAsciiCharset(); // ASCII 字体只使用 ASCII 字符集

		console.log("Starting font compression...");

		let totalOriginalSize = 0;
		let totalCompressedSize = 0;
		let processedCount = 0;

		// For collecting all errors
		const errors = [];

		// Iterate through all fonts to compress
		for (const fontConfig of fonts) {
			// Select character set based on font type
			const text = fontConfig.type === "asciiFont" ? asciiText : cjkText;

			for (const fontFile of fontConfig.files) {
				const fontSrc = path.join(
					__dirname,
					"../public/assets/font",
					fontFile,
				);
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);

				if (!fs.existsSync(fontSrc)) {
					const errorMsg = `❌ Config error [${fontConfig.type}]: Font file does not exist   In config: "${fontFile}"\n   Expected path: public/assets/font/${fontFile}\n   \n   Please check:\n   1. Is the filename correct (case sensitive)?\n   2. Is the file in public/assets/font/?\n   3. Is ${fontConfig.type}.localFonts in src/config.ts correct?`;

					errors.push(errorMsg);
					console.log(`\n${errorMsg}\n`);
					continue;
				}

				const originalSize = fs.statSync(fontSrc).size;
				totalOriginalSize += originalSize;

				// 根据文件类型决定处理方式
				if (ext === ".woff2" || ext === ".woff") {
					// woff/woff2 is already web-optimized format, further subset compression not supported
					console.log(
						`⚠ Skipping ${fontFile} (already web-optimized format)`,
					);

					// 直接复制到 dist
					const destFile = path.join(distFontDir, fontFile);
					fs.copyFileSync(fontSrc, destFile);
					totalCompressedSize += originalSize;
					// 不计入处理数量
				} else if (ext === ".ttf" || ext === ".otf") {
					// TTF/OTF needs to be compressed to woff2
					console.log(`Compressing ${fontFile}...`);

					const fontmin = new Fontmin()
						.src(fontSrc)
						.use(
							Fontmin.glyph({
								text: text,
								hinting: false,
							}),
						)
						.use(
							Fontmin.ttf2woff2({
								deflate: true,
							}),
						)
						.dest(distFontDir);

					await new Promise((resolve, reject) => {
						fontmin.run((err, files) => {
							if (err) {
								reject(err);
							} else {
								resolve(files);
							}
						});
					});

					// Check compression result
					const compressedFile = path.join(
						distFontDir,
						`${baseName}.woff2`,
					);

					if (fs.existsSync(compressedFile)) {
						const compressedSize = fs.statSync(compressedFile).size;
						totalCompressedSize += compressedSize;
						const reduction = (
							(1 - compressedSize / originalSize) *
							100
						).toFixed(2);

						console.log(
							`✓ ${fontFile} → ${baseName}.woff2 (${(compressedSize / 1024).toFixed(2)} KB, reduced ${reduction}%)`,
						);
						processedCount++;
					}
				} else {
					console.log(
						`⚠ Unsupported font format, skipping: ${fontFile}`,
					);
				}
			}
		}

		// Output summary
		if (errors.length > 0) {
			console.log("\n❌ Font compression encountered errors!");
			console.log(`${errors.length} errors, please fix and retry.\n`);

			// List actual font files that exist
			const fontDir = path.join(__dirname, "../public/assets/font");
			if (fs.existsSync(fontDir)) {
				const actualFiles = fs
					.readdirSync(fontDir)
					.filter((f) =>
						[".ttf", ".otf", ".woff", ".woff2"].includes(
							path.extname(f).toLowerCase(),
						),
					);

				if (actualFiles.length > 0) {
					console.log("Available font files:");
					actualFiles.forEach((f) => console.log(`  - ${f}`));
				} else {
					console.log("  (font directory is empty)");
				}
			}

			process.exit(1);
		}

		if (processedCount > 0) {
			const totalReduction = (
				(1 - totalCompressedSize / totalOriginalSize) *
				100
			).toFixed(2);
			console.log("\n✓ Font optimization complete!");
			console.log(
				`  Files processed: ${processedCount}, Overall reduction: ${totalReduction}%`,
			);
		} else {
			console.log("\n⚠ No font files processed");
		}
	} catch (error) {
		console.error("❌ Font compression failed:", error);
		process.exit(1);
	}
}

// 更新 dist 中的 CSS，将 ttf 引用替换为 woff2（子集优化后）或保持原样
async function updateCssFontReferences() {
	try {
		const { fonts } = await getConfig();
		const distDir = path.join(__dirname, "../dist/");
		const publicFontDir = path.join(__dirname, "../public/assets/font");

		// Find all CSS files (including _astro directory)
		const cssFiles = [];
		function findCssFiles(dir) {
			if (!fs.existsSync(dir)) return;
			const files = fs.readdirSync(dir);
			files.forEach((file) => {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);
				if (stat.isDirectory()) {
					findCssFiles(filePath);
				} else if (file.endsWith(".css")) {
					cssFiles.push(filePath);
				}
			});
		}
		findCssFiles(distDir);

		if (cssFiles.length === 0) {
			console.log("⚠ No CSS files found in dist");
			return;
		}

		for (const fontConfig of fonts) {
			for (const fontFile of fontConfig.files) {
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);
				const ttfFile = fontFile;
				const woff2File = `${baseName}.woff2`;

				// 检查 woff2 是否存在（构建生成的或用户提供的）
				const distWoff2 = path.join(
					__dirname,
					`../dist/assets/font/${woff2File}`,
				);
				const publicWoff2 = path.join(
					publicFontDir,
					`${baseName}.woff2`,
				);
				const hasWoff2 =
					fs.existsSync(distWoff2) || fs.existsSync(publicWoff2);

				if (!hasWoff2) {
					console.log(
						`⚠ No woff2 found for ${baseName}, keeping ttf reference`,
					);
					continue;
				}

				// Update each CSS file
				for (const cssFile of cssFiles) {
					let cssContent = fs.readFileSync(cssFile, "utf-8");
					const originalContent = cssContent;

					// Match src referencing this font in @font-face rule
					// Match format: url("/assets/font/xxx.ttf") or url("/assets/font/xxx.ttf") format("truetype")
					const ttfPattern = new RegExp(
						`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
						"g",
					);

					if (fontConfig.enableCompress) {
						// Subset optimization: directly replace with woff2 (subsetted)
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${woff2File}") format("woff2")`,
						);
					} else {
						// Subset optimization not enabled: use original woff2 (if available), fallback to ttf
						if (fs.existsSync(publicWoff2)) {
							cssContent = cssContent.replace(
								ttfPattern,
								`url("/assets/font/${woff2File}") format("woff2"), url("/assets/font/${baseName}.ttf") format("truetype")`,
							);
						}
					}

					if (cssContent !== originalContent) {
						fs.writeFileSync(cssFile, cssContent);
						console.log(`✓ Updated CSS: ${cssFile} (${baseName})`);
					}
				}
			}
		}

		// Process woff2 files not configured in config but placed in font directory by user
		// Scan woff2 files in public/font directory, check if corresponding ttf is referenced in CSS
		const publicFiles = fs.readdirSync(publicFontDir);
		for (const file of publicFiles) {
			if (file.endsWith(".woff2")) {
				const baseName = path.basename(file, ".woff2");
				const ttfFile = `${baseName}.ttf`;

				// Check if CSS references this ttf
				for (const cssFile of cssFiles) {
					let cssContent = fs.readFileSync(cssFile, "utf-8");
					const ttfPattern = new RegExp(
						`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
						"g",
					);

					if (cssContent.match(ttfPattern)) {
						// Replace with woff2 + ttf fallback
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${file}") format("woff2"), url("/assets/font/${ttfFile}") format("truetype")`,
						);
						fs.writeFileSync(cssFile, cssContent);
						console.log(
							`✓ Updated CSS: ${cssFile} (${baseName} - woff2 fallback)`,
						);
					}
				}
			}
		}
	} catch (error) {
		console.error("⚠ CSS font reference update failed:", error.message);
		// 不退出，只是警告
	}
}

// 运行压缩
compressFonts().then(() => updateCssFontReferences());
