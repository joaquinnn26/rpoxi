// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de scroll en el header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 26, 26, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(26, 26, 26, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.servicio-card, .galeria-item, .feature, .stat').forEach(el => {
    observer.observe(el);
});

// Formulario de contacto - Envío directo a WhatsApp
const contactForm = document.getElementById('cotizacionForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const servicio = document.getElementById('servicio').value;
        const descripcion = document.getElementById('descripcion').value;
        
        // Validación básica
        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#e2e8f0';
            }
        });
        
        if (isValid) {
            // Crear mensaje para WhatsApp
            const mensaje = `🔥 *COTIZACIÓN - Repoxy* 🔥

👤 *Cliente:* ${nombre}
📧 *Email:* ${email}
📱 *Teléfono:* ${telefono}

🛠️ *Servicio Solicitado:* ${servicio}

📝 *Descripción del Proyecto:*
${descripcion}

⏰ *Fecha:* ${new Date().toLocaleDateString('es-ES')}

¡Hola! Me interesa solicitar una cotización para el servicio de pintura epoxy. Por favor, contáctame para más detalles.`;

            // Número de WhatsApp (CAMBIAR POR TU NÚMERO REAL)
            const numeroWhatsApp = '543512263388'; // Formato: código país + número sin + ni espacios
            
            // Crear URL de WhatsApp
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            
            // Abrir WhatsApp
            window.open(urlWhatsApp, '_blank');
            
            // Mostrar confirmación
            showNotification('Redirigiendo a WhatsApp...', 'success');
            
            // Limpiar formulario después de un momento
            setTimeout(() => {
                this.reset();
            }, 1000);
            
        } else {
            // Mostrar mensaje de error
            showNotification('Por favor, completa todos los campos requeridos', 'error');
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Efecto parallax suave en el hero - REMOVIDO para evitar problemas de scroll

// Contador animado para las estadísticas
function animateCounter(element, target, originalSuffix, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + originalSuffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + originalSuffix;
        }
    }
    
    updateCounter();
}

// Animar contadores cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const originalText = stat.textContent;
                const number = parseInt(originalText.replace(/\D/g, ''));
                
                if (number) {
                    // Extraer el sufijo original (+, °C, %, etc.)
                    const originalSuffix = originalText.replace(/\d/g, '');
                    
                    // Iniciar con 0 + sufijo original
                    stat.textContent = '0' + originalSuffix;
                    
                    // Animar con el sufijo original
                    animateCounter(stat, number, originalSuffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.nosotros-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Efecto de hover mejorado para las tarjetas de servicios
document.querySelectorAll('.servicio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading para imágenes (cuando se agreguen imágenes reales)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
lazyLoadImages();

// Efecto de typing para el título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto de typing al cargar la página
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Validación en tiempo real para el formulario
document.querySelectorAll('.contacto-form input, .contacto-form textarea, .contacto-form select').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
    
    field.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
            this.style.borderColor = '#e2e8f0';
        }
    });
});

