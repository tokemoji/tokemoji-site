"use strict";

// iOS Detection and WebM Fallback
function isIOS() {
	const userAgent = navigator.userAgent;
	const platform = navigator.platform;
	
	// More precise iOS detection - only for actual iOS devices
	const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
	const isIPadPro = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	
	// Don't include mobile Safari detection as it's too broad
	const result = isIOSDevice || isIPadPro;
	
	console.log('iOS Detection:', {
		userAgent: userAgent,
		platform: platform,
		touchPoints: navigator.maxTouchPoints,
		isIOSDevice: isIOSDevice,
		isIPadPro: isIPadPro,
		result: result
	});
	
	return result;
}

// Helper function to get correct emoji path based on iOS detection
function getEmojiPath(webmPath) {
	if (isIOS()) {
		return webmPath.replace('.webm', '.webp');
	}
	return webmPath;
}

function replaceWebMWithWebP() {
	if (!isIOS()) return;
	
	console.log('iOS detected - replacing WebM with WebP fallbacks');
	console.log('iOS replacement starting at:', new Date().toISOString());
	
	// Simple function to convert WebM to WebP
	function webmToWebp(src) {
		return src.replace('.webm', '.webp');
	}
	
	
	// Replace video elements with WebM sources (EXCEPT hero video - handled by cycling function)
	const videos = document.querySelectorAll('video');
	videos.forEach(video => {
		// Skip hero video - it's handled by the cycling function
		const sources = video.querySelectorAll('source[type="video/webm"]');
		if (sources.length > 0) {
			const webmSrc = sources[0].src;
			// Skip if this is the hero video
			if (webmSrc.includes('hero-img-1.webm')) {
				console.log('🎬 Skipping hero video - will be handled by cycling function');
				return;
			}
			
			const webpSrc = webmToWebp(webmSrc);
			
			// Create img element to replace video
			const img = document.createElement('img');
			img.src = webpSrc;
			img.alt = video.alt || 'Image';
			img.className = video.className;
			img.style.cssText = video.style.cssText;
			
			// Copy id attribute
			if (video.id) {
				img.id = video.id;
			}
			
			// Copy data attributes
			Array.from(video.attributes).forEach(attr => {
				if (attr.name.startsWith('data-')) {
					img.setAttribute(attr.name, attr.value);
				}
			});
			
			// Replace video with img
			video.parentNode.replaceChild(img, video);
			console.log('Replaced video:', webmSrc, '->', webpSrc);
		}
	});
	
	// Replace picture elements with WebM sources
	const pictures = document.querySelectorAll('picture');
	pictures.forEach(picture => {
		const sources = picture.querySelectorAll('source[type="video/webm"]');
		if (sources.length > 0) {
			const webmSrc = sources[0].srcset;
			const webpSrc = webmToWebp(webmSrc);
			
			// Remove the WebM source to prevent video playback
			sources.forEach(source => source.remove());
			
			// Update the img src directly
			const img = picture.querySelector('img');
			if (img) {
				img.src = webpSrc;
				img.style.pointerEvents = 'none';
				img.style.userSelect = 'none';
				img.style.objectFit = 'contain';
				console.log('Replaced picture:', webmSrc, '->', webpSrc);
			}
		}
	});
	
	// Replace any direct WebM references in img or video elements
	const allElements = document.querySelectorAll('img[src*=".webm"], video[src*=".webm"]');
	allElements.forEach(element => {
		const webmSrc = element.src;
		const webpSrc = webmToWebp(webmSrc);
		
		if (element.tagName === 'VIDEO') {
			// Replace video with img
			const img = document.createElement('img');
			img.src = webpSrc;
			img.alt = element.alt || 'Image';
			img.className = element.className;
			img.style.cssText = element.style.cssText;
			img.style.pointerEvents = 'none';
			img.style.userSelect = 'none';
			img.style.objectFit = 'contain';
			
			// Copy id attribute
			if (element.id) {
				img.id = element.id;
			}
			
			// Copy data attributes
			Array.from(element.attributes).forEach(attr => {
				if (attr.name.startsWith('data-')) {
					img.setAttribute(attr.name, attr.value);
				}
			});
			
			element.parentNode.replaceChild(img, element);
		} else {
			// Update img src
			element.src = webpSrc;
			element.style.pointerEvents = 'none';
			element.style.userSelect = 'none';
			element.style.objectFit = 'contain';
		}
		
		console.log('Replaced element:', webmSrc, '->', webpSrc);
	});
}

