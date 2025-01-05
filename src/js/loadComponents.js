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

    Promise.all([headerPromise, navPromise, footerPromise])
        .then(([headerData, navData, footerData]) => {
            const head = document.head;
            const title = document.title;
            const criticalStyles = head.querySelector('style');
            
            // Replace the content but preserve our critical styles
            head.innerHTML = headerData + `<title>${title}</title>`;
            head.insertBefore(criticalStyles, head.firstChild);

            // Update all relative URLs in nav and footer
            if (basePath) {
                navData = navData.replace(/src="\//g, `src="${basePath}/`);
                navData = navData.replace(/href="\//g, `href="${basePath}/`);
                footerData = footerData.replace(/src="\//g, `src="${basePath}/`);
                footerData = footerData.replace(/href="\//g, `href="${basePath}/`);
            }

            document.getElementById('nav-placeholder').innerHTML = navData;
            document.getElementById('footer-placeholder').innerHTML = footerData;

            // Show the page once everything is loaded
            document.body.style.visibility = 'visible';
        })
        .catch(error => {
            console.error('Error loading components:', error);
            document.body.style.visibility = 'visible';
        });
});
