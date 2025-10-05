"use strict";
document.addEventListener("DOMContentLoaded", function () {
	gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, Flip);
	const body = document.querySelector("body");
	/**
	 * Preloader
	 */
	const preloader = document.querySelector(".preloader");
	window.addEventListener("load", function () {
		if (preloader) {
			setTimeout(() => {
				preloader.style.display = "none";
			}, 300);
		}
	});
	/**
	 * Slide Up
	 */
	const slideUp = (target, duration = 500) => {
		if (!target) return;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.boxSizing = "border-box";
		target.style.height = target.offsetHeight + "px";
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = "none";
			target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
		}, duration);
	};
	/**
	 * Slide Down
	 */
	const slideDown = (target, duration = 500) => {
		if (!target) return;
		target.style.removeProperty("display");
		let display = window.getComputedStyle(target).display;
		if (display === "none") display = "block";
		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = "border-box";
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
		}, duration);
	};
	/**
	 * Slide Toggle
	 */
	const slideToggle = (target, duration = 500) => {
		if (!target) return;
		if (target.style === undefined || target.style.display === "none") {
			return slideDown(target, duration);
		}
		return slideUp(target, duration);
	};
	/**
	 * Header Crossed
	 */
	let scrollTimeout;
	window.addEventListener("scroll", () => {
		if (!body) return;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const primaryHeader = document.querySelector(".primary-header");
			if (primaryHeader) {
				const primaryHeaderTop = primaryHeader.offsetHeight / 3;
				const scrolled = window.scrollY;
				if (scrolled > primaryHeaderTop) {
					body.classList.add("primary-header-crossed");
				} else {
					body.classList.remove("primary-header-crossed");
				}
			}
		}, 100);
	});
	/**
	 * Primary Menu
	 */
	const mdScreen = "(max-width: 991px)";
	const primaryHeader = document.querySelector(".primary-header");
	if (primaryHeader) {
		primaryHeader.addEventListener("click", function (e) {
			const target = e.target.closest(".has-sub-menu > a, .has-sub-2nd > a");
			if (!target) return;
			const isMobile = window.matchMedia(mdScreen).matches;
			if (isMobile) {
				e.preventDefault();
				e.stopPropagation();
				target.classList.toggle("active");
				const menuSub = target.nextElementSibling;
				if (menuSub) {
					slideToggle(menuSub, 500);
				}
			} else {
				if (!target.getAttribute("href") || target.getAttribute("href") === "#") {
					e.preventDefault();
				}
			}
		});
		window.matchMedia(mdScreen).addEventListener("change", function (e) {
			const subMenus = primaryHeader.querySelectorAll(
				".navigation-0__menu, .navigation-1__menu, .navigation-1__sub-menu"
			);
			if (!subMenus.length) return;
			for (let i = 0; i < subMenus.length; i++) {
				const menu = subMenus[i];
				if (menu.style.display !== "none") {
					slideUp(menu, 0);
					const parentLink = menu.previousElementSibling;
					if (parentLink) {
						parentLink.classList.remove("active");
					}
				}
			}
		});
	}
	/**
	 * Duplicate Scroller-X Item
	 */
	const scrollerX = document.querySelectorAll(".scroller-x");
	function scrollerXDuplication(scroller) {
		if (scroller.dataset.duplicated === "true") return;
		const scrollerInner = scroller.querySelector(".scroller-x__list");
		if (!scrollerInner) return;
		const scrollerContent = Array.from(scrollerInner.children);
		if (!scrollerContent.length) return;
		const fragment = document.createDocumentFragment();
		scrollerContent.forEach((item) => {
			const duplicateItem = item.cloneNode(true);
			fragment.appendChild(duplicateItem);
		});
		scrollerInner.appendChild(fragment);
		scroller.dataset.duplicated = "true";
	}
	scrollerX.forEach((scroller) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						scrollerXDuplication(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0 }
		);
		observer.observe(scroller);
	});
	/**
	 * Countdown Timer
	 */
	function updateCountdown() {
		const countdownElements = document.querySelectorAll(".countdown");

		if (!countdownElements.length) return;

		function updateAll() {
			const currentDate = new Date().getTime();
			let activeCountdowns = false;

			countdownElements.forEach((countdown) => {
				const targetDateStr = countdown.dataset.date;

				if (!targetDateStr) {
					console.error(
						"Error: Target date not specified in the data-date attribute."
					);
					return;
				}

				const targetDate = new Date(targetDateStr).getTime();

				if (isNaN(targetDate)) {
					console.error("Error: Invalid target date format.");
					return;
				}

				const timeDifference = targetDate - currentDate;

				if (timeDifference <= 0) {
					const selectors = [
						{ sel: ".days", val: "00" },
						{ sel: ".months", val: "00" },
						{ sel: ".hours", val: "00" },
						{ sel: ".minutes", val: "00" },
						{ sel: ".seconds", val: "00" },
					];
					selectors.forEach(({ sel, val }) => {
						const element = countdown.querySelector(sel);
						if (element) element.innerText = val;
					});
					return;
				}

				activeCountdowns = true;

				const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
				const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
				const hours = Math.floor(
					(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor(
					(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

				const selectors = [
					{ sel: ".days", val: days.toString().padStart(2, "0") },
					{ sel: ".months", val: months.toString().padStart(2, "0") },
					{ sel: ".hours", val: hours.toString().padStart(2, "0") },
					{ sel: ".minutes", val: minutes.toString().padStart(2, "0") },
					{ sel: ".seconds", val: seconds.toString().padStart(2, "0") },
				];

				selectors.forEach(({ sel, val }) => {
					const element = countdown.querySelector(sel);
					if (element) element.innerText = val;
				});
			});

			if (!activeCountdowns) {
				clearInterval(timer);
			}
		}

		updateAll();
		const timer = setInterval(updateAll, 1000);
	}
	// Initialize countdown timer
	updateCountdown();
	/**
	 * Text Copy Functionality
	 */
	const copyBtn = document.getElementById("copyBtn");
	const input = document.getElementById("walletAddress");

	if (copyBtn && input) {
		copyBtn.addEventListener("click", function () {
			if (!input.value) {
				console.warn("No wallet address to copy");
				return;
			}

			// Check if Clipboard API is available
			if (navigator.clipboard?.writeText) {
				navigator.clipboard
					.writeText(input.value)
					.then(() => {
						// Success feedback
						this.classList.add("btn-success");
						setTimeout(() => this.classList.remove("btn-success"), 2000);
					})
					.catch((err) => {
						console.error("Failed to copy:", err);
						alert("Your browser blocked clipboard access.");
					});
			} else {
				// Graceful fallback (no copy, just alert user)
				alert("Clipboard API not supported in this browser.");
			}
		});
	}

	/**
	 * Initialize ScrollSmoother
	 */
	ScrollSmoother.create({
		wrapper: "#smooth-wrapper",
		content: "#smooth-content",
		smooth: 1.5,
		effects: true,
		normalizeScroll: true,
		smoothTouch: 0.1,
	});
	/**
	 * Animation
	 */
	let mm = gsap.matchMedia();
	mm.add("(min-width: 1200px)", () => {
		function textAnimation() {
			const items = gsap.utils.toArray(".gsap-text-animation");
			if (!items.length) return;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0.05";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "50";
				const animationOpacity = item.dataset.opacity || "0";
				const splitType = item.dataset.splitType || "chars";
				const scrollMarker = item.dataset.markers || false;
				const textSplit = new SplitText(item, { type: splitType });
				let itemsToAnimate;
				if (splitType === "chars") {
					itemsToAnimate = textSplit.chars;
				} else if (splitType === "words") {
					itemsToAnimate = textSplit.words;
				} else if (splitType === "lines") {
					itemsToAnimate = textSplit.lines;
				} else {
					console.error("Invalid split type:", splitType);
					continue;
				}
				if (!itemsToAnimate.length) {
					textSplit.revert();
					continue;
				}
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(itemsToAnimate, {
					opacity: parseFloat(animationOpacity),
					delay: parseFloat(animationDelay),
					yPercent: parseFloat(animationY),
					duration: parseFloat(animationDuration),
					stagger: parseFloat(animationStagger),
					ease: "back.out",
					onComplete: () => {
						textSplit.revert();
					},
				});
			}
		}
		function imageRevealAnimation() {
			const imageContainers = gsap.utils.toArray(".gsap-image-reveal");
			if (!imageContainers.length) return;
			for (let i = 0; i < imageContainers.length; i++) {
				const image = imageContainers[i];
				const revealImage = image.querySelector("img");
				if (!revealImage) continue;
				const scrollTriggerSupport = image.dataset.scrollTrigger;
				const animationStart = image.dataset.start || "85%";
				const animationEnd = image.dataset.end || "25%";
				const scrollMarker = image.dataset.markers || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: image,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.set(image, { autoAlpha: 1 });
				tl.from(image, { xPercent: -100, duration: 1.5, ease: "power2.out" });
				tl.from(revealImage, {
					xPercent: 100,
					ease: "power2.out",
					scale: 1.5,
					duration: 1.5,
					delay: -1.5,
				});
			}
		}
		function fadeInAnimation() {
			const fadeIn = gsap.utils.toArray(".gsap-fade-in");
			if (!fadeIn.length) return;
			for (let i = 0; i < fadeIn.length; i++) {
				const item = fadeIn[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "0";
				const animationX = item.dataset.x || "0";
				const animationOpacity = item.dataset.opacity || "0";
				const scrollMarker = item.dataset.markers || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					yPercent: parseFloat(animationY),
					xPercent: parseFloat(animationX),
					delay: parseFloat(animationDelay),
					stagger: parseFloat(animationStagger),
					duration: parseFloat(animationDuration),
					ease: "back.out",
				});
			}
		}
		function zoomAnimation() {
			const zoomAnimation = gsap.utils.toArray(".gsap-zoom");
			if (!zoomAnimation.length) return;
			for (let i = 0; i < zoomAnimation.length; i++) {
				const item = zoomAnimation[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationOpacity = item.dataset.opacity || "1";
				const animationScale = item.dataset.scale || "1";
				const animationScrub = item.dataset.scrub || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								scrub: parseFloat(animationScrub),
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					scale: parseFloat(animationScale),
				});
			}
		}
		function rocketLaunch() {
			const rocketLaunch = document.querySelector(
				".road-map-section-1__element--1"
			);
			if (rocketLaunch) {
				const startY = 0;
				const endY = 1200;

				ScrollTrigger.create({
					trigger: rocketLaunch,
					start: "top 75%",
					end: "bottom -25%",
					scrub: true,
					onUpdate: (self) => {
						const progress = self.progress;
						const interpolatedY = startY + (endY - startY) * progress;
						rocketLaunch.style.top = `${interpolatedY}px`;
					},
				});
			}
		}
		function herothree() {
			const heroThree = document.querySelector(".hero-3");

			if (heroThree) {
				// Set initial CSS custom properties for pseudo-elements
				heroThree.style.setProperty("--before-opacity", 0);
				heroThree.style.setProperty("--after-opacity", 0);

				// Animate the custom properties using GSAP
				gsap.to(heroThree, {
					"--before-opacity": 1,
					duration: 1.5,
					delay: 4.5,
				});

				gsap.to(heroThree, {
					"--after-opacity": 1,
					duration: 1.5,
					delay: 4,
				});
			}
		}
		herothree();
		rocketLaunch();
		imageRevealAnimation();
		fadeInAnimation();
		zoomAnimation();
		document.fonts.ready
			.then(() => {
				textAnimation();
			})
			.catch((error) => {
				console.error("Font loading failed:", error);
				textAnimation();
			});
	});
});
/**
 * Scroll to Section
 */
