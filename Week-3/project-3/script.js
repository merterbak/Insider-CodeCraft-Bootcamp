$(document).ready(function() {
    function renderProducts(products) {
        $('#product-list').empty();
        const $template = $('#product-template').contents();
        
        $.each(products, function(index, product) {
            const $card = $template.clone();
            $card.find('.product-image').attr('src', product.image);
            $card.find('.product-title').text(product.title);
            $card.find('.product-price').text(`$${product.price}`);
            $card.find('.add-to-cart-button').data('id', product.id);
            $card.find('.show-details').data('id', product.id);
            $card.appendTo('#product-list').hide().fadeIn(500);
        });
        
        renderCarousel(products.slice(0, 6));
    }
    
    function renderCarousel(featuredProducts) {
        $('.carousel-container').empty();
        
        $.each(featuredProducts, function(index, product) {
            const $slide = $(`
                <div class="carousel-item">
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}" class="product-image">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-price">$${product.price}</p>
                        <div class="button-group">
                            <button class="button add-to-cart-button" data-id="${product.id}">Add to Cart</button>
                            <button class="button show-details" data-id="${product.id}">Show Details</button>
                        </div>
                    </div>
                </div>
            `);
            $('.carousel-container').append($slide);
        });
        
        setupCarousel();
    }
    
    let currentPosition = 0;
    const itemWidth = 33.333;
    
    function setupCarousel() {
        const itemCount = $('.carousel-item').length;
        const maxPosition = Math.max(0, itemCount - 3);
        
        $('.carousel-control.prev').on('click', function() {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarouselPosition();
            }
        });
        
        $('.carousel-control.next').on('click', function() {
            if (currentPosition < maxPosition) {
                currentPosition++;
                updateCarouselPosition();
            }
        });
        
        updateCarouselPosition();
    }
    
    function updateCarouselPosition() {
        const translateValue = -currentPosition * itemWidth;
        $('.carousel-container').css('transform', `translateX(${translateValue}%)`);
    }

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        $('.cart-items').empty();
        let total = 0;
        
        $.each(cart, function(index, item) {
            const title = item.title || 'Unknown Product';
            const price = item.price !== undefined ? item.price : 0;
            const image = item.image || 'https://via.placeholder.com/50';
            const $item = $(`
                <div class="cart-item" data-key="${item.uniqueKey}">
                    <img src="${image}" alt="${title}">
                    <span>${title}</span>
                    <span>$${price.toFixed(2)}</span>
                    <button class="button remove-button">Remove</button>
                </div>
            `);
            $('.cart-items').append($item);
            total += price;
        });
        
        $('#cart-total').text(total.toFixed(2));
        
        if (cart.length === 0) {
            $('.cart-items').append('<p>Your cart is empty</p>');
        }
    }

    $.ajax({
        url: 'https://fakestoreapi.com/products',
        method: 'GET',
        beforeSend: function() {
            $('#loading-indicator').show();
        },
        success: function(products) {
            renderProducts(products);
            $('#loading-indicator').hide();
        },
        error: function() {
            $('#loading-indicator').hide();
            $('#error-message').fadeIn(500);
            setTimeout(function() {
                $('#error-message').fadeOut(500);
            }, 5000);
        }
    });

    $('#cart-button').on('click', function() {
        $('#cart').slideToggle(300);
        $(this).toggleClass('active');
    });

    function showProductDetails(productId) {
        $.ajax({
            url: `https://fakestoreapi.com/products/${productId}`,
            method: 'GET',
            beforeSend: function() {
                $('#loading-indicator').show();
            },
            success: function(product) {
                $('#modal-content').html(`
                    <div class="product-modal">
                        <img src="${product.image}" alt="${product.title}">
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Price:</strong> $${product.price}</p>
                        <button class="button add-to-cart-button" data-id="${product.id}">Add to Cart</button>
                    </div>
                `);
                $('#product-modal').fadeIn(300);
                $('#loading-indicator').hide();
            },
            error: function() {
                $('#loading-indicator').hide();
                showNotification('Product details could not be loaded', 'error');
            }
        });
    }
    
    function closeModal() {
        $('#product-modal').fadeOut(300);
    }
    
    $(document).on('click', '.close-modal', closeModal);
    
    $(window).on('click', function(event) {
        if ($(event.target).is('#product-modal')) {
            closeModal();
        }
    });

    $(document).on('click', '.add-to-cart-button', function() {
        const $button = $(this);
        const productId = $button.data('id');
        $button.addClass('button-animation');
        setTimeout(function() {
            $button.removeClass('button-animation');
        }, 300);
        
        const isInModal = $button.closest('#modal-content').length > 0;
        let title, price, image;
        
        if (isInModal) {
            const modalProduct = $button.closest('.product-modal');
            title = modalProduct.find('h2').text();
            price = parseFloat(modalProduct.find('p:contains("Price")').text().replace('Price:', '').replace('$', '').trim());
            image = modalProduct.find('img').attr('src');
        } else {
            const $card = $button.closest('.product-card');
            title = $card.find('.product-title').text();
            price = parseFloat($card.find('.product-price').text().replace('$', ''));
            image = $card.find('.product-image').attr('src');
        }
        
        const product = {
            uniqueKey: Date.now(),
            id: productId,
            title: title || 'Unknown',
            price: price,
            image: image,
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        const $cartItem = $(`
            <div class="cart-item" data-key="${product.uniqueKey}">
                <img src="${product.image}" alt="${product.title}">
                <span>${product.title}</span>
                <span>$${product.price.toFixed(2)}</span>
                <button class="button remove-button">Remove</button>
            </div>
        `);
        $('.cart-items').append($cartItem.hide().slideDown(300));
        updateCartTotal();
        $('#cart').slideDown(300);
        showNotification(`${title} added to cart`);
        
        if (isInModal) {
            closeModal();
        }
    });

    $(document).on('click', '.remove-button', function() {
        const $item = $(this).closest('.cart-item');
        const key = $item.data('key');
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(item => item.uniqueKey !== key);
        localStorage.setItem('cart', JSON.stringify(cart));
        $item.slideUp(300, function() {
            $(this).remove();
            updateCartTotal();
            if (cart.length === 0 && $('#cart').is(':visible')) {
                $('.cart-items').append('<p>Your cart is empty</p>');
            }
        });
    });

    $('#clear-cart').on('click', function() {
        localStorage.removeItem('cart');
        $('.cart-items').slideUp(300, function() {
            $(this).empty().append('<p>Your cart is empty</p>').slideDown(300);
            $('#cart-total').text('0.00');
        });
        showNotification('Cart cleared');
    });

    function updateCartTotal() {
        let total = 0;
        $('.cart-item').each(function() {
            const priceText = $(this).find('span').eq(1).text().replace('$', '');
            const price = parseFloat(priceText) || 0;
            total += price;
        });
        $('#cart-total').text(total.toFixed(2));
    }

    $(document).on('click', '.show-details', function() {
        const productId = $(this).data('id');
        $(this).addClass('button-animation');
        setTimeout(function() {
            $(this).removeClass('button-animation');
        }, 300);
        showProductDetails(productId);
    });

    $('#search-box').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('.product-card').each(function() {
            const title = $(this).find('.product-title').text().toLowerCase();
            $(this)[title.includes(query) ? 'fadeIn' : 'fadeOut'](300);
        });
    });

    function showNotification(message, type = 'success') {
        $('.notification').remove();
        const $notification = $(`
            <div class="notification ${type}">
                <p>${message}</p>
            </div>
        `);
        $('body').append($notification);
        $notification.fadeIn(300).delay(2000).fadeOut(300, function() {
            $(this).remove();
        });
    }

    $(document).on('click', '.button', function() {
        $(this)
            .animate({ opacity: 0.5 }, 150)
            .animate({ opacity: 1 }, 150);
    });

    renderCart();
});