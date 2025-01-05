(function() {
    // Immediately inject critical styles
    const criticalStyles = document.createElement('style');
    criticalStyles.textContent = `
        html, body {
            background-color: black !important;
            visibility: hidden;
        }
    `;
    if (document.head.firstChild) {
        document.head.insertBefore(criticalStyles, document.head.firstChild);
    } else {
        document.head.appendChild(criticalStyles);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Get the base path for GitHub Pages
    const basePath = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        ? ''  // Use empty base path for local development
        : '/Ataraxiz.com'; // Adjust this to match your repository name

    // Update fetch paths with base path
    const headerPromise = fetch(`${basePath}/src/components/header.html`).then(response => response.text());
    const navPromise = fetch(`${basePath}/src/components/nav.html`).then(response => response.text());
    const footerPromise = fetch(`${basePath}/src/components/footer.html`).then(response => response.text());

    // Add CSS loading promise
    const cssPromise = new Promise((resolve) => {
        const styleSheets = Array.from(document.styleSheets);
        if (styleSheets.some(sheet => sheet.href && sheet.href.includes('output.css'))) {
            resolve();
        } else {
            const link = document.querySelector(`link[href$="output.css"]`);
            if (link) {
                link.addEventListener('load', resolve);
            } else {
                resolve();
            }
        }
    });

    Promise.all([headerPromise, navPromise, footerPromise, cssPromise])
        .then(([headerData, navData, footerData]) => {
            // Update paths in the header content
            headerData = headerData.replace(/href="(?!http|#|mailto)/g, `href="${basePath}/`);
            
            const head = document.head;
            const title = document.title;
            const criticalStyles = head.querySelector('style');
            head.innerHTML = headerData + `<title>${title}</title>`;
            head.insertBefore(criticalStyles, head.firstChild);

            // Update paths in the nav content
            navData = navData.replace(/href="(?!http|#|mailto)/g, `href="${basePath}/`);
            navData = navData.replace(/src="(?!http|data)/g, `src="${basePath}/`);
            document.getElementById('nav-placeholder').innerHTML = navData;

            // Update paths in the footer content
            footerData = footerData.replace(/href="(?!http|#|mailto)/g, `href="${basePath}/`);
            footerData = footerData.replace(/src="(?!http|data)/g, `src="${basePath}/`);
            document.getElementById('footer-placeholder').innerHTML = footerData;

            // Navigation highlighting
            const currentPath = window.location.pathname.replace(basePath, '');
            const navLinks = document.querySelectorAll('#nav-placeholder a');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                
                const normalizedHref = href.replace(basePath, '').replace('/index.html', '/');
                const normalizedCurrentPath = currentPath.replace('/index.html', '/');
                
                if (normalizedCurrentPath === normalizedHref || 
                    (normalizedCurrentPath === '/' && (normalizedHref === '/index.html' || normalizedHref === '/'))) {
                    link.style.color = '#006969';
                }
            });

            document.body.style.visibility = 'visible';
        })
        .catch(error => {
            console.error('Error loading components:', error);
            document.body.style.visibility = 'visible';
        });
});