// Smooth scroll with GSAP
function smoothScrollTo(targetId) {
	const target = document.querySelector(targetId);
	if (target) {
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: target, offsetY: getHeaderHeight() },
			ease: "power2.inOut",
		});
	}
}

function getHeaderHeight() {
	const header = document.querySelector("header"); // adjust selector if needed
	return header ? header.offsetHeight : 0;
}

// Detect homepage by body attribute
function isHomePage() {
	return document.body.dataset.page === "home";
}

// Save the current homepage variation in sessionStorage
function rememberHomePage() {
	if (isHomePage()) {
		const path = window.location.pathname;
		const file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
		sessionStorage.setItem("homePageFile", file);
	}
}

// Get the remembered homepage variation (fallback: index.html)
function getRememberedHomePage() {
	return sessionStorage.getItem("homePageFile") || "index.html";
}

// Redirect back to the remembered homepage variation with hash
function redirectToRememberedHome(targetId) {
	const currentPath = window.location.pathname.substring(
		0,
		window.location.pathname.lastIndexOf("/") + 1
	);
	const homeFile = getRememberedHomePage();
	window.location.href = currentPath + homeFile + targetId;
}

// Handle clicks for all internal section links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener("click", function (e) {
		const targetId = this.getAttribute("href");

		e.preventDefault();

		// If not on homepage, redirect back to remembered variation
		if (!isHomePage()) {
			redirectToRememberedHome(targetId);
			return;
		}

		// If already on homepage, smooth scroll
		smoothScrollTo(targetId);
	});
});

