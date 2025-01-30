document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all collapsible buttons
    const collapsibleButtons = document.querySelectorAll('button');
    
    collapsibleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the content container that follows this button
            const content = this.nextElementSibling;
            const icon = this.querySelector('[data-collapse-icon]');
            
            // Toggle the content visibility
            content.classList.toggle('hidden');
            
            // Rotate the icon 180 degrees when expanded
            icon.style.transform = content.classList.contains('hidden') 
                ? 'rotate(0deg)' 
                : 'rotate(180deg)';
        });
    });
});
