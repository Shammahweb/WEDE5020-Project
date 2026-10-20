// ==========================================
// THE ARTISAN BAKERY - JAVASCRIPT
// Written by: Nanga Shammah Sadiki
// Student Number: ST10490123
// ==========================================

window.onload = function () {

    // ==============================
    // 1. ROTATING BACKGROUND IMAGES (every page)
    // ==============================
    var backgroundImages = [
        "images/sourdough.jpg",
        "images/croissant.jpg",
        "images/chocolate brownie.jpg",
        "images/celebration cake.jpg",
        "images/pain au chocolate.jpg",
        "images/cheesecake.jpg",
        "images/carrot cake.jpg"
    ];

    var bgIndex = 0;

    // Show first image immediately
    document.body.style.backgroundImage = "url('" + backgroundImages[0] + "')";

    // Rotate every 5 seconds
    setInterval(function () {
        bgIndex = bgIndex + 1;
        if (bgIndex >= backgroundImages.length) {
            bgIndex = 0;
        }
        document.body.style.backgroundImage = "url('" + backgroundImages[bgIndex] + "')";
    }, 5000);

    // ==============================
    // 2. LOAD TODAY'S SPECIALS
    // ==============================
    var specialsGrid = document.getElementById("specials-grid");

    if (specialsGrid) {
        for (var s = 0; s < todaysSpecials.length; s++) {
            var item = todaysSpecials[s];

            var cardHTML = "";
            cardHTML += "<img src='" + item.image + "' alt='" + item.name + "'>";
            cardHTML += "<h3>" + item.name + "</h3>";
            cardHTML += "<p class='special-price'>R" + item.price.toFixed(2) + "</p>";
            cardHTML += "<p class='special-desc'>" + item.description + "</p>";
            cardHTML += "<button class='add-cart-btn' data-name='" + item.name + "' data-price='" + item.price + "'>Add to Cart</button>";

            var card = document.createElement("div");
            card.className = "special-item";
            card.innerHTML = cardHTML;

            specialsGrid.appendChild(card);
        }

        var specialButtons = specialsGrid.getElementsByClassName("add-cart-btn");
        for (var sb = 0; sb < specialButtons.length; sb++) {
            specialButtons[sb].onclick = function () {
                var name = this.getAttribute("data-name");
                var price = parseFloat(this.getAttribute("data-price"));
                addToCart(name, price);
                showToast(name + " has been added to your cart!");
            };
        }
    }

    // ==============================
    // 3. DYNAMIC GREETING
    // ==============================
    var greetingBox = document.getElementById("greeting");
    if (greetingBox) {
        var now = new Date();
        var hour = now.getHours();
        var greeting = "";

        if (hour < 12) {
            greeting = "Good morning! Fresh bread is ready.";
        } else if (hour < 17) {
            greeting = "Good afternoon! Fresh bread is ready.";
        } else {
            greeting = "Good evening! Fresh bread is ready.";
        }

        greetingBox.innerHTML = greeting;
    }

    // ==============================
    // 4. HAMBURGER MENU TOGGLE
    // ==============================
    var menuButton = document.getElementById("menu-button");
    var navMenu = document.getElementById("nav-menu");

    if (menuButton && navMenu) {
        menuButton.onclick = function (e) {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        };

        document.addEventListener("click", function (e) {
            if (!navMenu.contains(e.target) && e.target !== menuButton) {
                navMenu.classList.remove("show");
            }
        });
    }

    // ==============================
    // 4. DROPDOWN TOGGLE (Mobile Only)
    // ==============================
    var dropdowns = document.getElementsByClassName("dropdown");
    for (var d = 0; d < dropdowns.length; d++) {
        var dropLink = dropdowns[d].querySelector("a");
        
        dropLink.onclick = function (e) {
            // Only run this click logic on mobile (screens smaller than 900px)
            if (window.innerWidth < 900) {
                e.preventDefault();
                e.stopPropagation();
                this.parentElement.classList.toggle("open");
            }
        };
    }

    // ==============================
    // 6. LIGHTBOX GALLERY
    // ==============================
    var productImages = document.querySelectorAll(".product-category img");
    for (var m = 0; m < productImages.length; m++) {
        productImages[m].style.cursor = "pointer";
        productImages[m].onclick = function () {
            openLightbox(this.src, this.alt);
        };
    }

    function openLightbox(imageSrc, imageAlt) {
        var overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";

        var closeBtn = document.createElement("span");
        closeBtn.className = "lightbox-close";
        closeBtn.innerHTML = "&times;";

        var bigImage = document.createElement("img");
        bigImage.src = imageSrc;
        bigImage.alt = imageAlt;
        bigImage.className = "lightbox-image";

        overlay.appendChild(closeBtn);
        overlay.appendChild(bigImage);
        document.body.appendChild(overlay);

        closeBtn.onclick = function () {
            document.body.removeChild(overlay);
        };

        overlay.onclick = function (event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

    // ==============================
    // 7. PRODUCT SEARCH
    // ==============================
    var searchBox = document.getElementById("product-search");
    if (searchBox) {
        searchBox.onkeyup = function () {
            var searchText = searchBox.value.toLowerCase();
            var products = document.querySelectorAll(".product-category li");

            for (var n = 0; n < products.length; n++) {
                var productName = products[n].textContent.toLowerCase();
                if (productName.indexOf(searchText) > -1) {
                    products[n].style.display = "";
                } else {
                    products[n].style.display = "none";
                }
            }
        };
    }

    // ==============================
    // 8. SHOPPING CART - ADD TO CART
    // ==============================
    var addButtons = document.getElementsByClassName("add-cart-btn");

    for (var b = 0; b < addButtons.length; b++) {
        addButtons[b].onclick = function () {
            var name = this.getAttribute("data-name");
            var price = parseFloat(this.getAttribute("data-price"));
            addToCart(name, price);
            showToast(name + " has been added to your cart!");
        };
    }

    function getCart() {
        var cart = localStorage.getItem("artisanCart");
        if (cart) {
            return JSON.parse(cart);
        } else {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem("artisanCart", JSON.stringify(cart));
    }

    function addToCart(name, price) {
        var cart = getCart();
        var found = false;

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) {
                cart[i].quantity = cart[i].quantity + 1;
                found = true;
            }
        }

        if (found === false) {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        saveCart(cart);
        updateCartCount();
    }

    function updateCartCount() {
        var counter = document.getElementById("cart-count");
        if (counter) {
            var cart = getCart();
            var total = 0;
            for (var i = 0; i < cart.length; i++) {
                total = total + cart[i].quantity;
            }
            counter.innerHTML = total;
        }
    }

    // ==============================
    // 9. CART PAGE DISPLAY
    // ==============================
    var cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        showCartItems();
    }

    function showCartItems() {
        var cart = getCart();
        var container = document.getElementById("cart-items");
        var totalBox = document.getElementById("cart-total");
        var checkoutLink = document.getElementById("checkout-link");

        if (cart.length === 0) {
            container.innerHTML = "<p>Your cart is empty. Go to <a href='products.html'>Products</a> to add items.</p>";
            if (totalBox) totalBox.innerHTML = "";
            if (checkoutLink) checkoutLink.style.display = "none";
            return;
        }

        if (checkoutLink) checkoutLink.style.display = "inline-block";

        var table = "<table class='cart-table'><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr>";
        var total = 0;

        for (var i = 0; i < cart.length; i++) {
            var subtotal = cart[i].price * cart[i].quantity;
            total = total + subtotal;

            table += "<tr>";
            table += "<td>" + cart[i].name + "</td>";
            table += "<td>R" + cart[i].price.toFixed(2) + "</td>";
            table += "<td>";
            table += "<button class='qty-btn' onclick='changeQty(" + i + ", -1)'>-</button> ";
            table += cart[i].quantity;
            table += " <button class='qty-btn' onclick='changeQty(" + i + ", 1)'>+</button>";
            table += "</td>";
            table += "<td>R" + subtotal.toFixed(2) + "</td>";
            table += "<td><button class='remove-btn' onclick='removeItem(" + i + ")'>Remove</button></td>";
            table += "</tr>";
        }

        table += "</table>";
        container.innerHTML = table;

        if (totalBox) {
            totalBox.innerHTML = "Total: R" + total.toFixed(2);
        }
    }

    window.changeQty = function (index, change) {
        var cart = getCart();
        cart[index].quantity = cart[index].quantity + change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        saveCart(cart);
        showCartItems();
        updateCartCount();
    };

    window.removeItem = function (index) {
        var cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        showCartItems();
        updateCartCount();
    };

    // ==============================
    // 10. CHECKOUT - ORDER SUMMARY
    // ==============================
    var checkoutSummary = document.getElementById("checkout-summary");
    if (checkoutSummary) {
        showCheckoutSummary();
    }

    function showCheckoutSummary() {
        var cart = getCart();
        var summaryBox = document.getElementById("checkout-summary");

        if (cart.length === 0) {
            summaryBox.innerHTML = "<p>Your cart is empty. Please add items first.</p>";
            return;
        }

        var html = "<h3>Your Order</h3><ul>";
        var total = 0;

        for (var i = 0; i < cart.length; i++) {
            var subtotal = cart[i].price * cart[i].quantity;
            total = total + subtotal;
            html += "<li>" + cart[i].name + " x " + cart[i].quantity + " = R" + subtotal.toFixed(2) + "</li>";
        }

        html += "</ul>";
        html += "<p class='cart-total'>Total: R" + total.toFixed(2) + "</p>";

        summaryBox.innerHTML = html;
    }

    // ==============================
    // 11. DELIVERY / COLLECTION TOGGLE (Option C)
    // ==============================
    var deliveryRadios = document.getElementsByName("fulfilment");
    var addressBox = document.getElementById("delivery-address-box");
    var collectionBox = document.getElementById("collection-info");
    var timeLabel = document.getElementById("order-time-label");

    if (deliveryRadios.length > 0 && addressBox && collectionBox && timeLabel) {
        for (var r = 0; r < deliveryRadios.length; r++) {
            deliveryRadios[r].onchange = function () {
                if (this.value === "delivery") {
                    addressBox.style.display = "block";
                    collectionBox.style.display = "none";
                    timeLabel.innerHTML = "Preferred Delivery Time:";
                } else {
                    addressBox.style.display = "none";
                    collectionBox.style.display = "block";
                    timeLabel.innerHTML = "Preferred Pick-up Time:";
                }
            };
        }
    }

    // ==============================
    // 12. TIME RESTRICTION (shared field)
    // ==============================
    var orderTime = document.getElementById("order-time");
    var today = new Date().getDay();

    if (orderTime) {
        if (today === 0) {
            orderTime.disabled = true;
        } else if (today >= 1 && today <= 5) {
            orderTime.min = "06:00";
            orderTime.max = "18:00";
        } else if (today === 6) {
            orderTime.min = "07:00";
            orderTime.max = "14:00";
        }
    }

    // ==============================
    // 12b. REAL-TIME TIME VALIDATION
    // ==============================
    var orderTimeInput = document.getElementById("order-time");
    var orderTimeError = document.getElementById("order-time-error");

    if (orderTimeInput && orderTimeError) {
        orderTimeInput.onchange = checkTime;
        orderTimeInput.oninput = checkTime;
    }

    function checkTime() {
        if (!orderTimeInput || !orderTimeError) return;

        var time = orderTimeInput.value;
        var day = new Date().getDay();
        var errorMessage = "";

        if (time !== "") {
            if (day === 0) {
                errorMessage = "We are closed on Sundays. Please choose another day.";
            } else if (day >= 1 && day <= 5) {
                if (time < "06:00") {
                    errorMessage = "We open at 06:00 on weekdays. Please choose a later time.";
                } else if (time > "18:00") {
                    errorMessage = "We close at 18:00 on weekdays. Please choose an earlier time.";
                }
            } else if (day === 6) {
                if (time < "07:00") {
                    errorMessage = "We open at 07:00 on Saturdays. Please choose a later time.";
                } else if (time > "14:00") {
                    errorMessage = "We close at 14:00 on Saturdays. Please choose an earlier time.";
                }
            }
        }

        if (errorMessage !== "") {
            orderTimeInput.value = "";
            orderTimeInput.style.borderColor = "red";
            orderTimeError.innerHTML = errorMessage;
            orderTimeError.style.display = "block";
        } else {
            orderTimeInput.style.borderColor = "";
            orderTimeError.innerHTML = "";
            orderTimeError.style.display = "none";
        }
    }

    // ==============================
    // 13. FORM VALIDATION - ENQUIRY
    // ==============================
    var enquiryForm = document.getElementById("enquiry-form");
    if (enquiryForm) {
        enquiryForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your full name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email address.");
                isValid = false;
            }

            var message = document.getElementById("message").value;
            if (message.length < 10) {
                showError("message", "Please write at least 10 characters.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you, " + name + "! Your enquiry has been received.");
                enquiryForm.reset();
            }
        };
    }

    // ==============================
    // 14. FORM VALIDATION - CONTACT
    // ==============================
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email.");
                isValid = false;
            }

            var subject = document.getElementById("subject").value;
            if (subject.length < 3) {
                showError("subject", "Please enter a subject.");
                isValid = false;
            }

            var message = document.getElementById("message").value;
            if (message.length < 10) {
                showError("message", "Please write a longer message.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you, " + name + "! Your message has been sent.");
                contactForm.reset();
            }
        };
    }

    // ==============================
    // 15. FORM VALIDATION - CHECKOUT
    // ==============================
    var checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your full name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email.");
                isValid = false;
            }

            var phone = document.getElementById("phone").value;
            if (phone.length < 7) {
                showError("phone", "Please enter a valid phone number.");
                isValid = false;
            }

            var fulfilment = "delivery";
            var radios = document.getElementsByName("fulfilment");
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    fulfilment = radios[i].value;
                }
            }

            if (fulfilment === "delivery") {
                var address = document.getElementById("address").value;
                if (address.length < 5) {
                    showError("address", "Please enter your delivery address.");
                    isValid = false;
                }
            }

            var time = document.getElementById("order-time").value;
            if (time === "") {
                if (fulfilment === "delivery") {
                    showError("order-time", "Please choose a delivery time.");
                } else {
                    showError("order-time", "Please choose a pick-up time.");
                }
                isValid = false;
            } else {
                var day = new Date().getDay();
                if (day === 0) {
                    showError("order-time", "We are closed on Sundays.");
                    isValid = false;
                } else if (day >= 1 && day <= 5 && (time < "06:00" || time > "18:00")) {
                    showError("order-time", "Mon–Fri times must be between 06:00 and 18:00.");
                    isValid = false;
                } else if (day === 6 && (time < "07:00" || time > "14:00")) {
                    showError("order-time", "Saturday times must be between 07:00 and 14:00.");
                    isValid = false;
                }
            }

            // ===== Check card details if card was chosen =====
            var payment = "cash";
            var payRadios = document.getElementsByName("payment");
            for (var pi = 0; pi < payRadios.length; pi++) {
                if (payRadios[pi].checked) {
                    payment = payRadios[pi].value;
                }
            }

            if (payment === "card") {
                var cardName = document.getElementById("card-name").value;
                if (cardName.length < 2) {
                    showError("card-name", "Please enter the name on the card.");
                    isValid = false;
                }

                var cardNum = document.getElementById("card-number").value.replace(/\s/g, "");
                if (cardNum.length !== 16 || isNaN(cardNum)) {
                    showError("card-number", "Please enter a valid 16-digit card number.");
                    isValid = false;
                }

                var expiry = document.getElementById("card-expiry").value;
                if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                    showError("card-expiry", "Please use the format MM/YY.");
                    isValid = false;
                } else {
                    var month = parseInt(expiry.substring(0, 2));
                    if (month < 1 || month > 12) {
                        showError("card-expiry", "Month must be between 01 and 12.");
                        isValid = false;
                    }
                }

                var cvv = document.getElementById("card-cvv").value;
                if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
                    showError("card-cvv", "Please enter a valid 3 or 4 digit CVV.");
                    isValid = false;
                }
            }

            // Submit if all valid
            if (isValid) {
                
                // 1. Generate Order Number and Date
                var orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
                var date = new Date().toLocaleString();

                // 2. Calculate Total
                var cart = getCart();
                var total = 0;
                for (var c = 0; c < cart.length; c++) {
                    total += (cart[c].price * cart[c].quantity);
                }

                // 3. Create the order object
                var orderData = {
                    orderNumber: orderNumber,
                    date: date,
                    name: name,
                    email: email,
                    phone: phone,
                    fulfilment: fulfilment,
                    address: (fulfilment === "delivery") ? document.getElementById("address").value : "N/A",
                    time: time,
                    payment: payment,
                    cart: cart,
                    total: total
                };

                // 4. Save to localStorage
                localStorage.setItem("lastOrder", JSON.stringify(orderData));

                // 5. Clear the cart
                localStorage.removeItem("artisanCart");

                // 6. Redirect to receipt page
                window.location.href = "receipt.html";
            }
        };
    }

    // ==============================
    // 16. HELPER FUNCTIONS
    // ==============================
    function showError(fieldId, errorMessage) {
        var input = document.getElementById(fieldId);
        var errorBox = document.getElementById(fieldId + "-error");

        if (input) {
            input.style.borderColor = "red";
        }

        if (errorBox) {
            errorBox.innerHTML = errorMessage;
            errorBox.style.display = "block";
        }
    }

    function clearErrors() {
        var errorBoxes = document.getElementsByClassName("error-msg");
        for (var p = 0; p < errorBoxes.length; p++) {
            errorBoxes[p].innerHTML = "";
            errorBoxes[p].style.display = "none";
        }

        var inputs = document.querySelectorAll("input, textarea, select");
        for (var q = 0; q < inputs.length; q++) {
            inputs[q].style.borderColor = "";
        }
    }

    // ==============================
    // 17. UPDATE CART COUNT ON LOAD
    // ==============================
    updateCartCount();

    // ==============================
    // PAYMENT METHOD TOGGLE
    // ==============================

    var paymentRadios = document.getElementsByName("payment");
    var cardDetails = document.getElementById("card-details");

    if (paymentRadios.length > 0 && cardDetails) {
        for (var pr = 0; pr < paymentRadios.length; pr++) {
            paymentRadios[pr].onchange = function () {
                if (this.value === "card") {
                    cardDetails.style.display = "block";
                } else {
                    cardDetails.style.display = "none";
                }
            };
        }
    }

    // ==============================
    // CARD NUMBER FORMATTING
    // ==============================

    var cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
        cardNumberInput.oninput = function () {
            // Remove anything that isn't a digit
            var digits = this.value.replace(/\D/g, "");
            // Limit to 16 digits
            digits = digits.substring(0, 16);
            // Add a space every 4 digits
            var formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
            this.value = formatted;
        };
    }

    var cardExpiryInput = document.getElementById("card-expiry");
    if (cardExpiryInput) {
        cardExpiryInput.oninput = function () {
            var digits = this.value.replace(/\D/g, "");
            digits = digits.substring(0, 4);
            if (digits.length >= 3) {
                this.value = digits.substring(0, 2) + "/" + digits.substring(2);
            } else {
                this.value = digits;
            }
        };
    }

    // ==============================
    // 18. GENERATE RECEIPT PAGE
    // ==============================
    var receiptContainer = document.getElementById("receipt-container");
    if (receiptContainer) {
        var orderData = localStorage.getItem("lastOrder");
        
        if (orderData) {
            var order = JSON.parse(orderData);
            var html = "";

            html += "<h2 style='text-align:center; border-bottom:none; margin-bottom:0;'>Order Receipt</h2>";
            html += "<p style='text-align:center; color:#666; margin-bottom: 1.5rem;'>Thank you for your order!</p>";
            
            html += "<div style='background:#FFF8F2; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #FFC107;'>";
            html += "<p><strong>Order Number:</strong> " + order.orderNumber + "</p>";
            html += "<p><strong>Date:</strong> " + order.date + "</p>";
            html += "<p><strong>Name:</strong> " + order.name + "</p>";
            html += "<p><strong>Method:</strong> " + order.fulfilment.toUpperCase() + "</p>";
            
            if (order.fulfilment === "delivery") {
                html += "<p><strong>Address:</strong> " + order.address + "</p>";
            }
            
            html += "<p><strong>Time:</strong> " + order.time + "</p>";
            html += "<p><strong>Payment:</strong> " + order.payment.toUpperCase() + "</p>";
            html += "</div>";

            html += "<h3>Items Ordered</h3>";
            html += "<table style='width:100%; border-collapse:collapse; margin-bottom:1.5rem;'>";
            html += "<tr style='border-bottom: 2px solid #eee; text-align:left;'><th>Qty</th><th>Item</th><th style='text-align:right;'>Price</th></tr>";
            
            for (var i = 0; i < order.cart.length; i++) {
                var item = order.cart[i];
                var sub = item.price * item.quantity;
                html += "<tr style='border-bottom: 1px solid #eee;'>";
                html += "<td style='padding: 0.5rem 0;'>" + item.quantity + "x</td>";
                html += "<td>" + item.name + "</td>";
                html += "<td style='text-align:right;'>R" + sub.toFixed(2) + "</td>";
                html += "</tr>";
            }
            html += "</table>";

            html += "<h3 style='text-align:right; color:#714435;'>Total Paid: R" + order.total.toFixed(2) + "</h3>";
            
            html += "<div style='text-align:center; margin-top: 2rem;'>";
            html += "<a href='index.html' class='btn'>Return to Home</a>";
            html += "</div>";

            receiptContainer.innerHTML = html;
        } else {
            receiptContainer.innerHTML = "<h2>No order found</h2><p>Please place an order first.</p><div style='text-align:center; margin-top:20px;'><a href='products.html' class='btn'>Go to Products</a></div>";
        }
    }

    // ==============================
    // 19. CUSTOM TOAST NOTIFICATION
    // ==============================
    function showToast(message) {
        // Create container if it doesn't exist
        var container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }

        // Create the toast element
        var toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = message;
        
        container.appendChild(toast);

        // Trigger the slide-in animation
        setTimeout(function() {
            toast.classList.add("show");
        }, 10);

        // Remove the toast after 3 seconds
        setTimeout(function() {
            toast.classList.remove("show");
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300); // Wait for fade out
        }, 3000);
    }

};