// On homepage load, remember which homepage this is
rememberHomePage();

// On homepage load, check if URL has hash and scroll smoothly
window.addEventListener("load", () => {
	if (isHomePage() && window.location.hash) {
		setTimeout(() => {
			smoothScrollTo(window.location.hash);
		}, 300); // delay so layout is ready
	}
});

/**
 * Tokemoji Market Dashboard
 */

// Mock data for Tokemoji tokens (moved outside DOMContentLoaded for global access)
const tokemojiData = [
		{ emoji: "❤️", ticker: "LOVE", price: "$0.0042", change: "+12.5%", marketCap: "$2.1M", changeType: "positive" },
		{ emoji: "🤬", ticker: "MAD", price: "$0.0038", change: "-8.2%", marketCap: "$1.9M", changeType: "negative" },
		{ emoji: "🤯", ticker: "OMG", price: "$0.0055", change: "+25.3%", marketCap: "$2.8M", changeType: "positive" },
		{ emoji: "😁", ticker: "HAPPY", price: "$0.0029", change: "+5.7%", marketCap: "$1.5M", changeType: "positive" },
		{ emoji: "😔", ticker: "SAD", price: "$0.0018", change: "-15.4%", marketCap: "$0.9M", changeType: "negative" },
		{ emoji: "😂", ticker: "LOL", price: "$0.0047", change: "+18.9%", marketCap: "$2.4M", changeType: "positive" },
		{ emoji: "😈", ticker: "EVIL", price: "$0.0032", change: "-3.1%", marketCap: "$1.6M", changeType: "negative" },
		{ emoji: "😇", ticker: "GOOD", price: "$0.0041", change: "+9.8%", marketCap: "$2.1M", changeType: "positive" },
		{ emoji: "😱", ticker: "FEAR", price: "$0.0023", change: "-12.7%", marketCap: "$1.2M", changeType: "negative" },
		{ emoji: "🤑", ticker: "GREED", price: "$0.0067", change: "+31.2%", marketCap: "$3.4M", changeType: "positive" },
		{ emoji: "👍", ticker: "LIKE", price: "$0.0035", change: "+7.3%", marketCap: "$1.8M", changeType: "positive" },
		{ emoji: "🔥", ticker: "HOT", price: "$0.0059", change: "+22.1%", marketCap: "$3.0M", changeType: "positive" },
		{ emoji: "😡", ticker: "HATE", price: "$0.0021", change: "-9.5%", marketCap: "$1.1M", changeType: "negative" },
		{ emoji: "🤔", ticker: "DOUBT", price: "$0.0027", change: "-1.8%", marketCap: "$1.4M", changeType: "negative" },
		{ emoji: "🚀", ticker: "MOON", price: "$0.0078", change: "+45.6%", marketCap: "$3.9M", changeType: "positive" }
	];

// Mock news data (moved outside DOMContentLoaded for global access)
const newsData = [
		{ title: "GREED token surges 31% as market sentiment shifts", timestamp: "2m ago", emoji: "🤑" },
		{ title: "MOON token reaches new ATH with 45% gains", timestamp: "5m ago", emoji: "🚀" },
		{ title: "Market analysis: Fear & Greed index shows extreme greed", timestamp: "12m ago", emoji: "📊" },
		{ title: "New Tokemoji protocol upgrade goes live", timestamp: "1h ago", emoji: "⚡" },
		{ title: "Community votes on next emotion token launch", timestamp: "2h ago", emoji: "🗳️" },
		{ title: "Technical analysis: LOVE vs HATE token battle", timestamp: "3h ago", emoji: "💕" },
		{ title: "DeFi integration brings new utility to emotion tokens", timestamp: "5h ago", emoji: "🔗" },
		{ title: "Market cap milestone: Tokemoji ecosystem hits $25M", timestamp: "8h ago", emoji: "🎉" }
	];

