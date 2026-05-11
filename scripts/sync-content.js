import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("Loaded .env config file\n");

// 从环境变量读取配置
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC !== "false"; // 默认启用
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || "";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");

console.log("Starting content sync...\n");

// 检查是否启用内容分离
if (!ENABLE_CONTENT_SYNC) {
	console.log("Content separation disabled (ENABLE_CONTENT_SYNC=false)");
	console.log(
		"Note: Will use local content, will not sync from remote repository",
	);
	console.log("      To enable content separation, set in .env:");
	console.log("      ENABLE_CONTENT_SYNC=true");
	console.log("      CONTENT_REPO_URL=<your-repo-url>\n");
	process.exit(0);
}

// 检查内容目录是否存在
if (!fs.existsSync(CONTENT_DIR)) {
	console.log(`Content directory does not exist: ${CONTENT_DIR}`);
	console.log("Will use standalone repository mode");

	if (!CONTENT_REPO_URL) {
		console.warn(
			"Warning: CONTENT_REPO_URL not set, will use local content",
		);
		console.log(
			"Note: Please set CONTENT_REPO_URL environment variable, or manually create content directory",
		);
		process.exit(0);
	}

	try {
		console.log(`Cloning content repository: ${CONTENT_REPO_URL}`);
		execSync(`git clone --depth 1 ${CONTENT_REPO_URL} ${CONTENT_DIR}`, {
			stdio: "inherit",
			cwd: rootDir,
		});
		console.log("Content repository cloned successfully");
	} catch (error) {
		console.error("Clone failed:", error.message);
		process.exit(1);
	}
} else {
	console.log(`Content directory already exists: ${CONTENT_DIR}`);

	if (fs.existsSync(path.join(CONTENT_DIR, ".git"))) {
		try {
			console.log("Syncing remote content (force mode)...");

			// 1. 防止本地修改丢失
			execSync("git stash push --include-untracked -m 'auto-sync'", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 2. 更新远程引用
			execSync("git fetch --all --prune", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 3. 判断分支
			let branch = "main";
			try {
				execSync("git rev-parse --verify origin/main", {
					cwd: CONTENT_DIR,
				});
			} catch {
				branch = "master";
			}

			// 4. 强制同步
			execSync(`git checkout ${branch}`, { cwd: CONTENT_DIR });
			execSync(`git reset --hard origin/${branch}`, { cwd: CONTENT_DIR });

			console.log(`Content sync successful (branch: ${branch})`);
		} catch (error) {
			console.warn("Content update failed:", error.message);
		}
	}
}

// 创建符号链接或复制内容
console.log("\nEstablishing content links...");

const contentMappings = [
	{ src: "posts", dest: "src/content/posts" },
	{ src: "spec", dest: "src/content/spec" },
	{ src: "data", dest: "src/data" },
	{ src: "images", dest: "public/images" },
];

for (const mapping of contentMappings) {
	const srcPath = path.join(CONTENT_DIR, mapping.src);
	const destPath = path.join(rootDir, mapping.dest);

	if (!fs.existsSync(srcPath)) {
		console.log(`Skipping non-existent source directory: ${mapping.src}`);
		continue;
	}

	// 如果目标已存在且不是符号链接,备份它
	if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
		const backupPath = `${destPath}.backup`;
		console.log(
			`Backing up existing content: ${mapping.dest} -> ${mapping.dest}.backup`,
		);
		if (fs.existsSync(backupPath)) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
		fs.renameSync(destPath, backupPath);
	}

	// 删除现有的符号链接
	if (fs.existsSync(destPath)) {
		fs.unlinkSync(destPath);
	}

	// 创建符号链接 (Windows 需要管理员权限,否则复制文件)
	try {
		const relPath = path.relative(path.dirname(destPath), srcPath);
		fs.symlinkSync(relPath, destPath, "junction");
		console.log(`Symbolic link created: ${mapping.dest} -> ${mapping.src}`);
	} catch (error) {
		console.log(
			`Symbolic link failed, copying content instead: ${mapping.src} -> ${mapping.dest}`,
		);
		copyRecursive(srcPath, destPath);
	}
}

console.log("\nContent sync complete\n");
try {
	// 1. 获取 content 分支名
	const branch = execSync("git rev-parse --abbrev-ref HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 2. 获取 content commit hash（短）
	const hash = execSync("git rev-parse --short HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 3. 提交主仓库
	execSync("git add .", { cwd: rootDir });

	execSync(`git commit -m "chore(content): sync ${branch}@${hash}"`, {
		cwd: rootDir,
	});

	console.log(`Committed content update (${branch}@${hash})`);
} catch {
	console.log("No changes, skipping commit");
}

// 递归复制函数
function copyRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}