// Botón fijo de WhatsApp
function createWhatsAppButton() {
    const button = document.createElement('a');
    button.innerHTML = '<i class="fab fa-whatsapp"></i>';
    button.className = 'whatsapp-button';
    button.href = 'https://wa.me/5493512263388?text=Hola!%20Me%20interesa%20solicitar%20información%20sobre%20sus%20servicios%20de%20pintura%20electrostática%20y%20epoxi.';
    button.target = '_blank';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25D366;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4), 0 0 0 1px rgba(37, 211, 102, 0.2);
        text-decoration: none;
        font-size: 1.5rem;
    `;
    
    document.body.appendChild(button);
    
    // Efecto hover
    button.addEventListener('mouseenter', () => {
        button.style.background = '#128C7E';
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.5), 0 0 0 1px rgba(37, 211, 102, 0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = '#25D366';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4), 0 0 0 1px rgba(37, 211, 102, 0.2)';
    });
    
    // Efecto de pulso
    setInterval(() => {
        button.style.animation = 'pulse 2s infinite';
    }, 5000);
}

// Crear botón de WhatsApp
createWhatsAppButton();

// Funcionalidad del video del hero
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    const expandBtn = document.querySelector('.video-expand-btn');
    const videoContainer = document.querySelector('.hero-video-container');
    
    if (!heroVideo || !expandBtn) return;
    
    // Función para expandir a pantalla completa
    function enterFullscreen() {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    }
    
    // Función para salir de pantalla completa
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    // Event listener para el botón de expandir
    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterFullscreen();
    });
    
    // Event listener para hacer clic en el video
    heroVideo.addEventListener('click', () => {
        enterFullscreen();
    });
    
    // Cambiar icono cuando esté en pantalla completa
    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = document.fullscreenElement;
        const icon = expandBtn.querySelector('i');
        
        if (isFullscreen) {
            icon.className = 'fas fa-compress';
            expandBtn.title = 'Salir de pantalla completa';
        } else {
            icon.className = 'fas fa-expand';
            expandBtn.title = 'Ver en pantalla completa';
        }
    });
    
    // Event listener para salir con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.fullscreenElement) {
            exitFullscreen();
        }
    });
    
    // Pausar/reanudar video al hacer clic
    heroVideo.addEventListener('click', (e) => {
        e.preventDefault();
        if (heroVideo.paused) {
            heroVideo.play();
        } else {
            heroVideo.pause();
        }
    });
}

// Inicializar funcionalidad del video
initHeroVideo();

// Sistema de galería con carga progresiva
class ProgressiveGallery {
    constructor() {
        this.galleryGrid = document.getElementById('galeriaGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.currentIndex = 0;
        this.itemsPerLoad = 6;
        
        // Datos de la galería
        this.galleryItems = [
            // Autopartes
            { type: 'image', src: 'images/autoparte1.jpeg', title: 'Autoparte Pintada - Proceso Electrostático', category: 'autopartes', alt: 'Autoparte 1' },
            { type: 'image', src: 'images/autoparte2.jpeg', title: 'Autoparte Pintada - Acabado Profesional', category: 'autopartes', alt: 'Autoparte 2' },
            { type: 'image', src: 'images/autoparte3.jpeg', title: 'Autoparte Pintada - Resistencia al Calor', category: 'autopartes', alt: 'Autoparte 3' },
            
            
            // Llantas
            { type: 'image', src: 'images/llanta.jpeg', title: 'Llanta Pintada - Acabado Duradero', category: 'llantas', alt: 'Llanta' },
            { type: 'image', src: 'images/llanta1.jpeg', title: 'Llanta Pintada - Proceso Electrostático', category: 'llantas', alt: 'Llanta 1' },
            { type: 'image', src: 'images/llanta2.jpeg', title: 'Llanta Pintada - Resistencia al Desgaste', category: 'llantas', alt: 'Llanta 2' },
            { type: 'image', src: 'images/llanta3.jpeg', title: 'Llanta Pintada - Acabado Profesional', category: 'llantas', alt: 'Llanta 3' },
            
            // Piezas Metálicas
            { type: 'image', src: 'images/piezametalica.jpeg', title: 'Pieza Metálica Pintada - Protección Anticorrosión', category: 'metales', alt: 'Pieza Metálica' },
            { type: 'image', src: 'images/piezametalica1.jpeg', title: 'Pieza Metálica Pintada - Proceso de Horneado', category: 'metales', alt: 'Pieza Metálica 1' },
            
            // Cuadros
            { type: 'image', src: 'images/cuadro.jpeg', title: 'Cuadro Pintado - Acabado Electrostático', category: 'metales', alt: 'Cuadro' },
            { type: 'image', src: 'images/cuadro1.jpeg', title: 'Cuadro Pintado - Proceso Profesional', category: 'metales', alt: 'Cuadro 1' },
            
            // Trabajos Adicionales
            { type: 'image', src: 'images/WhatsApp Image 2025-09-19 at 12.56.32 (2).jpeg', title: 'Trabajo de Pintura - Proceso Electrostático', category: 'metales', alt: 'Trabajo 1' },
            { type: 'image', src: 'images/WhatsApp Image 2025-09-19 at 12.56.37.jpeg', title: 'Trabajo de Pintura - Resistencia al Calor', category: 'metales', alt: 'Trabajo 3' },
            { type: 'image', src: 'images/WhatsApp Image 2025-09-19 at 12.56.42.jpeg', title: 'Trabajo de Pintura - Proceso de Horneado', category: 'metales', alt: 'Trabajo 4' },
            { type: 'image', src: 'images/WhatsApp Image 2025-09-19 at 12.56.43 (1).jpeg', title: 'Trabajo de Pintura - Acabado Duradero', category: 'metales', alt: 'Trabajo 5' },
            { type: 'image', src: 'images/WhatsApp Image 2025-09-19 at 12.56.43.jpeg', title: 'Trabajo de Pintura - Protección Anticorrosión', category: 'metales', alt: 'Trabajo 6' },
            
            // Videos
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.02.08.mp4', title: 'Proceso de Pintura - Video 1', category: 'hornos', alt: 'Video 1' },
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.02.16.mp4', title: 'Proceso de Pintura - Video 2', category: 'hornos', alt: 'Video 2' },
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.02.35.mp4', title: 'Proceso de Pintura - Video 3', category: 'hornos', alt: 'Video 3' },
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.03.10.mp4', title: 'Proceso de Pintura - Video 4', category: 'hornos', alt: 'Video 4' },
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.03.11.mp4', title: 'Proceso de Pintura - Video 5', category: 'hornos', alt: 'Video 5' },
            { type: 'video', src: 'videos/WhatsApp Video 2025-09-19 at 13.03.16.mp4', title: 'Proceso de Pintura - Video 6', category: 'hornos', alt: 'Video 6' }
        ];
        
        this.init();
    }
    
    init() {
        // Cargar las primeras imágenes
        this.loadMore();
        
        // Event listener para el botón
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMore();
        });
    }
    
    loadMore() {
        this.showLoading();
        
        // Simular carga con un pequeño delay para mejor UX
        setTimeout(() => {
            const itemsToLoad = this.galleryItems.slice(this.currentIndex, this.currentIndex + this.itemsPerLoad);
            
            itemsToLoad.forEach((item, index) => {
                setTimeout(() => {
                    this.createGalleryItem(item);
                }, index * 100); // Staggered loading effect
            });
            
            this.currentIndex += this.itemsPerLoad;
            this.hideLoading();
            
            // Ocultar botón si no hay más elementos
            if (this.currentIndex >= this.galleryItems.length) {
                this.loadMoreBtn.style.display = 'none';
            }
        }, 500);
    }
    
    createGalleryItem(item) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'galeria-item loading';
        galleryItem.setAttribute('data-category', item.category);
        
        const mediaContent = item.type === 'image' 
            ? `<img src="${item.src}" alt="${item.alt}" loading="lazy">`
            : `<video muted><source src="${item.src}" type="video/mp4"></video>`;
        
        const overlayIcon = item.type === 'image' 
            ? '<i class="fas fa-search-plus"></i>'
            : '<i class="fas fa-play"></i>';
        
        const overlayText = item.type === 'image' 
            ? 'Ver en grande'
            : 'Ver video';
        
        const durationElement = item.type === 'video' 
            ? '<div class="video-duration">Video</div>'
            : '';
        
        galleryItem.innerHTML = `
            <div class="galeria-media" data-type="${item.type}" data-src="${item.src}" data-title="${item.title}">
                ${mediaContent}
                <div class="galeria-overlay">
                    ${overlayIcon}
                    <span>${overlayText}</span>
                </div>
                ${durationElement}
            </div>
        `;
        
        this.galleryGrid.appendChild(galleryItem);
        
        // Agregar event listener para el lightbox
        const media = galleryItem.querySelector('.galeria-media');
        media.addEventListener('click', () => {
            if (window.gallery) {
                // Actualizar la lista de elementos en el lightbox
                window.gallery.collectMediaItems();
                const allItems = Array.from(this.galleryGrid.querySelectorAll('.galeria-media'));
                const index = allItems.indexOf(media);
                window.gallery.openLightbox(index);
            }
        });
    }
    
    showLoading() {
        this.loadMoreBtn.style.display = 'none';
        this.loadingSpinner.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
        if (this.currentIndex < this.galleryItems.length) {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

// Inicializar galería progresiva
const progressiveGallery = new ProgressiveGallery();

// Galería y Lightbox
class GalleryLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxVideo = document.getElementById('lightbox-video');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxCounter = document.getElementById('lightbox-counter');
        this.lightboxClose = document.querySelector('.lightbox-close');
        this.lightboxPrev = document.getElementById('lightbox-prev');
        this.lightboxNext = document.getElementById('lightbox-next');
        
        this.currentIndex = 0;
        this.mediaItems = [];
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.collectMediaItems();
        this.setupFilters();
    }
    
    setupEventListeners() {
        // Cerrar lightbox
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Navegación
        this.lightboxPrev.addEventListener('click', () => this.previousMedia());
        this.lightboxNext.addEventListener('click', () => this.nextMedia());
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousMedia();
                    break;
                case 'ArrowRight':
                    this.nextMedia();
                    break;
            }
        });
    }
    
    collectMediaItems() {
        this.mediaItems = Array.from(document.querySelectorAll('.galeria-media')).map(item => ({
            element: item,
            type: item.dataset.type,
            src: item.dataset.src,
            title: item.dataset.title,
            category: item.closest('.galeria-item').dataset.category
        }));
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos los botones
                filterButtons.forEach(b => b.classList.remove('active'));
                // Agregar active al botón clickeado
                btn.classList.add('active');
                
                this.currentFilter = btn.dataset.filter;
                this.filterGallery();
            });
        });
    }
    
    filterGallery() {
        const items = document.querySelectorAll('.galeria-item');
        
        items.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
            
            if (shouldShow) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Recolectar items visibles para el lightbox
        this.collectMediaItems();
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        const media = this.mediaItems[index];
        
        if (!media) return;
        
        // Ocultar ambos elementos primero
        this.lightboxImage.style.display = 'none';
        this.lightboxVideo.style.display = 'none';
        
        if (media.type === 'image') {
            this.lightboxImage.src = media.src;
            this.lightboxImage.alt = media.title;
            this.lightboxImage.style.display = 'block';
        } else if (media.type === 'video') {
            this.lightboxVideo.src = media.src;
            this.lightboxVideo.style.display = 'block';
        }
        
        this.lightboxTitle.textContent = media.title;
        this.updateCounter();
        this.updateNavigationButtons();
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Pausar video si está reproduciéndose
        if (this.lightboxVideo.style.display !== 'none') {
            this.lightboxVideo.pause();
        }
    }
    
    previousMedia() {
        if (this.currentIndex > 0) {
            this.openLightbox(this.currentIndex - 1);
        }
    }
    
    nextMedia() {
        if (this.currentIndex < this.mediaItems.length - 1) {
            this.openLightbox(this.currentIndex + 1);
        }
    }
    
    updateCounter() {
        this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.mediaItems.length}`;
    }
    
    updateNavigationButtons() {
        this.lightboxPrev.disabled = this.currentIndex === 0;
        this.lightboxNext.disabled = this.currentIndex === this.mediaItems.length - 1;
    }
}

// Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new GalleryLightbox();
    window.gallery = gallery; // Hacer disponible globalmente para la galería progresiva
});

// Preloader (opcional)
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <div class="preloader-logo-text">
                    <span class="preloader-logo-r">R</span><span class="preloader-logo-poxy">poxi</span>
                </div>
            </div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient-hero);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            text-align: center;
            color: white;
        }
        .preloader-logo {
            margin-bottom: 2rem;
        }
        .preloader-logo-text {
            font-size: 3rem;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .preloader-logo-r {
            color: var(--primary-red);
            text-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
        }
        .preloader-logo-poxy {
            color: var(--primary-black);
            text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid var(--primary-red);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Remover preloader después de cargar
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(preloader);
                document.head.removeChild(style);
            }, 500);
        }, 1000);
    });
}

// Activar preloader solo si la página tarda en cargar
if (document.readyState === 'loading') {
    createPreloader();
}