document.addEventListener("DOMContentLoaded", function () {
	// Initialize dashboard
	function initTokemojiDashboard() {
		populateTokenList();
		populateNewsFeed();
		updateMarketDominance();
		updateGauges();
		initializeCarouselData();
		updateTopGainers();
		updateTopLosers();
		updateGlobalAdoption();
		startNewsRotation();
		setupSortButtons();
		
		// Start carousel intervals
		setInterval(updateTopGainers, 3000); // Every 3 seconds
		setInterval(updateTopLosers, 3000); // Every 3 seconds
	}

	// Current sort type
	let currentSortType = 'marketcap';

	// Populate token list
	function populateTokenList() {
		const tokenList = document.getElementById('token-list');
		if (!tokenList) return;

		// Sort tokens based on current sort type
		let sortedTokens = [...tokemojiData];
		
		switch(currentSortType) {
			case 'marketcap':
				sortedTokens.sort((a, b) => {
					const aCap = parseFloat(a.marketCap.replace('$', '').replace('M', ''));
					const bCap = parseFloat(b.marketCap.replace('$', '').replace('M', ''));
					return bCap - aCap;
				});
				break;
			case 'losers':
				sortedTokens.sort((a, b) => {
					const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
					const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
					return aChange - bChange; // Most negative first
				});
				break;
			case 'gainers':
				sortedTokens.sort((a, b) => {
					const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
					const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
					return bChange - aChange; // Most positive first
				});
				break;
		}

		tokenList.innerHTML = sortedTokens.map((token, index) => `
			<div class="token-row d-flex align-items-center py-1 border-bottom border-light" data-token="${token.ticker}">
				<span class="token-rank me-2 fw-bold text-muted" style="min-width: 20px; flex-shrink: 0;">${index + 1}</span>
				<span class="token-emoji me-2" style="flex-shrink: 0;">${token.emoji}</span>
				<span class="token-ticker fw-bold text-heading me-2" style="min-width: 60px; flex-shrink: 0;">${token.ticker}</span>
				<span class="token-price text-muted me-2" style="min-width: 70px; flex-shrink: 0;">${token.price}</span>
				<span class="token-change ${token.changeType === 'positive' ? 'text-success' : 'text-danger'} fw-bold me-2" style="min-width: 60px; flex-shrink: 0;">${token.change}</span>
				<span class="token-marketcap text-muted me-2" style="min-width: 50px; flex-shrink: 0;">${token.marketCap}</span>
				<button class="btn btn-sm btn-primary buy-btn me-1" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;">BUY</button>
				<button class="btn btn-sm btn-outline-secondary chart-btn" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;" data-token="${token.ticker}">CHART</button>
				<div class="token-chart" id="chart-${token.ticker}" style="display: none; width: 100%; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 5px;">
					<canvas id="chart-canvas-${token.ticker}" width="300" height="100"></canvas>
				</div>
			</div>
		`).join('');
		
		// Setup chart buttons after populating
		setupChartButtons();
	}

	// Populate news feed (single item)
	let currentNewsIndex = 0;
	function populateNewsFeed() {
		const newsFeed = document.getElementById('news-feed');
		if (!newsFeed) return;

		const currentNews = newsData[currentNewsIndex];
		newsFeed.innerHTML = `
			<div class="news-item-single text-center">
				<div class="news-emoji mb-2">
					<span class="fs-2">${currentNews.emoji}</span>
				</div>
				<div class="news-title fw-bold text-heading mb-2" style="font-size: 1.3rem; line-height: 1.3;">${currentNews.title}</div>
				<div class="news-timestamp text-muted" style="font-size: 0.9rem;">${currentNews.timestamp}</div>
			</div>
		`;
	}

	// Rotate news every 5 seconds
	function startNewsRotation() {
		setInterval(() => {
			currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
			populateNewsFeed();
		}, 5000);
	}

	// Update market dominance (shows #1 coin)
	function updateMarketDominance() {
		// Sort by market cap to get #1 coin
		const sortedTokens = [...tokemojiData].sort((a, b) => {
			const aCap = parseFloat(a.marketCap.replace('$', '').replace('M', ''));
			const bCap = parseFloat(b.marketCap.replace('$', '').replace('M', ''));
			return bCap - aCap;
		});
		
		const topToken = sortedTokens[0];
		const totalMarketCap = tokemojiData.reduce((sum, token) => {
			return sum + parseFloat(token.marketCap.replace('$', '').replace('M', ''));
		}, 0);
		
		const topTokenMarketCap = parseFloat(topToken.marketCap.replace('$', '').replace('M', ''));
		const dominancePercentage = ((topTokenMarketCap / totalMarketCap) * 100).toFixed(1);

		// Update DOM elements
		const dominanceGifEl = document.getElementById('dominance-gif');
		const dominanceTickerEl = document.getElementById('dominance-ticker');
		const dominancePercentageEl = document.getElementById('dominance-percentage');
		const dominanceBarEl = document.getElementById('dominance-bar');
		
		// Map token tickers to GIF paths
		const tokenGifMap = {
			'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
			'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
			'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
			'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
			'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
			'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
			'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
			'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
			'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
			'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
			'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
			'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
			'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
			'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
			'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
		};
		
		if (dominanceGifEl) {
			const gifPath = tokenGifMap[topToken.ticker] || 'assets/img/Emojis/Crown/Crown emoji.gif';
			dominanceGifEl.src = gifPath;
		}
		if (dominanceTickerEl) dominanceTickerEl.textContent = topToken.ticker;
		if (dominancePercentageEl) dominancePercentageEl.textContent = dominancePercentage + '%';
		if (dominanceBarEl) dominanceBarEl.style.width = dominancePercentage + '%';
	}

	// Setup sort buttons
	function setupSortButtons() {
		const sortButtons = document.querySelectorAll('.sort-btn');
		
		sortButtons.forEach(button => {
			button.addEventListener('click', () => {
				// Remove active class from all buttons
				sortButtons.forEach(btn => btn.classList.remove('active'));
				// Add active class to clicked button
				button.classList.add('active');
				// Update sort type
				currentSortType = button.dataset.sort;
				// Repopulate token list
				populateTokenList();
			});
		});
	}

	// Update gauges
	function updateGauges() {
		// Calculate greed vs fear ratio
		const greedTokens = tokemojiData.filter(token => ['GREED', 'HAPPY', 'LOVE', 'MOON', 'HOT', 'LOL', 'GOOD', 'LIKE'].includes(token.ticker));
		const fearTokens = tokemojiData.filter(token => ['FEAR', 'SAD', 'HATE', 'DOUBT', 'MAD'].includes(token.ticker));
		
		const greedMarketCap = greedTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const fearMarketCap = fearTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const totalEmotionCap = greedMarketCap + fearMarketCap;
		
		const greedRatio = (greedMarketCap / totalEmotionCap) * 100;
		const greedOffset = 157.1 - (greedRatio / 100) * 157.1;

		// Calculate good vs evil ratio
		const goodTokens = tokemojiData.filter(token => ['GOOD', 'LOVE', 'HAPPY', 'LIKE'].includes(token.ticker));
		const evilTokens = tokemojiData.filter(token => ['EVIL', 'HATE', 'MAD'].includes(token.ticker));
		
		const goodMarketCap = goodTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const evilMarketCap = evilTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const totalMoralCap = goodMarketCap + evilMarketCap;
		
		const goodRatio = (goodMarketCap / totalMoralCap) * 100;
		const goodOffset = 157.1 - (goodRatio / 100) * 157.1;

		// Calculate love vs hate ratio
		const loveTokens = tokemojiData.filter(token => ['LOVE', 'HAPPY', 'LIKE'].includes(token.ticker));
		const hateTokens = tokemojiData.filter(token => ['HATE', 'MAD', 'EVIL'].includes(token.ticker));
		
		const loveMarketCap = loveTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const hateMarketCap = hateTokens.reduce((sum, token) => sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0);
		const totalLoveHateCap = loveMarketCap + hateMarketCap;
		
		const loveRatio = (loveMarketCap / totalLoveHateCap) * 100;
		const loveOffset = 157.1 - (loveRatio / 100) * 157.1;

		// Update gauge animations
		const greedFearGauge = document.getElementById('greed-fear-gauge');
		const goodEvilGauge = document.getElementById('good-evil-gauge');
		const loveHateGauge = document.getElementById('love-hate-gauge');
		
		if (greedFearGauge) {
			greedFearGauge.style.strokeDashoffset = greedOffset;
		}
		if (goodEvilGauge) {
			goodEvilGauge.style.strokeDashoffset = goodOffset;
		}
		if (loveHateGauge) {
			loveHateGauge.style.strokeDashoffset = loveOffset;
		}
		
		// Update gauge result text
		const greedFearResult = document.getElementById('greed-fear-result');
		const goodEvilResult = document.getElementById('good-evil-result');
		const loveHateResult = document.getElementById('love-hate-result');
		
		if (greedFearResult) {
			const dominantEmotion = greedRatio > 50 ? 'GREED' : 'FEAR';
			const dominancePercent = Math.max(greedRatio, 100 - greedRatio);
			greedFearResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
			greedFearResult.querySelector('.gauge-percentage').textContent = `${dominancePercent.toFixed(0)}%`;
		}
		if (goodEvilResult) {
			const dominantEmotion = goodRatio > 50 ? 'GOOD' : 'EVIL';
			const dominancePercent = Math.max(goodRatio, 100 - goodRatio);
			goodEvilResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
			goodEvilResult.querySelector('.gauge-percentage').textContent = `${dominancePercent.toFixed(0)}%`;
		}
		if (loveHateResult) {
			const dominantEmotion = loveRatio > 50 ? 'LOVE' : 'HATE';
			const dominancePercent = Math.max(loveRatio, 100 - loveRatio);
			loveHateResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
			loveHateResult.querySelector('.gauge-percentage').textContent = `${dominancePercent.toFixed(0)}%`;
		}
	}

	// Initialize dashboard when DOM is ready
	initTokemojiDashboard();
	
	// Initialize ticker news
	initTickerNews();
	
	// Initialize promo ticker
	initPromoTicker();
	
	// Initialize ticker with AI news content
	function initTickerNews() {
		const tickerList = document.getElementById('ticker-news-list');
		if (!tickerList) return;
		
		// Create ticker content with news and market data
		const tickerContent = [
			// Market indicators
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: 'FEAR VS GREED INDEX', class: 'text-secondary' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: 'GOOD VS EVIL METER', class: 'text-primary' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			
			// AI News items
			{ type: 'text', content: '📰 GREED token surges 31% as market sentiment shifts', class: 'text-warning' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '🚀 MOON token reaches new ATH with 45% gains', class: 'text-success' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '📊 Market analysis: Fear & Greed index shows extreme greed', class: 'text-info' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '⚡ New Tokemoji protocol upgrade goes live', class: 'text-primary' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '🗳️ Community votes on next emotion token launch', class: 'text-secondary' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '💕 Technical analysis: LOVE vs HATE token battle', class: 'text-danger' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '🔗 DeFi integration brings new utility to emotion tokens', class: 'text-warning' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '🎉 Market cap milestone: Tokemoji ecosystem hits $25M', class: 'text-success' },
			
			// Repeat for continuous scrolling
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: 'FEAR VS GREED INDEX', class: 'text-secondary' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: 'GOOD VS EVIL METER', class: 'text-primary' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '📰 GREED token surges 31% as market sentiment shifts', class: 'text-warning' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '🚀 MOON token reaches new ATH with 45% gains', class: 'text-success' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '📊 Market analysis: Fear & Greed index shows extreme greed', class: 'text-info' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '⚡ New Tokemoji protocol upgrade goes live', class: 'text-primary' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '🗳️ Community votes on next emotion token launch', class: 'text-secondary' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '💕 Technical analysis: LOVE vs HATE token battle', class: 'text-danger' },
			{ type: 'icon', src: 'assets/img/icon-coin-2.png' },
			{ type: 'text', content: '🔗 DeFi integration brings new utility to emotion tokens', class: 'text-warning' },
			{ type: 'icon', src: 'assets/img/icon-coin-1.png' },
			{ type: 'text', content: '🎉 Market cap milestone: Tokemoji ecosystem hits $25M', class: 'text-success' }
		];
		
		// Populate ticker list
		tickerList.innerHTML = tickerContent.map(item => {
			if (item.type === 'icon') {
				return `<li><img src="${item.src}" alt="image" class="img-fluid" /></li>`;
			} else {
				return `<li><h4 class="mb-0 ${item.class} text-stroke text-shadow text-uppercase">${item.content}</h4></li>`;
			}
		}).join('');
	}
	
	// Initialize promo ticker with promotional information
	function initPromoTicker() {
		const promoList = document.getElementById('ticker-promo-list');
		if (!promoList) return;
		
		// Create promo ticker content
		const promoContent = [
			// Promo items
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'GLOBAL EMOTION BAROMETER', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'FEAR VS GREED INDEX', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'GOOD VS EVIL METER', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'LIVE NEWS FEED', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'REAL-TIME EMOTION TRACKING', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'MARKET SENTIMENT ANALYSIS', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'TOKEMOJI ECOSYSTEM', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'EMOTION-BASED TRADING', class: 'text-primary text-stroke text-shadow' },
			
			// Repeat for continuous scrolling
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'GLOBAL EMOTION BAROMETER', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'FEAR VS GREED INDEX', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'GOOD VS EVIL METER', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'LIVE NEWS FEED', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'REAL-TIME EMOTION TRACKING', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'MARKET SENTIMENT ANALYSIS', class: 'text-primary text-stroke text-shadow' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'TOKEMOJI ECOSYSTEM', class: 'text-light' },
			{ type: 'icon', src: 'assets/img/icon-coin-4.png' },
			{ type: 'text', content: 'EMOTION-BASED TRADING', class: 'text-primary text-stroke text-shadow' }
		];
		
		// Populate promo ticker list
		promoList.innerHTML = promoContent.map(item => {
			if (item.type === 'icon') {
				return `<li><img src="${item.src}" alt="image" class="img-fluid" /></li>`;
			} else {
				return `<li><h4 class="mb-0 ${item.class} text-uppercase">${item.content}</h4></li>`;
			}
		}).join('');
	}

	// Simulate real-time updates (optional)
	setInterval(() => {
		// Add some random fluctuation to prices
		tokemojiData.forEach(token => {
			const currentPrice = parseFloat(token.price.replace('$', ''));
			const fluctuation = (Math.random() - 0.5) * 0.0002; // ±0.0001
			const newPrice = Math.max(0.0001, currentPrice + fluctuation);
			token.price = '$' + newPrice.toFixed(4);
			
			// Update change percentage
			const changePercent = (Math.random() - 0.5) * 20; // ±10%
			token.change = (changePercent >= 0 ? '+' : '') + changePercent.toFixed(1) + '%';
			token.changeType = changePercent >= 0 ? 'positive' : 'negative';
		});
		
		// Re-populate with updated data
		populateTokenList();
		updateMarketDominance();
		updateGauges();
		initializeCarouselData(); // Reinitialize carousel data with new prices
		updateTopGainers();
		updateTopLosers();
		updateGlobalAdoption();
		
		// Add price change effects
		addPriceChangeEffects();
	}, 10000); // Update every 10 seconds
	
	// Setup chart buttons
	setupChartButtons();
	
	// Add price change effects
	function addPriceChangeEffects() {
	const tokenRows = document.querySelectorAll('.token-row');
	
	tokenRows.forEach(row => {
		const changeElement = row.querySelector('.token-change');
		if (!changeElement) return;
		
		const changeText = changeElement.textContent;
		const isPositive = changeText.includes('+');
		
		// Add flash effect
		if (isPositive) {
			row.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
			row.style.transition = 'background-color 0.3s ease';
			
			setTimeout(() => {
				row.style.backgroundColor = '';
			}, 1000);
		} else {
			row.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
			row.style.transition = 'background-color 0.3s ease';
			
			setTimeout(() => {
				row.style.backgroundColor = '';
			}, 1000);
		}
	});
}

