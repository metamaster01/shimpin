class StickyProductComponent extends HTMLElement {
    static get observedAttributes() {
      return ['data-sticky-id', 'data-sticky-layout'];
    }
  
    constructor() {
      super();
      this.currentLayout = 'default';
      this.productForm = document.querySelector('[data-sticky-target]');
      this.footer = document.querySelector('.section-footer');
      this.totalHeight = document.body.clientHeight;
  
      this.moveStickyElements = this.moveStickyElements.bind(this);
      this.handleScroll = this.handleScroll.bind(this);    
    }
  
    connectedCallback() {
        document.addEventListener('DOMContentLoaded', function () {
            this.currentLayout = 'default';
            const targetButtonATC = document.querySelector('[product-form-sticky-js]');
            const cloneTargetAtc = targetButtonATC.cloneNode(true);
            const targetNodeAtc = document.querySelector('[data-target-id="atc"]');
            targetNodeAtc.append(cloneTargetAtc);
        });
      window.addEventListener("scroll", this.handleScroll);
    }
  
    disconnectedCallback() {
      window.removeEventListener("scroll", this.handleScroll);
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data-sticky-layout') {
        this.currentLayout = newValue;
        this.moveStickyElements();
      }
    }
  
    moveStickyElements() {
      const STICKY_ID_ATTR = 'data-sticky-id';
      const STICKY_LAYOUT_ATTR = 'data-sticky-layout';
      const stickyLayouts = document.querySelectorAll(`[${STICKY_LAYOUT_ATTR}~="${this.currentLayout}"]`);
  
      stickyLayouts.forEach(function (stickyLayout) {
          if (stickyLayout.childElementCount !== 0) return;
          const targetNode = stickyLayout;
          const id = stickyLayout.getAttribute(STICKY_ID_ATTR);
          const stickyItems = document.querySelectorAll(`[${STICKY_ID_ATTR}="${id}"]`);
  
          stickyItems.forEach(function (item) {
              if (item.getAttribute(STICKY_LAYOUT_ATTR) === this.currentLayout || item.childElementCount === null) return;
              const targetButton = item.querySelector('[btn-wishlist-js], [btn-compare-js]');
              const appendResult = targetNode.append(targetButton);
              if (appendResult) return;
          }.bind(this)); 
      }.bind(this));
    }
  
    handleScroll() {
      if (!this.productForm) return;
      let scrolled = Math.ceil(this.scrollY) || Math.ceil(document.documentElement.scrollTop);
      let scrollTarget = this.productForm.offsetTop + this.productForm.offsetHeight + this.productForm.clientHeight;
      let scrollTargetEnd = this.footer.offsetTop - this.footer.clientHeight + this.footer.offsetHeight - this.offsetTop;
   
      if (scrolled >= scrollTarget && scrolled <= scrollTargetEnd) {
          setTimeout(() => {
              this.classList.remove('hidden');
          }, 200);
      } else {
          this.classList.add('hidden');   
      }
  
      if (!this.classList.contains('hidden')) {
          let layout = 'sticky';
          if (layout !== this.currentLayout) {
              this.currentLayout = layout;
              this.moveStickyElements();
          }
          this.style.transform = 'translateY(0)';
      } else {
          this.currentLayout = 'default';
          this.moveStickyElements();
          this.style.transform = 'translateY(60px)'; 
      }
    }
}

customElements.define('sticky-product-component', StickyProductComponent);