// Hero WebP Cycling for iPhone
// TEST MODE: Temporarily enabled for all devices to test WebP images
function initHeroWebPCycling() {
	// TEST MODE: Commented out iOS check to test on all devices
	// if (!isIOS()) return;
	
	console.log('🎬 Initializing Hero WebP cycling (TEST MODE - all devices)');
	
	// Find the hero video by looking for the source element
	const heroVideoSource = document.querySelector('source[src*="hero-img-1.webm"]');
	const heroVideo = heroVideoSource ? heroVideoSource.closest('video') : null;
	const heroFallback = document.getElementById('hero-webp-fallback');
	
	if (!heroFallback) {
		console.log('❌ Hero WebP fallback element not found');
		return;
	}
	
	console.log('🎬 Hero video found:', !!heroVideo);
	console.log('🎬 Hero fallback found:', !!heroFallback);
	
	// Immediately hide the video to prevent any overlap
	if (heroVideo) {
		heroVideo.style.display = 'none';
		console.log('🎬 Hero video immediately hidden');
	}
	
	// Ensure fallback is visible
	heroFallback.style.display = 'block';
	console.log('🎬 Hero fallback shown');
	
	// Hero WebP files to cycle through (available files: 1, 2, 4, 5)
	const heroImages = [
		'assets/img/hero-img-1.webp',
		'assets/img/hero-img-2.webp', 
		'assets/img/hero-img-4.webp',
		'assets/img/hero-img-5.webp'
	];
	
	let currentIndex = 0;
	
	function cycleHeroImage() {
		// Change to next image
		currentIndex = (currentIndex + 1) % heroImages.length;
		const nextImageSrc = heroImages[currentIndex];
		
		console.log(`🎬 Hero cycling to: ${nextImageSrc} (${currentIndex + 1}/${heroImages.length})`);
		
		// Create new image to preload
		const newImg = new Image();
		newImg.onload = function() {
			// Fade out current image
			heroFallback.style.opacity = '0';
			heroFallback.style.transition = 'opacity 0.3s ease-in-out';
			
			setTimeout(() => {
				// Change to new image
				heroFallback.src = nextImageSrc;
				
				// Fade in new image
				heroFallback.style.opacity = '1';
				
				console.log(`✅ Hero image loaded: ${nextImageSrc}`);
			}, 300);
		};
		
		newImg.onerror = function() {
			console.error(`❌ Failed to load hero image: ${nextImageSrc}`);
			// Try next image after a short delay
			setTimeout(cycleHeroImage, 1000);
		};
		
		// Start loading the new image
		newImg.src = nextImageSrc;
	}
	
	function showNextImage() {
		// This function shows the next image without incrementing currentIndex first
		const nextImageSrc = heroImages[currentIndex];
		
		console.log(`🎬 Hero showing: ${nextImageSrc} (${currentIndex + 1}/${heroImages.length})`);
		
		// Create new image to preload
		const newImg = new Image();
		newImg.onload = function() {
			// Fade out current image
			heroFallback.style.opacity = '0';
			heroFallback.style.transition = 'opacity 0.3s ease-in-out';
			
			setTimeout(() => {
				// Change to new image
				heroFallback.src = nextImageSrc;
				
				// Fade in new image
				heroFallback.style.opacity = '1';
				
				console.log(`✅ Hero image loaded: ${nextImageSrc}`);
			}, 300);
		};
		
		newImg.onerror = function() {
			console.error(`❌ Failed to load hero image: ${nextImageSrc}`);
			// Try next image after a short delay
			setTimeout(showNextImage, 1000);
		};
		
		// Start loading the new image
		newImg.src = nextImageSrc;
	}
	
	// Start cycling after a short delay
	setTimeout(() => {
		// Show first image (index 0)
		showNextImage();
		
		console.log('🎬 Hero WebP cycling started with', heroImages.length, 'images');
		
		// Start the cycling loop (change every 2.25 seconds)
		// First cycle will happen after 2.25 seconds, showing image at index 1
		setInterval(cycleHeroImage, 2250);
	}, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
	// Debug: Log browser info
	console.log('Browser Info:', {
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		isIOS: isIOS()
	});
	
	// Apply iOS fallbacks immediately
	replaceWebMWithWebP();
	
	// Also run after a short delay to catch any dynamically loaded content
	setTimeout(replaceWebMWithWebP, 100);
	
	// Initialize hero WebP cycling for iPhone
	setTimeout(initHeroWebPCycling, 500);
	
	// Add fallback for broken images - works on all browsers
	setTimeout(() => {
		// Handle broken images in video elements
		const videos = document.querySelectorAll('video');
		console.log('Found', videos.length, 'video elements');
		
		videos.forEach((video, index) => {
			const sources = video.querySelectorAll('source');
			console.log(`Video ${index}:`, {
				sources: sources.length,
				src: sources[0]?.src,
				readyState: video.readyState,
				networkState: video.networkState
			});
			
			video.addEventListener('error', function(e) {
				console.log('Video failed to load:', e, 'trying WebP fallback');
				if (sources.length > 0) {
					const webmSrc = sources[0].src;
					const webpSrc = webmSrc.replace('.webm', '.webp');
					
					// Replace video with img
					const img = document.createElement('img');
					img.src = webpSrc;
					img.alt = video.alt || 'Image';
					img.className = video.className;
					img.style.cssText = video.style.cssText;
					
					// Copy data attributes
					Array.from(video.attributes).forEach(attr => {
						if (attr.name.startsWith('data-')) {
							img.setAttribute(attr.name, attr.value);
						}
					});
					
					video.parentNode.replaceChild(img, video);
					console.log('Video fallback triggered:', webmSrc, '->', webpSrc);
				}
			});
			
			video.addEventListener('loadstart', function() {
				console.log('Video load started:', sources[0]?.src);
			});
			
			video.addEventListener('canplay', function() {
				console.log('Video can play:', sources[0]?.src);
			});
		});
		
		// Handle broken images in img elements
		const images = document.querySelectorAll('img[src*=".webm"]');
		images.forEach(img => {
			img.addEventListener('error', function() {
				const currentSrc = this.src;
				if (currentSrc.includes('.webm')) {
					this.src = currentSrc.replace('.webm', '.webp');
					console.log('Image fallback triggered:', currentSrc, '->', this.src);
				}
			});
		});
	}, 1000);
	
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
// Only include tokens that have emoji graphics available - reduced to 12 specific tokens
const tokemojiData = [
		{ emoji: "❤️", ticker: "LOVE", price: "$0.0042", change: "+12.5%", marketCap: "$2.1M", changeType: "positive", hasGraphic: true },
		{ emoji: "😂", ticker: "LOL", price: "$0.0047", change: "+18.9%", marketCap: "$2.4M", changeType: "positive", hasGraphic: true },
		{ emoji: "😇", ticker: "GOOD", price: "$0.0041", change: "+9.8%", marketCap: "$2.1M", changeType: "positive", hasGraphic: true },
		{ emoji: "😈", ticker: "EVIL", price: "$0.0032", change: "-3.1%", marketCap: "$1.6M", changeType: "negative", hasGraphic: true },
		{ emoji: "🤑", ticker: "GREED", price: "$0.0067", change: "+31.2%", marketCap: "$3.4M", changeType: "positive", hasGraphic: true },
		{ emoji: "😱", ticker: "FEAR", price: "$0.0023", change: "-12.7%", marketCap: "$1.2M", changeType: "negative", hasGraphic: true },
		{ emoji: "😤", ticker: "MAD", price: "$0.0038", change: "-8.2%", marketCap: "$1.9M", changeType: "negative", hasGraphic: true },
		{ emoji: "🤬", ticker: "HATE", price: "$0.0021", change: "-9.5%", marketCap: "$1.1M", changeType: "negative", hasGraphic: true },
		{ emoji: "🤯", ticker: "OMG", price: "$0.0055", change: "+25.3%", marketCap: "$2.8M", changeType: "positive", hasGraphic: true },
		{ emoji: "😁", ticker: "HAPPY", price: "$0.0029", change: "+5.7%", marketCap: "$1.5M", changeType: "positive", hasGraphic: true },
		{ emoji: "😔", ticker: "SAD", price: "$0.0018", change: "-15.4%", marketCap: "$0.9M", changeType: "negative", hasGraphic: true },
		{ emoji: "👍", ticker: "LIKE", price: "$0.0035", change: "+7.3%", marketCap: "$1.8M", changeType: "positive", hasGraphic: true }
	];

// Filter to only show tokens with graphics
const tokemojiDataWithGraphics = tokemojiData.filter(token => token.hasGraphic);

function getLiveTokenData() {
	return currentTokenData.length > 0 ? currentTokenData : tokemojiDataWithGraphics;
}

function getTokenMarketCapRaw(token) {
	if (token.priceRaw) return token.priceRaw * PUMP_FUN_TOTAL_SUPPLY;
	var str = (token.marketCap || '0').replace('$', '');
	var multiplier = 1;
	if (str.includes('B')) { multiplier = 1e9; str = str.replace('B', ''); }
	else if (str.includes('M')) { multiplier = 1e6; str = str.replace('M', ''); }
	else if (str.includes('K')) { multiplier = 1e3; str = str.replace('K', ''); }
	return (parseFloat(str) || 0) * multiplier;
}

function formatAPIPrice(price) {
	if (price >= 1) {
		return price.toFixed(4);
	} else if (price >= 0.0001) {
		return price.toFixed(6);
	} else {
		return price.toFixed(10);
	}
}

function formatAPIMarketCap(marketCap) {
	if (marketCap >= 1000000000) {
		return (marketCap / 1000000000).toFixed(2) + 'B';
	} else if (marketCap >= 1000000) {
		return (marketCap / 1000000).toFixed(2) + 'M';
	} else if (marketCap >= 1000) {
		return (marketCap / 1000).toFixed(2) + 'K';
	} else {
		return marketCap.toFixed(2);
	}
}

function animatePriceGlobal(element, fromVal, toVal, duration) {
	if (!fromVal || !toVal || fromVal === toVal) {
		element.textContent = '$' + formatAPIPrice(toVal || 0);
		return;
	}
	var startTime = performance.now();
	function tick(now) {
		var elapsed = now - startTime;
		var progress = Math.min(elapsed / duration, 1);
		var eased = 1 - Math.pow(1 - progress, 3);
		var current = fromVal + (toVal - fromVal) * eased;
		element.textContent = '$' + formatAPIPrice(current);
		if (progress < 1) requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
}

let currentTokenData = [];
let tokenListRendered = false;
let currentTokenDataInitialized = false;
var globalUpdateMarketDominance = function() {};
var globalUpdateGauges = function() {};

const PUMP_PORTAL_WS_URL = 'wss://pumpportal.fun/api/data';
let pumpPortalLastMessage = 0;
let pumpPortalHeartbeatTimer = null;
const TOKEMOJI_MINT_MAP = {
	'FVvsVkTQ8cgtzX9dnzZwVh353TZ3k88KVC8eymtqpump': 'GREED',
	'3pWZBTJFByDh7Zojv3PL5FD18CGuvRamRGhKDMiMpump': 'FEAR',
	'ESto2cvLsywSvZeyqaQSu5rTkk6PNudPRDjDqcPo47Gc': 'LOVE',
	'HJXKDhXAkHegzyHpoJ3G2riL6HTbTfz3HNX7o6mRpump': 'HATE',
	'EzRooYJ3yDsS5paSQdb8eW66mMdK3u6yFH8Bvoi4pump': 'GOOD',
	'C7V47ci5u2Ak3VYb62a1obLTY74BLFxLB7d2NLKRpump': 'EVIL',
	'XrJE4Dc7thUMdeox4yULE9KrHcSLU7Pcn92v5YJpump': 'HAPPY',
	'BVrR1uUneY7UWJMggsHA1EUX8bftcMj3XEiGBt5Kpump': 'SAD',
	'EirpkRcuj7oQvTZZgWXuCmQtGvbdHt7hx6Gk5n1Jpump': 'LOL',
	'9HZVe4X2NS7SMUEahVcKbBnxZJzCZUy1UENXd6mppump': 'OMG',
	'A1Z23YRk937wWLnnVi86oj7ykDdMGYuE28ekzpsQpump': 'MAD',
	'9y4nMHKQCMgjHE1UU1pbhykRXG5Xp75Y6B4MxdZapump': 'LIKE'
};
const PUMP_FUN_TOTAL_SUPPLY = 1000000000;
let solPriceUsd = 170;
let pumpPortalWs = null;
let pumpPortalReconnectTimer = null;
let liveTradeCount = 0;
let lastNewTokenTime = 0;

async function fetchSolPrice() {
	try {
		var res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
		if (res.ok) {
			var data = await res.json();
			if (data.solana && data.solana.usd) {
				solPriceUsd = data.solana.usd;
				console.log('[PumpPortal] SOL price:', solPriceUsd);
			}
		}
	} catch (e) {
		console.warn('[PumpPortal] SOL price fetch failed, using:', solPriceUsd);
	}
}

function startHeartbeat() {
	clearInterval(pumpPortalHeartbeatTimer);
	pumpPortalHeartbeatTimer = setInterval(function() {
		if (!pumpPortalWs || pumpPortalWs.readyState !== WebSocket.OPEN) return;

		var timeSinceLastMsg = Date.now() - pumpPortalLastMessage;
		if (timeSinceLastMsg > 30000) {
			console.warn('[PumpPortal] No messages for 30s, reconnecting...');
			pumpPortalWs.close();
		}
	}, 10000);
}

function connectPumpPortal() {
	if (pumpPortalWs) {
		if (pumpPortalWs.readyState === WebSocket.OPEN || pumpPortalWs.readyState === WebSocket.CONNECTING) {
			pumpPortalWs.close();
		}
	}

	clearTimeout(pumpPortalReconnectTimer);
	clearInterval(pumpPortalHeartbeatTimer);

	console.log('[PumpPortal] Connecting...');
	pumpPortalWs = new WebSocket(PUMP_PORTAL_WS_URL);

	pumpPortalWs.onopen = function() {
		console.log('[PumpPortal] Connected');
		updateLiveIndicator(true);
		pumpPortalLastMessage = Date.now();

		var mintAddresses = Object.keys(TOKEMOJI_MINT_MAP);
		pumpPortalWs.send(JSON.stringify({
			method: 'subscribeTokenTrade',
			keys: mintAddresses
		}));

		pumpPortalWs.send(JSON.stringify({
			method: 'subscribeNewToken'
		}));

		console.log('[PumpPortal] Subscribed to', mintAddresses.length, 'tokens + new token events');
		startHeartbeat();
	};

	pumpPortalWs.onmessage = function(event) {
		pumpPortalLastMessage = Date.now();
		try {
			var data = JSON.parse(event.data);

			if (data.txType === 'create') {
				handleNewTokenEvent(data);
			} else if (data.txType === 'buy' || data.txType === 'sell') {
				var ticker = TOKEMOJI_MINT_MAP[data.mint];
				if (ticker) {
					console.log('[PumpPortal] LIVE TRADE:', data.txType.toUpperCase(), ticker, '$' + formatAPIPrice(data.vSolInBondingCurve / data.vTokensInBondingCurve * solPriceUsd));
				}
				handleTokenTradeEvent(data);
			}
		} catch (e) {
			console.warn('[PumpPortal] Parse error:', e);
		}
	};

	pumpPortalWs.onclose = function() {
		console.log('[PumpPortal] Disconnected, reconnecting in 1s...');
		updateLiveIndicator(false);
		clearInterval(pumpPortalHeartbeatTimer);
		clearTimeout(pumpPortalReconnectTimer);
		pumpPortalReconnectTimer = setTimeout(connectPumpPortal, 1000);
	};

	pumpPortalWs.onerror = function() {
		console.error('[PumpPortal] WebSocket error');
		pumpPortalWs.close();
	};
}

function handleNewTokenEvent(data) {
	liveTradeCount++;
	lastNewTokenTime = Date.now();
	pulseLiveIndicator();

	var counterEl = document.getElementById('live-trade-counter');
	if (counterEl) {
		counterEl.textContent = liveTradeCount;
	}

	var lastTradeEl = document.getElementById('live-last-trade');
	if (lastTradeEl && data.mint) {
		var shortMint = data.mint.substring(0, 6) + '...';
		lastTradeEl.textContent = 'NEW: ' + shortMint;
	}
}

function handleTokenTradeEvent(data) {
	var ticker = TOKEMOJI_MINT_MAP[data.mint];
	if (!ticker) return;

	liveTradeCount++;
	pulseLiveIndicator();

	var priceInSol = data.vSolInBondingCurve / data.vTokensInBondingCurve;
	var priceUsd = priceInSol * solPriceUsd;
	var marketCapUsd = priceUsd * PUMP_FUN_TOTAL_SUPPLY;

	console.log('[PumpPortal] ' + data.txType.toUpperCase() + ' ' + ticker + ': $' + formatAPIPrice(priceUsd) + ' (mcap: $' + formatAPIMarketCap(marketCapUsd) + ')');

	updateSingleTokenRow(ticker, priceUsd, marketCapUsd, data.txType);

	var tokenIdx = currentTokenData.findIndex(function(t) { return t.ticker === ticker; });
	if (tokenIdx !== -1) {
		var oldPrice = currentTokenData[tokenIdx].priceRaw;
		currentTokenData[tokenIdx].priceRaw = priceUsd;
		currentTokenData[tokenIdx].price = '$' + formatAPIPrice(priceUsd);
		currentTokenData[tokenIdx].marketCap = '$' + formatAPIMarketCap(marketCapUsd);
		currentTokenData[tokenIdx].changeType = priceUsd >= oldPrice ? 'positive' : 'negative';
		currentTokenData[tokenIdx].priceMovement = priceUsd > oldPrice ? 'up' : 'down';
	}

	globalUpdateMarketDominance();
	globalUpdateGauges();

	var counterEl = document.getElementById('live-trade-counter');
	if (counterEl) {
		counterEl.textContent = liveTradeCount;
	}

	var lastTradeEl = document.getElementById('live-last-trade');
	if (lastTradeEl) {
		lastTradeEl.textContent = data.txType.toUpperCase() + ' ' + ticker;
		lastTradeEl.className = 'live-last-trade ' + (data.txType === 'buy' ? 'text-success' : 'text-danger');
	}
}

function updateSingleTokenRow(ticker, priceUsd, marketCapUsd, txType) {
	var row = document.querySelector('.token-row[data-token="' + ticker + '"]');
	if (!row) return;

	var priceEl = row.querySelector('.token-price');
	var mcapEl = row.querySelector('.token-marketcap');

	if (priceEl) {
		var oldText = priceEl.textContent.replace('$', '');
		var oldVal = parseFloat(oldText) || 0;
		if (oldVal && priceUsd && oldVal !== priceUsd) {
			animatePriceGlobal(priceEl, oldVal, priceUsd, 600);
		} else {
			priceEl.textContent = '$' + formatAPIPrice(priceUsd);
		}

		priceEl.classList.remove('price-tick-up', 'price-tick-down');
		void priceEl.offsetWidth;
		priceEl.classList.add(txType === 'buy' ? 'price-tick-up' : 'price-tick-down');
		setTimeout(function() {
			priceEl.classList.remove('price-tick-up', 'price-tick-down');
		}, 2000);
	}

	if (mcapEl) mcapEl.textContent = '$' + formatAPIMarketCap(marketCapUsd);

	row.classList.remove('trade-flash-buy', 'trade-flash-sell');
	void row.offsetWidth;
	row.classList.add(txType === 'buy' ? 'trade-flash-buy' : 'trade-flash-sell');

	setTimeout(function() {
		row.classList.remove('trade-flash-buy', 'trade-flash-sell');
	}, 1500);
}

function updateLiveIndicator(connected) {
	var indicator = document.getElementById('live-indicator');
	if (!indicator) return;
	if (connected) {
		indicator.classList.add('connected');
		indicator.classList.remove('disconnected');
	} else {
		indicator.classList.remove('connected');
		indicator.classList.add('disconnected');
	}
}

function pulseLiveIndicator() {
	var dot = document.getElementById('live-dot');
	if (!dot) return;
	dot.classList.remove('pulse');
	void dot.offsetWidth;
	dot.classList.add('pulse');
}

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

// Helper function to convert img element to video element for WebM files (global)
function convertImgToVideo(imgElement, webmPath) {
	if (!imgElement || !webmPath) {
		console.log('convertImgToVideo: Missing element or path', imgElement, webmPath);
		return;
	}
	
	console.log('Converting IMG to VIDEO:', imgElement.id, 'with path:', webmPath);
	
	// Create video element
	const videoEl = document.createElement('video');
	videoEl.src = getEmojiPath(webmPath);
	videoEl.autoplay = true;
	videoEl.loop = true;
	videoEl.muted = true;
	videoEl.className = imgElement.className;
	videoEl.style.width = imgElement.style.width || '100%';
	videoEl.style.height = imgElement.style.height || '100%';
	
	// Replace img with video element
	imgElement.parentNode.replaceChild(videoEl, imgElement);
	console.log('Successfully converted IMG to VIDEO');
	return videoEl;
}

document.addEventListener("DOMContentLoaded", function () {
	// Initialize dashboard
	function initTokemojiDashboard() {
		populateTokenList();
		populateNewsFeed();
		updateMarketDominance();
		
		// Delay gauge updates to ensure they happen after iOS replacement
		setTimeout(() => {
			updateGauges();
		}, 200);
		
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

	let currentSortType = 'marketcap';

	const TOKEN_WEBM_MAP = {
		'LOVE': 'assets/img/emojis/love.webm',
		'LOL': 'assets/img/emojis/lol.webm',
		'GOOD': 'assets/img/emojis/good.webm',
		'EVIL': 'assets/img/emojis/evil.webm',
		'GREED': 'assets/img/emojis/greed.webm',
		'FEAR': 'assets/img/emojis/fear.webm',
		'MAD': 'assets/img/emojis/mad.webm',
		'HATE': 'assets/img/emojis/hate.webm',
		'OMG': 'assets/img/emojis/omg.webm',
		'HAPPY': 'assets/img/emojis/happy.webm',
		'SAD': 'assets/img/emojis/sad.webm',
		'LIKE': 'assets/img/emojis/like.webm'
	};

	const SUPABASE_URL = 'https://zhiebsuyfexsxtpekakn.supabase.co';
	const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaWVic3V5ZmV4c3h0cGVrYWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDgzNDIsImV4cCI6MjA3ODQyNDM0Mn0.gH8ihMvsHeOhQ2zO42TLA62-ePq6n53AfYao2l4vk5g';
	const API_BASE = `${SUPABASE_URL}/functions/v1`;
	const API_HEADERS = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
		'apikey': SUPABASE_ANON_KEY
	};

	async function fetchTokenData() {
		try {
			const response = await fetch(`${API_BASE}/get-tokens`, { headers: API_HEADERS });
			if (!response.ok) return [];
			const liveTokens = await response.json();

			return liveTokens.map(token => {
				const ticker = token.emoji_type || token.symbol;
				const currentPrice = token.price_usd;
				const previousToken = currentTokenData.find(t => t.ticker === ticker);
				const oldPriceRaw = previousToken ? previousToken.priceRaw : null;

				let priceMovement = 'none';
				if (oldPriceRaw && currentPrice) {
					if (currentPrice > oldPriceRaw) priceMovement = 'up';
					else if (currentPrice < oldPriceRaw) priceMovement = 'down';
				}

				return {
					emoji: ticker,
					ticker: ticker,
					price: currentPrice ? `$${formatAPIPrice(currentPrice)}` : 'N/A',
					priceRaw: currentPrice,
					oldPriceRaw: oldPriceRaw,
					change: token.change_24h !== null ? `${token.change_24h >= 0 ? '+' : ''}${token.change_24h.toFixed(2)}%` : '0%',
					marketCap: token.market_cap ? `$${formatAPIMarketCap(token.market_cap)}` : 'N/A',
					changeType: (token.change_24h || 0) >= 0 ? 'positive' : 'negative',
					hasGraphic: true,
					priceMovement: priceMovement
				};
			});
		} catch (error) {
			console.error('[Tokemoji] Error fetching API data:', error);
			return [];
		}
	}

	function sortTokens(tokens) {
		const sorted = [...tokens];
		switch(currentSortType) {
			case 'marketcap':
				sorted.sort((a, b) => {
					const aCap = parseFloat(a.marketCap.replace('$', '').replace('M', '').replace('K', '').replace('B', ''));
					const bCap = parseFloat(b.marketCap.replace('$', '').replace('M', '').replace('K', '').replace('B', ''));
					return bCap - aCap;
				});
				break;
			case 'losers':
				sorted.sort((a, b) => {
					const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
					const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
					return aChange - bChange;
				});
				break;
			case 'gainers':
				sorted.sort((a, b) => {
					const aChange = parseFloat(a.change.replace('%', '').replace('+', ''));
					const bChange = parseFloat(b.change.replace('%', '').replace('+', ''));
					return bChange - aChange;
				});
				break;
		}
		return sorted;
	}

	function flashTokenRow(row, priceEl, direction) {
		priceEl.classList.remove('price-tick-up', 'price-tick-down');
		void priceEl.offsetWidth;
		priceEl.classList.add(direction === 'up' ? 'price-tick-up' : 'price-tick-down');

		row.classList.remove('trade-flash-buy', 'trade-flash-sell');
		void row.offsetWidth;
		row.classList.add(direction === 'up' ? 'trade-flash-buy' : 'trade-flash-sell');

		setTimeout(function() {
			row.classList.remove('trade-flash-buy', 'trade-flash-sell');
		}, 1500);
		setTimeout(function() {
			priceEl.classList.remove('price-tick-up', 'price-tick-down');
		}, 2000);
	}

	function renderTokenRow(token, index) {
		const videoSrc = TOKEN_WEBM_MAP[token.ticker] || 'assets/img/emojis/happy.webm';
		return `
		<div class="token-row d-flex align-items-center py-1 border-bottom border-light" data-token="${token.ticker}">
			<span class="token-rank me-2 fw-bold text-muted" style="min-width: 20px; flex-shrink: 0;">${index + 1}</span>
			<div class="token-emoji me-2" style="flex-shrink: 0; width: 36px; height: 36px;">
				${isIOS() ?
					`<img src="${getEmojiPath(videoSrc)}"
						  style="width: 100%; height: 100%; object-fit: contain;">` :
					`<video src="${videoSrc}"
						   autoplay loop muted playsinline
						   style="width: 100%; height: 100%; object-fit: contain;">
					</video>`
				}
			</div>
			<span class="token-ticker fw-bold text-heading me-2" style="min-width: 60px; flex-shrink: 0;">${token.ticker}</span>
			<span class="token-price text-muted me-2" style="min-width: 70px; flex-shrink: 0;">${token.price}</span>
			<span class="token-change ${token.changeType === 'positive' ? 'text-success' : 'text-danger'} fw-bold me-2" style="min-width: 60px; flex-shrink: 0;">${token.change}</span>
			<span class="token-marketcap text-muted me-2" style="min-width: 50px; flex-shrink: 0;">${token.marketCap}</span>
			<button class="btn btn-sm btn-primary buy-btn me-1" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;">BUY</button>
			<button class="btn btn-sm btn-outline-secondary chart-btn" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;" data-token="${token.ticker}">CHART</button>
		</div>`;
	}

	async function populateTokenList() {
		const tokenList = document.getElementById('token-list');
		if (!tokenList) return;

		const apiTokens = await fetchTokenData();
		const sortedTokens = apiTokens.length > 0 ? sortTokens(apiTokens) : [...tokemojiData];

		tokenList.innerHTML = sortedTokens.map((token, index) => renderTokenRow(token, index)).join('');
		if (apiTokens.length > 0) {
			currentTokenData = [...apiTokens];
		} else if (!currentTokenDataInitialized) {
			currentTokenData = tokemojiDataWithGraphics.map(t => ({...t, priceRaw: 0}));
		}
		currentTokenDataInitialized = true;
		tokenListRendered = true;
		setupChartButtons();
	}

	async function refreshTokenPrices() {
		const tokenList = document.getElementById('token-list');
		if (!tokenList || !tokenListRendered) {
			await populateTokenList();
			return;
		}

		const apiTokens = await fetchTokenData();
		if (apiTokens.length === 0) return;

		const delay = 50;
		apiTokens.forEach((token, i) => {
			setTimeout(() => {
				const row = tokenList.querySelector('.token-row[data-token="' + token.ticker + '"]');
				if (!row) return;

				const priceEl = row.querySelector('.token-price');
				const changeEl = row.querySelector('.token-change');
				const mcapEl = row.querySelector('.token-marketcap');

				if (priceEl && token.priceRaw) {
					const oldPrice = token.oldPriceRaw;
					if (oldPrice && oldPrice !== token.priceRaw) {
						animatePriceGlobal(priceEl, oldPrice, token.priceRaw, 800);
						const direction = token.priceRaw > oldPrice ? 'up' : 'down';
						flashTokenRow(row, priceEl, direction);
					} else {
						priceEl.textContent = token.price;
					}
				}

				if (changeEl) {
					changeEl.textContent = token.change;
					changeEl.className = 'token-change ' + (token.changeType === 'positive' ? 'text-success' : 'text-danger') + ' fw-bold me-2';
					changeEl.style.minWidth = '60px';
					changeEl.style.flexShrink = '0';
				}

				if (mcapEl) {
					mcapEl.textContent = token.marketCap;
				}
			}, i * delay);
		});

		currentTokenData = [...apiTokens];
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
		const liveData = getLiveTokenData();
		if (!liveData.length) return;
		const sortedTokens = [...liveData].sort((a, b) => getTokenMarketCapRaw(b) - getTokenMarketCapRaw(a));
		const topToken = sortedTokens[0];
		const totalMarketCap = liveData.reduce((sum, token) => sum + getTokenMarketCapRaw(token), 0);
		const topTokenMarketCap = getTokenMarketCapRaw(topToken);
		const dominancePercentage = totalMarketCap > 0 ? ((topTokenMarketCap / totalMarketCap) * 100).toFixed(1) : '0';

		// Update DOM elements
		const dominanceGifEl = document.getElementById('dominance-gif');
		const dominanceTickerEl = document.getElementById('dominance-ticker');
		const dominancePercentageEl = document.getElementById('dominance-percentage');
		const dominanceBarEl = document.getElementById('dominance-bar');
		
		// Map token tickers to WebM paths (emojis folder)
		const tokenWebMMap = {
			'LOVE': 'assets/img/emojis/love.webm',
			'LOL': 'assets/img/emojis/lol.webm',
			'GOOD': 'assets/img/emojis/good.webm',
			'EVIL': 'assets/img/emojis/evil.webm',
			'GREED': 'assets/img/emojis/greed.webm',
			'FEAR': 'assets/img/emojis/fear.webm',
			'MAD': 'assets/img/emojis/mad.webm',
			'HATE': 'assets/img/emojis/hate.webm',
			'OMG': 'assets/img/emojis/omg.webm',
			'HAPPY': 'assets/img/emojis/happy.webm',
			'SAD': 'assets/img/emojis/sad.webm',
			'LIKE': 'assets/img/emojis/like.webm'
		};
		
		console.log('Top token:', topToken);
		console.log('TokenWebMMap:', tokenWebMMap);
		console.log('DOM elements found:', {
			dominanceGifEl: !!dominanceGifEl,
			dominanceTickerEl: !!dominanceTickerEl,
			dominancePercentageEl: !!dominancePercentageEl,
			dominanceBarEl: !!dominanceBarEl
		});
		
		if (dominanceGifEl) {
			const webmPath = tokenWebMMap[topToken.ticker] || 'assets/img/emojis/love.webm';
			console.log('🎯 DOMINANCE WIDGET DEBUG:', {
				topTokenTicker: topToken.ticker,
				webmPath: webmPath,
				elementType: dominanceGifEl.tagName,
				hasMapping: !!tokenWebMMap[topToken.ticker],
				finalPath: getEmojiPath(webmPath),
				currentSrc: dominanceGifEl.src || dominanceGifEl.querySelector('source')?.src || 'none',
				isIOS: isIOS()
			});
			console.warn('🎯 DOMINANCE WIDGET DEBUG:', {
				topTokenTicker: topToken.ticker,
				webmPath: webmPath,
				elementType: dominanceGifEl.tagName,
				hasMapping: !!tokenWebMMap[topToken.ticker],
				finalPath: getEmojiPath(webmPath),
				currentSrc: dominanceGifEl.src || dominanceGifEl.querySelector('source')?.src || 'none',
				isIOS: isIOS()
			});
			
			if (dominanceGifEl.tagName === 'VIDEO') {
				// Update source element for video and reload
				const source = dominanceGifEl.querySelector('source');
				if (source) {
					source.src = getEmojiPath(webmPath);
					dominanceGifEl.load(); // Reload the video
					console.log('✅ Updated DOMINANCE VIDEO source to:', getEmojiPath(webmPath));
					console.warn('✅ Updated DOMINANCE VIDEO source to:', getEmojiPath(webmPath));
				} else {
					dominanceGifEl.src = getEmojiPath(webmPath);
					dominanceGifEl.load(); // Reload the video
					console.log('Updated DOMINANCE VIDEO src to:', getEmojiPath(webmPath));
				}
			} else {
				// Update src for img element
				dominanceGifEl.src = getEmojiPath(webmPath);
				console.log('✅ Updated DOMINANCE IMG src to:', getEmojiPath(webmPath));
				console.warn('✅ Updated DOMINANCE IMG src to:', getEmojiPath(webmPath));
			}
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

	function updateGauges() {
		const liveData = getLiveTokenData();
		const mcap = (tokens) => tokens.reduce((sum, t) => sum + getTokenMarketCapRaw(t), 0);

		const greedTokens = liveData.filter(token => ['GREED', 'HAPPY', 'LOVE', 'LOL', 'GOOD', 'LIKE'].includes(token.ticker));
		const fearTokens = liveData.filter(token => ['FEAR', 'SAD', 'HATE', 'MAD'].includes(token.ticker));
		const greedMarketCap = mcap(greedTokens);
		const fearMarketCap = mcap(fearTokens);
		const totalEmotionCap = greedMarketCap + fearMarketCap;
		const greedRatio = totalEmotionCap > 0 ? (greedMarketCap / totalEmotionCap) * 100 : 50;
		const greedOffset = 157.1 - (greedRatio / 100) * 157.1;

		const goodTokens = liveData.filter(token => ['GOOD', 'LOVE', 'HAPPY', 'LIKE'].includes(token.ticker));
		const evilTokens = liveData.filter(token => ['EVIL', 'HATE', 'MAD'].includes(token.ticker));
		const goodMarketCap = mcap(goodTokens);
		const evilMarketCap = mcap(evilTokens);
		const totalMoralCap = goodMarketCap + evilMarketCap;
		const goodRatio = totalMoralCap > 0 ? (goodMarketCap / totalMoralCap) * 100 : 50;
		const goodOffset = 157.1 - (goodRatio / 100) * 157.1;

		const loveTokens = liveData.filter(token => ['LOVE', 'HAPPY', 'LIKE'].includes(token.ticker));
		const hateTokens = liveData.filter(token => ['HATE', 'MAD', 'EVIL'].includes(token.ticker));
		const loveMarketCap = mcap(loveTokens);
		const hateMarketCap = mcap(hateTokens);
		const totalLoveHateCap = loveMarketCap + hateMarketCap;
		const loveRatio = totalLoveHateCap > 0 ? (loveMarketCap / totalLoveHateCap) * 100 : 50;
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
			
			// Update gauge emojis - find all gauge-gif-img elements in this gauge
			const gaugeContainer = greedFearResult.closest('.border');
			console.log('🔍 GREED/FEAR GAUGE DEBUG - Container found:', !!gaugeContainer);
			console.warn('🔍 GREED/FEAR GAUGE DEBUG - Container found:', !!gaugeContainer);
			if (gaugeContainer) {
				const gaugeEmojis = gaugeContainer.querySelectorAll('.gauge-gif-img');
				console.log('🔍 GREED/FEAR GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				console.warn('🔍 GREED/FEAR GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				gaugeEmojis.forEach((emoji, index) => {
					console.log(`🔍 GREED/FEAR GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
					console.warn(`🔍 GREED/FEAR GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
				});
				gaugeEmojis.forEach((emoji, index) => {
					// First emoji is GREED, second is FEAR
					const webmPath = index === 0 ? 'assets/img/emojis/greed.webm' : 'assets/img/emojis/fear.webm';
					const finalPath = getEmojiPath(webmPath);
					
					
					if (emoji.tagName === 'VIDEO') {
						// Update existing video element
						const source = emoji.querySelector('source');
						if (source) {
							source.src = finalPath;
							emoji.load();
						} else {
							emoji.src = finalPath;
							emoji.load();
						}
						console.log(`✅ GREED/FEAR Updated gauge video ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ GREED/FEAR Updated gauge video ${index}:`, webmPath, '->', finalPath);
					} else if (emoji.tagName === 'IMG') {
						// Update img src directly
						emoji.src = finalPath;
						console.log(`✅ GREED/FEAR Updated gauge img ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ GREED/FEAR Updated gauge img ${index}:`, webmPath, '->', finalPath);
					}
				});
			}
		}
		if (goodEvilResult) {
			const dominantEmotion = goodRatio > 50 ? 'GOOD' : 'EVIL';
			const dominancePercent = Math.max(goodRatio, 100 - goodRatio);
			goodEvilResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
			goodEvilResult.querySelector('.gauge-percentage').textContent = `${dominancePercent.toFixed(0)}%`;
			
			// Update gauge emojis - find all gauge-gif-img elements in this gauge
			const gaugeContainer = goodEvilResult.closest('.border');
			console.log('🔍 GOOD/EVIL GAUGE DEBUG - Container found:', !!gaugeContainer);
			console.warn('🔍 GOOD/EVIL GAUGE DEBUG - Container found:', !!gaugeContainer);
			if (gaugeContainer) {
				const gaugeEmojis = gaugeContainer.querySelectorAll('.gauge-gif-img');
				console.log('🔍 GOOD/EVIL GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				console.warn('🔍 GOOD/EVIL GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				gaugeEmojis.forEach((emoji, index) => {
					console.log(`🔍 GOOD/EVIL GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
					console.warn(`🔍 GOOD/EVIL GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
				});
				gaugeEmojis.forEach((emoji, index) => {
					// First emoji is GOOD, second is EVIL
					const webmPath = index === 0 ? 'assets/img/emojis/good.webm' : 'assets/img/emojis/evil.webm';
					const finalPath = getEmojiPath(webmPath);
					
					
					if (emoji.tagName === 'VIDEO') {
						// Update existing video element
						const source = emoji.querySelector('source');
						if (source) {
							source.src = finalPath;
							emoji.load();
						} else {
							emoji.src = finalPath;
							emoji.load();
						}
						console.log(`✅ GOOD/EVIL Updated gauge video ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ GOOD/EVIL Updated gauge video ${index}:`, webmPath, '->', finalPath);
					} else if (emoji.tagName === 'IMG') {
						// Update img src directly
						emoji.src = finalPath;
						console.log(`✅ GOOD/EVIL Updated gauge img ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ GOOD/EVIL Updated gauge img ${index}:`, webmPath, '->', finalPath);
					}
				});
			}
		}
		if (loveHateResult) {
			const dominantEmotion = loveRatio > 50 ? 'LOVE' : 'HATE';
			const dominancePercent = Math.max(loveRatio, 100 - loveRatio);
			loveHateResult.querySelector('.gauge-ticker').textContent = dominantEmotion;
			loveHateResult.querySelector('.gauge-percentage').textContent = `${dominancePercent.toFixed(0)}%`;
			
			// Update gauge emojis - find all gauge-gif-img elements in this gauge
			const gaugeContainer = loveHateResult.closest('.border');
			console.log('🔍 LOVE/HATE GAUGE DEBUG - Container found:', !!gaugeContainer);
			console.warn('🔍 LOVE/HATE GAUGE DEBUG - Container found:', !!gaugeContainer);
			if (gaugeContainer) {
				const gaugeEmojis = gaugeContainer.querySelectorAll('.gauge-gif-img');
				console.log('🔍 LOVE/HATE GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				console.warn('🔍 LOVE/HATE GAUGE DEBUG - Emojis found:', gaugeEmojis.length, gaugeEmojis);
				gaugeEmojis.forEach((emoji, index) => {
					console.log(`🔍 LOVE/HATE GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
					console.warn(`🔍 LOVE/HATE GAUGE DEBUG - Emoji ${index}:`, {
						tagName: emoji.tagName,
						className: emoji.className,
						currentSrc: emoji.src || emoji.querySelector('source')?.src || 'none',
						hasSource: !!emoji.querySelector('source')
					});
				});
				gaugeEmojis.forEach((emoji, index) => {
					// First emoji is LOVE, second is HATE
					const webmPath = index === 0 ? 'assets/img/emojis/love.webm' : 'assets/img/emojis/hate.webm';
					const finalPath = getEmojiPath(webmPath);
					
					
					if (emoji.tagName === 'VIDEO') {
						// Update existing video element
						const source = emoji.querySelector('source');
						if (source) {
							source.src = finalPath;
							emoji.load();
						} else {
							emoji.src = finalPath;
							emoji.load();
						}
						console.log(`✅ LOVE/HATE Updated gauge video ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ LOVE/HATE Updated gauge video ${index}:`, webmPath, '->', finalPath);
					} else if (emoji.tagName === 'IMG') {
						// Update img src directly
						emoji.src = finalPath;
						console.log(`✅ LOVE/HATE Updated gauge img ${index}:`, webmPath, '->', finalPath);
						console.warn(`✅ LOVE/HATE Updated gauge img ${index}:`, webmPath, '->', finalPath);
					}
				});
			}
		}
	}

	globalUpdateMarketDominance = updateMarketDominance;
	globalUpdateGauges = updateGauges;

	initTokemojiDashboard();

	fetchSolPrice();
	setInterval(fetchSolPrice, 60000);

	connectPumpPortal();

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

	setInterval(async () => {
		await refreshTokenPrices();
		updateMarketDominance();
		updateGauges();
		initializeCarouselData();
		updateTopGainers();
		updateTopLosers();
		updateGlobalAdoption();
	}, 60000);
	
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
	const gainers = getLiveTokenData().filter(token => token.changeType === 'positive');
	const losers = getLiveTokenData().filter(token => token.changeType === 'negative');

	console.log('Carousel data initialization:', {
		totalTokens: getLiveTokenData().length,
		gainers: gainers.length,
		losers: losers.length,
		gainersData: gainers.map(g => g.ticker),
		losersData: losers.map(l => l.ticker)
	});
	
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
	
	console.log('🔄 CAROUSEL UPDATE - Top Gainers, current index:', gainersCurrentIndex, 'at:', new Date().toISOString());
	console.warn('🔄 CAROUSEL UPDATE - Top Gainers, current index:', gainersCurrentIndex, 'at:', new Date().toISOString());
	
	// Map token tickers to WebM paths
	const tokenWebMMap = {
		'LOVE': 'assets/img/emojis/love.webm',
		'LOL': 'assets/img/emojis/lol.webm',
		'GOOD': 'assets/img/emojis/good.webm',
		'EVIL': 'assets/img/emojis/evil.webm',
		'GREED': 'assets/img/emojis/greed.webm',
		'FEAR': 'assets/img/emojis/fear.webm',
		'MAD': 'assets/img/emojis/mad.webm',
		'HATE': 'assets/img/emojis/hate.webm',
		'OMG': 'assets/img/emojis/omg.webm',
		'HAPPY': 'assets/img/emojis/happy.webm',
		'SAD': 'assets/img/emojis/sad.webm',
		'LIKE': 'assets/img/emojis/like.webm'
	};
	
	// Get current set of 3 tokens (with wrapping)
	const currentSet = [
		gainersCarouselData[(gainersCurrentIndex - 1 + gainersCarouselData.length) % gainersCarouselData.length],
		gainersCarouselData[gainersCurrentIndex],
		gainersCarouselData[(gainersCurrentIndex + 1) % gainersCarouselData.length]
	];
	
	// Update GIFs with video elements
	const leftGif = document.getElementById('top-gainer-gif-left');
	const centerGif = document.getElementById('top-gainer-gif-center');
	const rightGif = document.getElementById('top-gainer-gif-right');
	
	console.log('🎯 CAROUSEL ELEMENTS - Top Gainers elements found:', {
		leftGif: !!leftGif,
		centerGif: !!centerGif,
		rightGif: !!rightGif,
		currentSet: currentSet.map(c => c ? c.ticker : 'null'),
		isIOS: isIOS(),
		leftGifTag: leftGif ? leftGif.tagName : 'null',
		centerGifTag: centerGif ? centerGif.tagName : 'null',
		rightGifTag: rightGif ? rightGif.tagName : 'null'
	});
	console.warn('🎯 CAROUSEL ELEMENTS - Top Gainers elements found:', {
		leftGif: !!leftGif,
		centerGif: !!centerGif,
		rightGif: !!rightGif,
		currentSet: currentSet.map(c => c ? c.ticker : 'null'),
		isIOS: isIOS(),
		leftGifTag: leftGif ? leftGif.tagName : 'null',
		centerGifTag: centerGif ? centerGif.tagName : 'null',
		rightGifTag: rightGif ? rightGif.tagName : 'null'
	});
	
	if (leftGif && currentSet[0]) {
		const webmPath = tokenWebMMap[currentSet[0].ticker] || 'assets/img/emojis/hate.webm';
		console.log('🔍 LEFT GAINER DEBUG:', {
			ticker: currentSet[0].ticker,
			elementType: leftGif.tagName,
			webmPath: webmPath,
			hasMapping: !!tokenWebMMap[currentSet[0].ticker],
			finalPath: getEmojiPath(webmPath),
			currentSrc: leftGif.src || leftGif.querySelector('source')?.src || 'none',
			isIOS: isIOS()
		});
		console.warn('🔍 LEFT GAINER DEBUG:', {
			ticker: currentSet[0].ticker,
			elementType: leftGif.tagName,
			webmPath: webmPath,
			hasMapping: !!tokenWebMMap[currentSet[0].ticker],
			finalPath: getEmojiPath(webmPath),
			currentSrc: leftGif.src || leftGif.querySelector('source')?.src || 'none',
			isIOS: isIOS()
		});
		
		if (leftGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = leftGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				leftGif.load(); // Reload the video
				console.log('✅ Updated VIDEO source to:', getEmojiPath(webmPath));
				console.warn('✅ Updated VIDEO source to:', getEmojiPath(webmPath));
			} else {
				leftGif.src = getEmojiPath(webmPath);
				leftGif.load(); // Reload the video
				console.log('Updated VIDEO src to:', getEmojiPath(webmPath));
			}
		} else {
			// Update src for img element
			leftGif.src = getEmojiPath(webmPath);
			console.log('✅ Updated IMG src to:', getEmojiPath(webmPath));
			console.warn('✅ Updated IMG src to:', getEmojiPath(webmPath));
		}
	}
	if (centerGif && currentSet[1]) {
		const webmPath = tokenWebMMap[currentSet[1].ticker] || 'assets/img/emojis/hate.webm';
		console.log('Center gainer debug:', {
			ticker: currentSet[1].ticker,
			elementType: centerGif.tagName,
			webmPath: webmPath,
			hasMapping: !!tokenWebMMap[currentSet[1].ticker]
		});
		
		if (centerGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = centerGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				centerGif.load(); // Reload the video
			} else {
				centerGif.src = getEmojiPath(webmPath);
				centerGif.load(); // Reload the video
			}
		} else {
			// Update src for img element
			centerGif.src = getEmojiPath(webmPath);
		}
	}
	if (rightGif && currentSet[2]) {
		const webmPath = tokenWebMMap[currentSet[2].ticker] || 'assets/img/emojis/hate.webm';
		console.log('Right gainer debug:', {
			ticker: currentSet[2].ticker,
			elementType: rightGif.tagName,
			webmPath: webmPath,
			hasMapping: !!tokenWebMMap[currentSet[2].ticker]
		});
		
		if (rightGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = rightGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				rightGif.load(); // Reload the video
			} else {
				rightGif.src = getEmojiPath(webmPath);
				rightGif.load(); // Reload the video
			}
		} else {
			// Update src for img element
			rightGif.src = getEmojiPath(webmPath);
		}
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
	
	console.log('Updating Top Losers, current index:', losersCurrentIndex);
	
	// Map token tickers to WebM paths
	const tokenWebMMap = {
		'LOVE': 'assets/img/emojis/love.webm',
		'LOL': 'assets/img/emojis/lol.webm',
		'GOOD': 'assets/img/emojis/good.webm',
		'EVIL': 'assets/img/emojis/evil.webm',
		'GREED': 'assets/img/emojis/greed.webm',
		'FEAR': 'assets/img/emojis/fear.webm',
		'MAD': 'assets/img/emojis/mad.webm',
		'HATE': 'assets/img/emojis/hate.webm',
		'OMG': 'assets/img/emojis/omg.webm',
		'HAPPY': 'assets/img/emojis/happy.webm',
		'SAD': 'assets/img/emojis/sad.webm',
		'LIKE': 'assets/img/emojis/like.webm'
	};
	
	// Get current set of 3 tokens (with wrapping)
	const currentSet = [
		losersCarouselData[(losersCurrentIndex - 1 + losersCarouselData.length) % losersCarouselData.length],
		losersCarouselData[losersCurrentIndex],
		losersCarouselData[(losersCurrentIndex + 1) % losersCarouselData.length]
	];
	
	// Update GIFs with video elements
	const leftGif = document.getElementById('top-loser-gif-left');
	const centerGif = document.getElementById('top-loser-gif-center');
	const rightGif = document.getElementById('top-loser-gif-right');
	
	console.log('Top Losers elements found:', {
		leftGif: !!leftGif,
		centerGif: !!centerGif,
		rightGif: !!rightGif,
		currentSet: currentSet.map(c => c ? c.ticker : 'null')
	});
	
	if (leftGif && currentSet[0]) {
		const webmPath = tokenWebMMap[currentSet[0].ticker] || 'assets/img/emojis/sad.webm';
		console.log('Left loser:', currentSet[0].ticker, 'element type:', leftGif.tagName, 'path:', webmPath);
		
		if (leftGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = leftGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				leftGif.load(); // Reload the video
			} else {
				leftGif.src = getEmojiPath(webmPath);
				leftGif.load(); // Reload the video
			}
		} else {
			// Update src for img element
			leftGif.src = getEmojiPath(webmPath);
		}
	}
	if (centerGif && currentSet[1]) {
		const webmPath = tokenWebMMap[currentSet[1].ticker] || 'assets/img/emojis/sad.webm';
		console.log('Center loser:', currentSet[1].ticker, 'element type:', centerGif.tagName, 'path:', webmPath);
		
		if (centerGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = centerGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				centerGif.load(); // Reload the video
			} else {
				centerGif.src = getEmojiPath(webmPath);
				centerGif.load(); // Reload the video
			}
		} else {
			// Update src for img element
			centerGif.src = getEmojiPath(webmPath);
		}
	}
	if (rightGif && currentSet[2]) {
		const webmPath = tokenWebMMap[currentSet[2].ticker] || 'assets/img/emojis/sad.webm';
		console.log('Right loser:', currentSet[2].ticker, 'element type:', rightGif.tagName, 'path:', webmPath);
		
		if (rightGif.tagName === 'VIDEO') {
			// Update source element for video and reload
			const source = rightGif.querySelector('source');
			if (source) {
				source.src = getEmojiPath(webmPath);
				rightGif.load(); // Reload the video
			} else {
				rightGif.src = getEmojiPath(webmPath);
				rightGif.load(); // Reload the video
			}
		} else {
			// Update src for img element
			rightGif.src = getEmojiPath(webmPath);
		}
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

}); // End of DOMContentLoaded event listener
