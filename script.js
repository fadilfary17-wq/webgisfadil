 document.addEventListener('DOMContentLoaded', function() {
            const landingPage = document.getElementById('landingPage');
            const mainContent = document.getElementById('mainContent');
            const exploreBtn = document.getElementById('exploreBtn');
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const closeBtn = document.getElementById('closeBtn');

            // Pastikan landing page muncul dulu
            landingPage.style.display = 'flex';
            mainContent.style.display = 'none';

            // Tombol Explorasi
            exploreBtn.addEventListener('click', function() {
                landingPage.style.display = 'none';
                mainContent.style.display = 'block';
                showSection('home');
            });

            // Hamburger Menu
            hamburgerBtn.addEventListener('click', function() {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            });

            closeBtn.addEventListener('click', closeSidebar);
            overlay.addEventListener('click', closeSidebar);

            function closeSidebar() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }

            // Function Show Section
            function showSection(sectionId) {
                document.querySelectorAll('section').forEach(function(section) {
                    section.classList.remove('active');
                });

                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }

                document.querySelectorAll('.nav-link').forEach(function(link) {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector('[data-section="' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                closeSidebar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Navigation Links
            document.querySelectorAll('.nav-link').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            });

            // Tombol Lihat Peta
            const viewMapBtn = document.querySelector('.view-map-btn');
            if (viewMapBtn) {
                viewMapBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            }

            // =============================================
            // FETCH GAMBAR DARI BERITA
            // =============================================
            const newsCards = document.querySelectorAll('.news-card');
            newsCards.forEach(function(card) {
                const newsUrl = card.getAttribute('data-news-url');
                if (newsUrl) {
                    fetchNewsImage(newsUrl, card);
                }
            });

            function fetchNewsImage(url, cardElement) {
                // API untuk extract meta image dari URL
                const apiUrl = 'https://api.microlink.io/?url=' + encodeURIComponent(url);
                
                const newsImage = cardElement.querySelector('.news-image');
                
                // Fetch menggunakan microlink.io API
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.data && data.data.image) {
                            // Gambar dari meta tag website
                            newsImage.src = data.data.image.url;
                            newsImage.alt = cardElement.querySelector('h4').textContent;
                        } else {
                            // Fallback ke placeholder jika tidak ada gambar
                            setPlaceholderImage(url, newsImage, cardElement);
                        }
                    })
                    .catch(error => {
                        console.log('Error fetching image:', error);
                        // Fallback jika API error
                        setPlaceholderImage(url, newsImage, cardElement);
                    });
            }

            function setPlaceholderImage(url, imageElement, cardElement) {
                const defaultImages = {
                    'share.google': 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Berita+Semarang',
                    'tribunnews': 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Tribun+Jateng',
                    'suaramerdeka': 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Suara+Merdeka'
                };

                let placeholderUrl = defaultImages['suaramerdeka'];
                if (url.includes('google')) {
                    placeholderUrl = defaultImages['share.google'];
                } else if (url.includes('tribunnews')) {
                    placeholderUrl = defaultImages['tribunnews'];
                }

                imageElement.src = placeholderUrl;
                imageElement.alt = cardElement.querySelector('h4').textContent;
                imageElement.onerror = function() {
                    this.src = 'asset/logo-kota-semarang.jpg';
                };
            }

            // =============================================
            // CAROUSEL/SLIDER FUNCTIONALITY
            // =============================================
            const carouselTrack = document.getElementById('carouselTrack');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const carouselDots = document.getElementById('carouselDots');
            
            let currentSlide = 0;
            const slides = document.querySelectorAll('.carousel-slide');
            const totalSlides = slides.length;

            // Create dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                carouselDots.appendChild(dot);
            }

            const dots = document.querySelectorAll('.carousel-dot');

            function updateCarousel() {
                carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
            }

            function goToSlide(n) {
                currentSlide = n;
                updateCarousel();
            }

            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);

            // Auto-slide every 5 seconds
            setInterval(nextSlide, 5000);
        });
  