// Setup chart buttons
function setupChartButtons() {
	const chartButtons = document.querySelectorAll('.chart-btn');
	
	chartButtons.forEach(button => {
		button.addEventListener('click', function() {
			const tokenTicker = this.dataset.token;
			const chartDiv = document.getElementById(`chart-${tokenTicker}`);
			const canvas = document.getElementById(`chart-canvas-${tokenTicker}`);
			
			if (chartDiv.style.display === 'none') {
				// Show chart
				chartDiv.style.display = 'block';
				chartDiv.style.maxHeight = '0';
				chartDiv.style.overflow = 'hidden';
				chartDiv.style.transition = 'max-height 0.5s ease-out';
				
				// Animate roll down
				setTimeout(() => {
					chartDiv.style.maxHeight = '150px';
				}, 10);
				
				// Draw chart
				drawSimpleChart(canvas, tokenTicker);
			} else {
				// Hide chart
				chartDiv.style.maxHeight = '0';
				setTimeout(() => {
					chartDiv.style.display = 'none';
				}, 500);
			}
		});
	});
}

// Draw simple chart
function drawSimpleChart(canvas, tokenTicker) {
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	
	// Clear canvas
	ctx.clearRect(0, 0, width, height);
	
	// Generate mock price data
	const dataPoints = 20;
	const prices = [];
	const basePrice = Math.random() * 0.01 + 0.001; // Random base price
	
	for (let i = 0; i < dataPoints; i++) {
		const variation = (Math.random() - 0.5) * 0.002;
		prices.push(basePrice + variation);
	}
	
	// Find min and max for scaling
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	const priceRange = maxPrice - minPrice;
	
	// Draw grid
	ctx.strokeStyle = '#e0e0e0';
	ctx.lineWidth = 1;
	
	// Horizontal lines
	for (let i = 0; i <= 4; i++) {
		const y = (height / 4) * i;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}
	
	// Vertical lines
	for (let i = 0; i <= 4; i++) {
		const x = (width / 4) * i;
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
		ctx.stroke();
	}
	
	// Draw price line
	ctx.strokeStyle = '#0d6efd';
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	prices.forEach((price, index) => {
		const x = (width / (dataPoints - 1)) * index;
		const y = height - ((price - minPrice) / priceRange) * height;
		
		if (index === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	});
	
	ctx.stroke();
	
	// Draw data points
	ctx.fillStyle = '#0d6efd';
	prices.forEach((price, index) => {
		const x = (width / (dataPoints - 1)) * index;
		const y = height - ((price - minPrice) / priceRange) * height;
		
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, 2 * Math.PI);
		ctx.fill();
	});
	
	// Add price labels
	ctx.fillStyle = '#666';
	ctx.font = '10px Arial';
	ctx.textAlign = 'left';
	ctx.fillText(`Min: $${minPrice.toFixed(4)}`, 5, height - 5);
	ctx.textAlign = 'right';
	ctx.fillText(`Max: $${maxPrice.toFixed(4)}`, width - 5, 15);
}

