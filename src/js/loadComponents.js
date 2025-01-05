(function() {
    // Immediately inject critical styles
    const criticalStyles = document.createElement('style');
    criticalStyles.textContent = `
        html, body {
            background-color: black !important;
            visibility: hidden;
        }
    `;
    // Force this style to be the first in head
    if (document.head.firstChild) {
        document.head.insertBefore(criticalStyles, document.head.firstChild);
    } else {
        document.head.appendChild(criticalStyles);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Create a promise for each fetch operation
    const headerPromise = fetch('/src/components/header.html').then(response => response.text());
    const navPromise = fetch('/src/components/nav.html').then(response => response.text());
    const footerPromise = fetch('/src/components/footer.html').then(response => response.text());

    // Add a promise to wait for CSS to load
    const cssPromise = new Promise((resolve) => {
        const styleSheets = Array.from(document.styleSheets);
        if (styleSheets.some(sheet => sheet.href && sheet.href.includes('output.css'))) {
            resolve();
        } else {
            const link = document.querySelector('link[href="/output.css"]');
            if (link) {
                link.addEventListener('load', resolve);
            } else {
                resolve(); // Resolve anyway if we can't find the stylesheet
            }
        }
    });

    // Wait for all components AND CSS to load before showing anything
    Promise.all([headerPromise, navPromise, footerPromise, cssPromise])
        .then(([headerData, navData, footerData]) => {
            // Replace the content of head except for the title and critical styles
            const head = document.head;
            const title = document.title;
            const criticalStyles = head.querySelector('style');
            head.innerHTML = headerData + `<title>${title}</title>`;
            // Re-add our critical styles
            head.insertBefore(criticalStyles, head.firstChild);

            document.getElementById('nav-placeholder').innerHTML = navData;
            document.getElementById('footer-placeholder').innerHTML = footerData;
            
            // Highlight current page in navigation
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('#nav-placeholder a');
            
            console.log('Current path:', currentPath);
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return; // Skip if href is null
                
                // Skip dropdown toggle links
                if (href === '#') return;
                
                // Normalize paths for comparison
                const normalizedHref = href.replace('/index.html', '/');
                const normalizedCurrentPath = currentPath.replace('/index.html', '/');
                
                console.log('Comparing:', { normalizedCurrentPath, normalizedHref });
                
                // Check if the normalized paths match
                if (normalizedCurrentPath === normalizedHref || 
                    (normalizedCurrentPath === '/' && (href === '/index.html' || href === '/'))) {
                    console.log('Match found! Adding highlight to:', href);
                    link.style.color = '#006969'; // Explicit color setting
                    // Alternative approach:
                    // link.setAttribute('style', 'color: var(--darkCyan) !important');
                }
            });

            // Show everything at once when ready
            document.body.style.visibility = 'visible';
        })
        .catch(error => {
            console.error('Error loading components:', error);
            document.body.style.visibility = 'visible';
        });
});
