class TooltipComponent {
    constructor(targetElement, tooltipText) {
        this.targetElement = targetElement;
        this.tooltipText = tooltipText;
        this.tooltipElement = null;
    }

    init() {
        this.targetElement.addEventListener('mouseenter', () => this.showTooltip());
        this.targetElement.addEventListener('mouseleave', () => this.hideTooltip());
        this.targetElement.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
    }

    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.tooltipText;
        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
    }

    showTooltip() {
        if (!this.tooltipElement) {
            this.createTooltipElement();
        }
        this.tooltipElement.style.display = 'block';
    }

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.display = 'none';
        }
    }

    updateTooltipPosition(e) {
        if (this.tooltipElement) {
            const offsetX = 15;
            const offsetY = 15;
            this.tooltipElement.style.left = `${e.pageX + offsetX}px`;
            this.tooltipElement.style.top = `${e.pageY + offsetY}px`;
        }
    }
}

// Usage example (to be implemented where needed):
// const tooltip = new TooltipComponent(document.getElementById('targetElementId'), 'Tooltip text goes here');
// tooltip.init();

console.log('TooltipComponent initialized successfully.');

// Error handling example
try {
    // Simulated operation that might throw an error
    console.log('Performing an operation that could fail...');
    // throw new Error('Simulated error');
    console.log('Operation completed successfully.');
} catch (error) {
    console.error('Error occurred in TooltipComponent:', error.message, error.stack);
}