// Carousel data for gainers and losers
let gainersCarouselData = [];
let losersCarouselData = [];
let gainersCurrentIndex = 0;
let losersCurrentIndex = 0;

// Initialize carousel data
function initializeCarouselData() {
	const gainers = tokemojiData.filter(token => token.changeType === 'positive');
	const losers = tokemojiData.filter(token => token.changeType === 'negative');
	
	// Sort and store all gainers
	gainersCarouselData = gainers.sort((a, b) => {
		const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
		const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
		return bChange - aChange;
	});
	
	// Sort and store all losers
	losersCarouselData = losers.sort((a, b) => {
		const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
		const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
		return aChange - bChange; // Most negative first
	});
}

// Update Top Gainers Widget with carousel
function updateTopGainers() {
	if (gainersCarouselData.length === 0) return;
	
	// Map token tickers to GIF paths
	const tokenGifMap = {
		'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
		'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
		'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
		'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
		'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
		'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
		'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
		'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
		'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
		'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
		'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
		'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
		'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
		'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
		'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
	};
	
	// Get current set of 3 tokens (with wrapping)
	const currentSet = [
		gainersCarouselData[(gainersCurrentIndex - 1 + gainersCarouselData.length) % gainersCarouselData.length],
		gainersCarouselData[gainersCurrentIndex],
		gainersCarouselData[(gainersCurrentIndex + 1) % gainersCarouselData.length]
	];
	
	// Update GIFs
	const leftGif = document.getElementById('top-gainer-gif-left');
	const centerGif = document.getElementById('top-gainer-gif-center');
	const rightGif = document.getElementById('top-gainer-gif-right');
	
	if (leftGif && currentSet[0]) {
		const gifPath = tokenGifMap[currentSet[0].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
		leftGif.src = gifPath;
	}
	if (centerGif && currentSet[1]) {
		const gifPath = tokenGifMap[currentSet[1].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
		centerGif.src = gifPath;
	}
	if (rightGif && currentSet[2]) {
		const gifPath = tokenGifMap[currentSet[2].ticker] || 'assets/img/Emojis/HOT/Hot emoji.gif';
		rightGif.src = gifPath;
	}
	
	// Update ticker and change for the center (current) token
	const topGainerTickerEl = document.getElementById('top-gainer-ticker');
	const topGainerChangeEl = document.getElementById('top-gainer-change');
	
	if (topGainerTickerEl && currentSet[1]) topGainerTickerEl.textContent = currentSet[1].ticker;
	if (topGainerChangeEl && currentSet[1]) topGainerChangeEl.textContent = currentSet[1].change;
	
	// Move to next index
	gainersCurrentIndex = (gainersCurrentIndex + 1) % gainersCarouselData.length;
}

// Update Top Losers Widget with carousel
function updateTopLosers() {
	if (losersCarouselData.length === 0) return;
	
	// Map token tickers to GIF paths
	const tokenGifMap = {
		'LOVE': 'assets/img/Emojis/Love/Love emoji.gif',
		'MAD': 'assets/img/Emojis/Anger/Anger emoji.gif',
		'OMG': 'assets/img/Emojis/OMG/OMG emoji.gif',
		'HAPPY': 'assets/img/Emojis/Happy/Happy Emoji.gif',
		'SAD': 'assets/img/Emojis/SAD/Sad emoji.gif',
		'LOL': 'assets/img/Emojis/LOL/LOL Emoji.gif',
		'EVIL': 'assets/img/Emojis/Evil/Evil emoji.gif',
		'GOOD': 'assets/img/Emojis/Good/Good emoji.gif',
		'FEAR': 'assets/img/Emojis/Fear/Fear emoji.gif',
		'GREED': 'assets/img/Emojis/Greed/Greed emoji.gif',
		'LIKE': 'assets/img/Emojis/Like/Like with emoji.gif',
		'HOT': 'assets/img/Emojis/HOT/Hot emoji.gif',
		'HATE': 'assets/img/Emojis/Anger/Anger emoji.gif',
		'DOUBT': 'assets/img/Emojis/Doubt/Doubt emoji.gif',
		'MOON': 'assets/img/Emojis/Crown/Crown emoji.gif'
	};
	
	// Get current set of 3 tokens (with wrapping)
	const currentSet = [
		losersCarouselData[(losersCurrentIndex - 1 + losersCarouselData.length) % losersCarouselData.length],
		losersCarouselData[losersCurrentIndex],
		losersCarouselData[(losersCurrentIndex + 1) % losersCarouselData.length]
	];
	
	// Update GIFs
	const leftGif = document.getElementById('top-loser-gif-left');
	const centerGif = document.getElementById('top-loser-gif-center');
	const rightGif = document.getElementById('top-loser-gif-right');
	
	if (leftGif && currentSet[0]) {
		const gifPath = tokenGifMap[currentSet[0].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
		leftGif.src = gifPath;
	}
	if (centerGif && currentSet[1]) {
		const gifPath = tokenGifMap[currentSet[1].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
		centerGif.src = gifPath;
	}
	if (rightGif && currentSet[2]) {
		const gifPath = tokenGifMap[currentSet[2].ticker] || 'assets/img/Emojis/SAD/Sad emoji.gif';
		rightGif.src = gifPath;
	}
	
	// Update ticker and change for the center (current) token
	const topLoserTickerEl = document.getElementById('top-loser-ticker');
	const topLoserChangeEl = document.getElementById('top-loser-change');
	
	if (topLoserTickerEl && currentSet[1]) topLoserTickerEl.textContent = currentSet[1].ticker;
	if (topLoserChangeEl && currentSet[1]) topLoserChangeEl.textContent = currentSet[1].change;
	
	// Move to next index
	losersCurrentIndex = (losersCurrentIndex + 1) % losersCarouselData.length;
}

// Update Global Adoption Meter
function updateGlobalAdoption() {
	// Mock data - in the future this will be real blockchain data
	const mockAdoptionPercentage = Math.random() * 5 + 1; // 1-6%
	
	const adoptionPercentageEl = document.getElementById('adoption-percentage');
	const adoptionBarEl = document.getElementById('adoption-bar');
	
	if (adoptionPercentageEl) {
		adoptionPercentageEl.textContent = mockAdoptionPercentage.toFixed(1) + '%';
	}
	if (adoptionBarEl) {
		adoptionBarEl.style.width = mockAdoptionPercentage.toFixed(1) + '%';
	}
}

// Contract Copy Functionality
function initContractCopy() {
	const contractSelect = document.getElementById('contract-select');
	const contractAddress = document.getElementById('contract-address');
	const copyBtn = document.getElementById('copy-contract-btn');
	const solscanBtn = document.getElementById('solscan-btn');
	
	if (!contractSelect || !contractAddress || !copyBtn || !solscanBtn) return;
	
	// Update contract address when selection changes
	contractSelect.addEventListener('change', function() {
		contractAddress.value = this.value;
		if (this.value) {
			solscanBtn.style.display = 'inline-block';
			// Update button text with emoji instead of token name
			const selectedText = this.options[this.selectedIndex].text;
			const emoji = selectedText.split(' ')[0]; // Extract emoji (e.g., "😀")
			solscanBtn.innerHTML = `<iconify-icon icon="ri:external-link-line"></iconify-icon> Check ${emoji} on Solscan`;
		} else {
			solscanBtn.style.display = 'none';
		}
	});
	
	// Copy to clipboard functionality
	copyBtn.addEventListener('click', function() {
		if (contractAddress.value) {
			navigator.clipboard.writeText(contractAddress.value).then(function() {
				// Visual feedback
				const originalIcon = copyBtn.innerHTML;
				copyBtn.innerHTML = '<iconify-icon icon="ri:check-line"></iconify-icon>';
				copyBtn.classList.add('btn-success');
				copyBtn.classList.remove('btn-light');
				
				setTimeout(function() {
					copyBtn.innerHTML = originalIcon;
					copyBtn.classList.remove('btn-success');
					copyBtn.classList.add('btn-light');
				}, 2000);
			}).catch(function(err) {
				console.error('Failed to copy: ', err);
				// Fallback for older browsers
				contractAddress.select();
				document.execCommand('copy');
			});
		}
	});
	
	// Solscan button functionality
	solscanBtn.addEventListener('click', function() {
		if (contractAddress.value) {
			const solscanUrl = `https://solscan.io/token/${contractAddress.value}`;
			window.open(solscanUrl, '_blank');
		}
	});
}

// Initialize contract copy functionality
initContractCopy();

// ========================================
// Alt Market — Pump.fun Live Test
// ========================================

// Alt Market Configuration
const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFkNzYxZjgyLTUwMTYtNDQ5OS04MzRjLWI4OTNjMDI0MjIzOSIsIm9yZ0lkIjoiNDc0MjcxIiwidXNlcklkIjoiNDg3OTAyIiwidHlwZUlkIjoiZjA5YzRiODItYzlmYi00MmU3LWE1MjUtZDQyOTAzZjNjMzQ2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTk2ODI1MjgsImV4cCI6NDkxNTQ0MjUyOH0.jc9g3IvglMRPRXkw8YdGesMxzvwEvw5X1mY6jb23BgI";
const MINTS = [
	"J2eaKn35rp82T6RFEsNK9CLRHEKV9BLXjedFM3q6pump",
	"H8xQ6poBjB9DTPMDTKWzWPrnxu4bDEhybxiouF8Ppump",
	"E7x954J5CUmFQBJvZGvi8FbS3XDWxG7Gyc7eJSEpump",
	"9tTRFq88NeZFpD2DcSZDMEvkvHtLivBeYd1w5Chfpump",
	"AK9yVoXKK1Cjww7HDyjYNyW5FujD3FJ2xbjMUStspump"
];

// Alt Market Token Data
let altTokenData = [];
let previousTokenData = []; // Store previous prices for change calculation

// Fetch token price from Moralis
async function fetchTokenPrice(mint) {
	try {
		const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${mint}/price`, {
			headers: {
				"X-API-Key": MORALIS_API_KEY
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching price for ${mint}:`, error);
		return null;
	}
}

// Calculate price change percentage
function calculatePriceChange(currentPrice, previousPrice) {
	if (!previousPrice || previousPrice === 0) return 0;
	return ((currentPrice - previousPrice) / previousPrice) * 100;
}

// Get price change indicator class
function getPriceChangeClass(change) {
	if (change > 0) return 'bg-success-subtle border-success';
	if (change < 0) return 'bg-danger-subtle border-danger';
	return 'bg-light border-dark';
}

// Get price change text color
function getPriceChangeTextColor(change) {
	if (change > 0) return 'text-success';
	if (change < 0) return 'text-danger';
	return 'text-muted';
}

// Generate token name from mint (simplified)
function getTokenName(mint) {
	const names = ["PUMP1", "PUMP2", "PUMP3", "PUMP4", "PUMP5"];
	const index = MINTS.indexOf(mint);
	return names[index] || "UNKNOWN";
}

// Generate emoji for token
function getTokenEmoji(mint) {
	const emojis = ["🚀", "💎", "🔥", "⭐", "🌙"];
	const index = MINTS.indexOf(mint);
	return emojis[index] || "💰";
}

// Format market cap
function formatMarketCap(price) {
	const supply = 1000000000; // 1B supply
	const marketCap = price * supply;
	
	if (marketCap >= 1000000) {
		return `$${(marketCap / 1000000).toFixed(2)}M`;
	} else if (marketCap >= 1000) {
		return `$${(marketCap / 1000).toFixed(2)}K`;
	} else {
		return `$${marketCap.toFixed(2)}`;
	}
}

// Format price
function formatPrice(price) {
	if (price >= 1) {
		return `$${price.toFixed(4)}`;
	} else if (price >= 0.01) {
		return `$${price.toFixed(6)}`;
	} else {
		return `$${price.toExponential(2)}`;
	}
}

// Update alt market tokens
async function updateAltMarketTokens() {
	const spinner = document.getElementById('alt-market-spinner');
	const tokenList = document.getElementById('alt-token-list');
	
	if (spinner) spinner.style.display = 'inline-block';
	
	try {
		const promises = MINTS.map(async (mint) => {
			const priceData = await fetchTokenPrice(mint);
			if (priceData && priceData.usdPrice) {
				// Find previous data for this mint
				const previousData = previousTokenData.find(p => p.mint === mint);
				const previousPrice = previousData ? previousData.price : null;
				
				// Calculate price changes
				const priceChange = calculatePriceChange(priceData.usdPrice, previousPrice);
				
				return {
					mint,
					name: getTokenName(mint),
					emoji: getTokenEmoji(mint),
					price: priceData.usdPrice,
					previousPrice: previousPrice,
					priceChange: priceChange,
					marketCap: formatMarketCap(priceData.usdPrice),
					change1h: 'N/A', // Moralis doesn't provide 1h change in this endpoint
					change24h: 'N/A' // Moralis doesn't provide 24h change in this endpoint
				};
			}
			return null;
		});
		
		const results = await Promise.all(promises);
		const newTokenData = results.filter(token => token !== null);
		
		// Store current data as previous for next update
		previousTokenData = [...newTokenData];
		
		// Sort by market cap (descending)
		newTokenData.sort((a, b) => {
			const aCap = parseFloat(a.marketCap.replace(/[$,]/g, ''));
			const bCap = parseFloat(b.marketCap.replace(/[$,]/g, ''));
			return bCap - aCap;
		});
		
		altTokenData = newTokenData;
		
		// Update DOM
		if (tokenList) {
			tokenList.innerHTML = altTokenData.map((token, index) => {
				const priceChangeClass = getPriceChangeClass(token.priceChange);
				const priceChangeTextColor = getPriceChangeTextColor(token.priceChange);
				const priceChangeText = token.previousPrice ? 
					`${token.priceChange > 0 ? '+' : ''}${token.priceChange.toFixed(2)}%` : 
					'NEW';
				
				return `
					<div class="token-row d-flex align-items-center justify-content-between p-3 border-bottom border-dark ${priceChangeClass}">
						<div class="d-flex align-items-center gap-3">
							<span class="rank text-muted fw-bold">${index + 1}</span>
							<span class="emoji fs-4">${token.emoji}</span>
							<div>
								<div class="ticker fw-bold text-heading">${token.name}</div>
								<div class="mint text-muted small">${token.mint.substring(0, 8)}...</div>
							</div>
						</div>
						<div class="d-flex align-items-center gap-4">
							<div class="text-end">
								<div class="price fw-bold text-heading">${formatPrice(token.price)}</div>
								<div class="d-flex gap-3 small">
									<span class="text-muted">1h: ${token.change1h}</span>
									<span class="text-muted">24h: ${token.change24h}</span>
									<span class="text-muted">Mkt Cap: ${token.marketCap}</span>
								</div>
								<div class="price-change ${priceChangeTextColor} fw-bold small">
									${priceChangeText}
								</div>
							</div>
							<a href="https://pump.fun/${token.mint}" target="_blank" class="btn btn-sm btn-primary">
								Open on Pump.fun
							</a>
						</div>
					</div>
				`;
			}).join('');
		}
		
	} catch (error) {
		console.error('Error updating alt market tokens:', error);
		if (tokenList) {
			tokenList.innerHTML = '<div class="text-center p-4 text-muted">Error loading token data. Please try again later.</div>';
		}
	} finally {
		if (spinner) spinner.style.display = 'none';
	}
}

// Initialize alt market
function initAltMarket() {
	// Initial load
	updateAltMarketTokens();
	
	// Update every 5 seconds
	setInterval(updateAltMarketTokens, 5000);
}

// Initialize alt market functionality
initAltMarket();

}); // End of DOMContentLoaded event listener
