// Highlights the 'On this page' entry for the section being read. The page content scrolls within .main,
// not the window, so its scroll position is what's tracked.
(function () {
	const main = document.querySelector('.main');
	const links = Array.from(document.querySelectorAll('.page-toc a'));
	if (!main || links.length === 0) {
		return;
	}
	const headings = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));

	function update() {
		// the current section: the last heading above a line a little below the top of the content
		const line = main.getBoundingClientRect().top + 80;
		let current = 0;
		headings.forEach((heading, i) => {
			if (heading && heading.getBoundingClientRect().top <= line) {
				current = i;
			}
		});
		// at the end of the page, the last section is current, even if its heading can't reach the line
		if (main.scrollTop + main.clientHeight >= main.scrollHeight - 2) {
			current = headings.length - 1;
		}
		links.forEach((link, i) => link.classList.toggle('current', i === current));
	}

	main.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	update();
})();
